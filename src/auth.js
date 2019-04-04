// $NoFlow
const { prisma } = require('../prisma/generated/prisma-client');
// To show all object fields and methods instead of [object Object]
const util = require('util');

const typeDefs = [`
	type Mutation {
		login(email: String, password: String): String,
		signup(email: String, password: String): String
	}
`];

var resolvers = {
	Mutation: {
		// $NoFlow
		login: async (_, { email, password }, context) => {
			// console.log(`\nLogin\ne-mail: ${email}\npassword: ${password}\n`);
			return logIn(email, password, context.ip);
		},
		// $NoFlow
		signup: async (_, { email, password }, context) => {
			let message = 'ok';
			console.log("IP", context.ip);
			console.log(`\nSign Up\ne-mail: ${email}\npassword: ${password}`);
			await signUp(email, password, context.ip).catch((error) => {
				message = error;
			});
			return message;
		}
	}
};

// TODO Add a delay on 3 failed attempts; detect and ban bruteforcers
async function logIn(email: string, password: string, ip: string) {
	let attemptSuccessful: boolean;
	let loginResponse: string;
	let badEmail: boolean;
	let badPassword: boolean;
	// Will be set to an actual base64 token on successful attempt
	let authToken: string = 'none';
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
	} else { // Login successful
		// Generate an authToken from random string
		let randomString: string = Math.random().toString(36).substring(2, 15)
		+ Math.random().toString(36).substring(2, 15); // 20-22 chars
		authToken = Buffer.from(randomString).toString('base64');
		attemptSuccessful = true;
		badEmail = false;
		badPassword = false;
		loginResponse = 'authToken: ' + authToken;
		// Add an additional token to the list
		user.authTokens.push(authToken);
		const updatedUser = await prisma.updateUser({
			data: {
				authTokens: {
					set: user.authTokens
				}
			},
			where: {
				id: user.id
			}
		});
	}
	recordLoginAttempt(attemptSuccessful,
		badEmail, badPassword, email, password, ip, authToken);
	return loginResponse;
}

// Used by logIn()
async function recordLoginAttempt(successful: boolean,
	badEmail: boolean, badPassword: boolean, email: string,
	password: string, ip: string, authToken: string) {
	const newLoginAttempt = await prisma.createLoginAttempt({
		successful: successful,
		badEmail: badEmail,
		badPassword: badPassword,
		email: email,
		password: password,
		authToken: authToken,
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
			console.log(`New ${successful ? 'successful' : 'failed'} login attempt\n`
				+`email: ${result.email}\n`
				+`password: ${result.password}`);
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
		authTokens: {
			set: []
		},
		signedUpOn: new Date()
	}).catch((error) => {
		// Show complete error object
		// console.log(util.inspect(error, {showHidden: false, depth: null}));
		let errorMessage = error.result.errors[0].message;
		if (errorMessage.includes("A unique constraint would be violated on User." +
			" Details: Field name = email")) {
			console.log('\x1b[31m'); // Red color
			console.log(`Error: e-mail ${email} already in use;` +
				`password: ${password};\n` +
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
			// Log in a user right after signing them up
			// In other words, send them an authToken
			logIn(email, password, ip);
			// The 'OK' message has no impact at all (see apollo.js)
			return Promise.resolve('OK');
		} else {
			return Promise.reject(result); // Return error
		}
	});
}
// Export typeDefs & resolvers to be combined into one schema along with others
module.exports = {
	typeDefs,
	resolvers
};