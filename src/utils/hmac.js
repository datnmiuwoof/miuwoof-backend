// const { webcrypto } = require('crypto');

// const { subtle } = webcrypto;
// const encoder = new TextEncoder();

// export async function hmacSHA256(key, data) {
//     const cryptoKey = await subtle.importKey(
//         "raw",
//         encoder.encode(key),
//         { name: "HMAC", hash: "SHA-256" },
//         false,
//         ["sign"]
//     );

//     const signature = await subtle.sign("HMAC", cryptoKey, encoder.encode(data));
//     return Buffer.from(signature).toString("hex");
// }

// export async function hmacSHA512(key, data) {
//     const cryptoKey = await subtle.importKey(
//         "raw",
//         encoder.encode(key),
//         { name: "HMAC", hash: "SHA-512" },
//         false,
//         ["sign"]
//     );

//     const signature = await subtle.sign("HMAC", cryptoKey, encoder.encode(data));
//     return Buffer.from(signature.toString("hex"));
// }