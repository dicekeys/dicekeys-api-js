// // import {
// //   toNameMap
// // } from "./to-name-map";
// import * as ApiCalls from "./api-calls";

// const windowName = "windowName";
// const requestId = "requestId";
// const plaintext = "plaintext";
// const command = "command";
// const respondTo = "respondTo";
// const authToken = "authToken";
// const password = "password";
// //const passwordWithRecipe = "passwordWithRecipe";
// const recipe = "recipe";
// const packagedSealedMessageFields = "packagedSealedMessageFields";
// const exception = "exception";
// const message = "message";
// const stack = "stack";
// const signature = "signature";
// const sealingKeyFields = "sealingKeyFields";
// const secretFields = "secretFields";
// const signingKeyFields = "signingKeyFields";
// const symmetricKeyFields = "symmetricKeyFields";
// const unsealingKeyFields = "unsealingKeyFields";
// const signatureVerificationKeyFields = "signatureVerificationKeyFields";


// export const Commands = ApiCalls.Command;
// export const MetaCommands = (() => {
//   const getAuthToken = "getAuthToken";
//   return {
//     getAuthToken,
//    } as const;
// })();

// export type Command = keyof typeof Commands;
// export type MetaCommand = keyof typeof MetaCommands;
// export const isCommand = (str: string | undefined): str is Command =>
//   str != null && str in Commands;
// export const isMetaCommand = (str: string | undefined): str is MetaCommand =>
//   str != null && str in MetaCommands;

// const withRecipe = {
//   recipe
// } as const;

// const getObject = {
//   ...withRecipe
// } as const;

// const unsealingInstructions = "unsealingInstructions";
// const unsealing = {
//   packagedSealedMessageFields: packagedSealedMessageFields
// } as const;


// export const Inputs = {
//   COMMON: {
//     // For tracking requests, but invisible to command-handling code
//     requestId,
//     command,
//     // For message-based API
//     windowName,
//     // For URL-based API
//     respondTo,
//     authToken,
//   } as const,

//   withRecipe,
//   unsealing,

//   // For URL-based APIs, the command name and the https uri to respond to
//   generateSignature: {
//     ...withRecipe,
//     message: "message"
//   } as const,

//   getPassword: getObject,
//   getSealingKey: getObject,
//   getSecret: getObject,
//   getSignatureVerificationKey: getObject,
//   getSigningKey: getObject,
//   getSymmetricKey: getObject,
//   getUnsealingKey: getObject,

//   sealWithSymmetricKey: {
//     ...withRecipe,
//     plaintext,
//     unsealingInstructions
//   } as const,

//   unsealWithSymmetricKey: unsealing,
//   unsealWithUnsealingKey: unsealing,

// }

// export const Outputs = {
//   COMMON: {
//     requestId,
//     exception,
//     message,
//     stack
//   } as const,

//   generateSignature: {
//     signature,
//     signatureVerificationKeyFields
//   } as const,

//   getAuthToken: {
//     authToken
//   } as const,

//   getPassword: {
//     recipe,
//     password
// //    passwordWithRecipe
//   } as const,

//   getSealingKey: {
//     sealingKeyFields
//   } as const,

//   getSecret: {
//     secretFields
//   } as const,

//   getSignatureVerificationKey: {
//     signatureVerificationKeyFields
//   } as const,

//   getSigningKey: {
//     signingKeyFields
//   } as const,

//   getSymmetricKey: {
//     symmetricKeyFields
//   } as const,

//   getUnsealingKey: {
//     unsealingKeyFields
//   } as const,

//   sealWithSymmetricKey: {
//     packagedSealedMessageFields
//   } as const,

//   unsealWithSymmetricKey: {
//     plaintext
//   } as const,

//   unsealWithUnsealingKey: {
//     plaintext
//   } as const,
// }

