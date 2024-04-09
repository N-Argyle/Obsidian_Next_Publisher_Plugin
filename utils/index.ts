import * as crypto from "crypto";

export function encryptString(plainText: string, masterPassword: string) {
	const algorithm = "aes-256-cbc";
	const key = crypto.scryptSync(masterPassword, "salt", 32);
	const iv = Buffer.alloc(16, 0); // Initialization vector

	const cipher = crypto.createCipheriv(algorithm, key, iv);
	let encrypted = cipher.update(plainText, "utf8", "hex");
	encrypted += cipher.final("hex");

	return encrypted;
}

// Function to decrypt a string using the master password
export function decryptString(encryptedText: string, masterPassword: string) {
	const algorithm = "aes-256-cbc";
	const key = crypto.scryptSync(masterPassword, "salt", 32);
	const iv = Buffer.alloc(16, 0); // Initialization vector

	const decipher = crypto.createDecipheriv(algorithm, key, iv);
	let decrypted = decipher.update(encryptedText, "hex", "utf8");
	decrypted += decipher.final("utf8");

	return decrypted;
}
