// $NoFlow
const { prisma } = require('../prisma/generated/prisma-client');
// To show all object fields and methods instead of [object Object]
const util = require('util');

// TODO Add a delay on 3 failed attempts; detect and ban bruteforcers
async function authenticateUser(email: string, password: string, ip: string) {
	let attemptSuccessful: boolean;
	let loginResponse: string;
	let badEmail: boolean;
	let badPassword: boolean;
	// Generate an authToken from random string
	let randomString: string = Math.random().toString(36).substring(2, 15)
		+ Math.random().toString(36).substring(2, 15); // 20-22 chars
	let authToken: string = Buffer.from(randomString).toString('base64');
	// Lookup email in the DB
	const user = await prisma.user({ email: email });
	if (user === null) {
		attemptSuccessful = false;
		badEmail = true;
		badPassword = true;
		loginResponse = 'bad credentials';
	} else if (user.password !== password) {
		// User exists but the password is invalid
		attemptSuccessful = false;
		badEmail = false;
		badPassword = true;
		loginResponse = 'bad credentials';
	} else {
		attemptSuccessful = true;
		badEmail = false;
		badPassword = false;
		loginResponse = 'authToken: ' + authToken;
	}
	recordLoginAttempt(attemptSuccessful,
		badEmail, badPassword, email, password, ip);
	return loginResponse;
}

// Used by authenticateUser()
async function recordLoginAttempt(successful: boolean, badEmail: boolean,
	badPassword: boolean, email: string, password: string, ip: string) {
	const newLoginAttempt = await prisma.createLoginAttempt({
		successful: successful,
		badEmail: badEmail,
		badPassword: badPassword,
		email: email,
		password: password,
		time: new Date(),
		ip: ip
	}).catch((error) => {
		// Show complete error object
		// console.log(util.inspect(error, {showHidden: false, depth: null}));
		let errorMessage = error.result.errors[0].message;
		console.log('\x1b[31m'); // Red color
		console.log('LogIn error: ', errorMessage);
		console.log('\x1b[0m'); // Reset color back to normal
	}).then((result) => {
		if (result === undefined) {
			console.log('\x1b[31m'); // Red color
			console.log('LogIn error: result is undefined');
			console.log('\x1b[0m'); // Reset color back to normal
			return Promise.reject('error: unknown error');
		}
		// Show complete result object
		// console.log(util.inspect(result, {showHidden: false, depth: null}));
		// No errors (GraphQL object not a string) thus .toString()
		if (!result.toString().includes("error")) {
			console.log(`\x1b[${successful ? '32' : '31'}m`); // Green or red color
			console.log(`New ${successful ? 'successful' : 'failed'} login attempt\n` +
			`email: ${result.email}\n` +
			`password: ${result.password}`);
			console.log('\x1b[0m'); // Reset color back to normal
			return Promise.resolve('OK');
		} else {
			return Promise.reject(result); // Return error
		}
	});
}

// TODO login and save ip in LoginAttempt right after signup
async function signUp(email: string, password: string, ip: string) {
	const newUser = await prisma.createUser({
		email: email,
		password: password,
		signedUpOn: new Date()
	}).catch((error) => {
		// Show complete error object
		// console.log(util.inspect(error, {showHidden: false, depth: null}));
		let errorMessage = error.result.errors[0].message;
		if (errorMessage.includes("A unique constraint would be violated on User." +
			" Details: Field name = email")) {
			console.log('\x1b[31m'); // Red color
			console.log(`Error: e-mail ${email} already in use; password: ${password};\n` +
				`time: ${(new Date()).toString()}`);
			console.log('\x1b[0m'); // Reset color back to normal
			return 'error: email in use';
		} else {
			console.log('\x1b[31m'); // Red color
			console.log('SignUp error: ', errorMessage);
			console.log('\x1b[0m'); // Reset color back to normal
		}
	}).then((result) => {
		if (result === undefined) {
			console.log('\x1b[31m'); // Red color
			console.log('SignUp error: result is undefined');
			console.log('\x1b[0m'); // Reset color back to normal
			return Promise.reject('error: unknown error');
		}
		// Show complete result object
		// console.log(util.inspect(result, {showHidden: false, depth: null}));
		// No errors (GraphQL object not a string) thus .toString()
		if (!result.toString().includes("error")) {
			console.log(`New user signed up on ${result.signedUpOn}\n` +
			`ID: ${result.id}\n` +
			`email: ${result.email}\n` +
			`password: ${result.password}`);
			return Promise.resolve('OK');
		} else {
			return Promise.reject(result); // Return error
		}
	});
}

module.exports = {
	signupUser: function(email: string, pass: string, ip:string): Promise<any> {
		return signUp(email, pass, ip);
	},
	loginUser: function(email: string, password: string, ip: string): Promise<any> {
		return authenticateUser(email, password, ip);
	}
};