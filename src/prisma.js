// $NoFlow
const { prisma } = require('../prisma/generated/prisma-client');
// To show all object fields and methods instead of [object Object]
const util = require('util');

// A `main` function so that we can use async/await
async function main() {

	// Read all users from the database and print them to the console
	// const allUsers = await prisma.users();
	// console.log(allUsers);
}

async function signUp(email: string, password: string) {
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
		}
	}).then((result) => {
		if (result === undefined) {
			console.log('\x1b[31m'); // Red color
			console.log('Error: result is undefined');
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
	init: function() {
		main().catch(e => console.error(e));		
	},
	addUser: function(email: string, pass: string): Promise<any> {
		return signUp(email, pass);
	}
};