const windowName = "windowName";
const requestId = "requestId";
const plaintext = "plaintext";
const command = "command";
const respondTo = "respondTo";
const authToken = "authToken";
const password = "password";
//const passwordWithDerivationOptionsJson = "passwordWithDerivationOptionsJson";
const derivationOptionsJson = "derivationOptionsJson";
const packagedSealedMessageFields = "packagedSealedMessageFields";
const exception = "exception";
const message = "message";
const stack = "stack";
const signature = "signature";
const sealingKeyFields = "sealingKeyFields";
const secretFields = "secretFields";
const signingKeyFields = "signingKeyFields";
const symmetricKeyFields = "symmetricKeyFields";
const unsealingKeyFields = "unsealingKeyFields";
const signatureVerificationKeyFields = "signatureVerificationKeyFields";


export const Commands = (() => {
  const generateSignature = "generateSignature";
  const getPassword = "getPassword";
  const getSealingKey = "getSealingKey";
  const getSecret = "getSecret";
  const getSignatureVerificationKey = "getSignatureVerificationKey";
  const getSigningKey = "getSigningKey";
  const getSymmetricKey = "getSymmetricKey";
  const getUnsealingKey = "getUnsealingKey";
  const sealWithSymmetricKey = "sealWithSymmetricKey";
  const unsealWithSymmetricKey = "unsealWithSymmetricKey";
  const unsealWithUnsealingKey = "unsealWithUnsealingKey";
  return {
    generateSignature,
    getPassword,
    getSealingKey,
    getSecret,
    getSignatureVerificationKey,
    getSigningKey,
    getSymmetricKey,
    getUnsealingKey,
    sealWithSymmetricKey,
    unsealWithSymmetricKey,
    unsealWithUnsealingKey,
   } as const;
})();
export const MetaCommands = (() => {
  const getAuthToken = "getAuthToken";
  return {
    getAuthToken,
   } as const;
})();

export type Command = keyof typeof Commands;
export type MetaCommand = keyof typeof MetaCommands;
export const isCommand = (str: string | undefined): str is Command =>
  str != null && str in Commands;
export const isMetaCommand = (str: string | undefined): str is MetaCommand =>
  str != null && str in MetaCommands;

const withDerivationOptions = {
  derivationOptionsJson
} as const;

const getObject = {
  ...withDerivationOptions
} as const;

const unsealingInstructions = "unsealingInstructions";
const unsealing = {
  packagedSealedMessageFields: packagedSealedMessageFields
} as const;


export const Inputs = {
  COMMON: {
    // For tracking requests, but invisible to command-handling code
    requestId,
    command,
    // For message-based API
    windowName,
    // For URL-based API
    respondTo,
    authToken,
  } as const,

  withDerivationOptions,
  unsealing,

  // For URL-based APIs, the command name and the https uri to respond to
  generateSignature: {
    ...withDerivationOptions,
    message: "message"
  } as const,

  getPassword: getObject,
  getSealingKey: getObject,
  getSecret: getObject,
  getSignatureVerificationKey: getObject,
  getSigningKey: getObject,
  getSymmetricKey: getObject,
  getUnsealingKey: getObject,

  sealWithSymmetricKey: {
    ...withDerivationOptions,
    plaintext,
    unsealingInstructions
  } as const,

  unsealWithSymmetricKey: unsealing,
  unsealWithUnsealingKey: unsealing,

}

export const Outputs = {
  COMMON: {
    requestId,
    exception,
    message,
    stack
  } as const,

  generateSignature: {
    signature,
    signatureVerificationKeyFields
  } as const,

  getAuthToken: {
    authToken
  } as const,

  getPassword: {
    derivationOptionsJson,
    password
//    passwordWithDerivationOptionsJson
  } as const,

  getSealingKey: {
    sealingKeyFields
  } as const,

  getSecret: {
    secretFields
  } as const,

  getSignatureVerificationKey: {
    signatureVerificationKeyFields
  } as const,

  getSigningKey: {
    signingKeyFields
  } as const,

  getSymmetricKey: {
    symmetricKeyFields
  } as const,

  getUnsealingKey: {
    unsealingKeyFields
  } as const,

  sealWithSymmetricKey: {
    packagedSealedMessageFields
  } as const,

  unsealWithSymmetricKey: {
    plaintext
  } as const,

  unsealWithUnsealingKey: {
    plaintext
  } as const,
}

