import {
  Inputs,
  Outputs,
  Commands,
} from "./api-strings";
import * as ApiMessages from "./api-messages";
import {
  PackagedSealedMessageFields,
  SecretFields,
  SymmetricKeyFields,
  UnsealingKeyFields,
  SealingKeyFields,
  SignatureVerificationKeyFields,
  SigningKeyFields,
  SeededCryptoJsObject
} from "./seeded-crypto-object-fields"
import {
  randomBytes
} from "crypto";

export interface GenerateSignatureResult {
  signature: Uint8Array
  signatureVerificationKey: SignatureVerificationKeyFields
}

export interface ApiClientImplementation{
  <METHOD extends ApiMessages.ApiMethod>(
    request: ApiMessages.REQUEST_OF<METHOD>,
    processResponse: (unmarshallerForResponse: UnmsarshallerForResponse) =>
      ApiMessages.RESPONSE_OF<METHOD> | Promise<ApiMessages.RESPONSE_OF<METHOD>>
  ): Promise<ApiMessages.RESPONSE_OF<METHOD>>
}

export interface UnmsarshallerForResponse {
  getOptionalStringParameter: (name: string) => string | undefined;
  getStringParameter: (name: string) => string;
  getJsObjectParameter: <T extends SeededCryptoJsObject>(name: string) => T;
  getBinaryParameter: (name: string) => Uint8Array;
}

export const generateRequestId = (): string => {
  var requestIdBytes: Uint8Array;
  if (global.window && window.crypto) {
    requestIdBytes = new Uint8Array(20);
    crypto.getRandomValues(requestIdBytes);
  } else {
    requestIdBytes = randomBytes(20);
  }
  return [...requestIdBytes].map( byte => byte.toString(16) ).join("");
}

/**
 * Sign a [[message]] using a public/private signing key pair derived
 * from the user's DiceKey and the derivation options specified in
 * JSON format via [[derivationOptionsJson]].
 */

export const generateSignatureFactory = (call: ApiClientImplementation) =>
/**
  * Sign a [[message]] using a public/private signing key pair derived
  * from the user's DiceKey and the derivation options specified in
  * JSON format via [[derivationOptionsJson]].
  */
  (
    derivationOptionsJson: string,
    message: Uint8Array
  ) => call(
    {
      command: Commands.generateSignature,
      derivationOptionsJson,
      message
    },
    p => ({
      signature: p.getBinaryParameter(Outputs.generateSignature.signature),
      signatureVerificationKey: p.getJsObjectParameter<SignatureVerificationKeyFields>(Outputs.generateSignature.signatureVerificationKey)
    })
  )

  /**
   * Derive a pseudo-random cryptographic [Secret] from the user's DiceKey and
   * the key-derivation options passed as [derivationOptionsJson]
   * in [Key-Derivation Options JSON Format](hhttps://dicekeys.github.io/seeded-crypto/derivation_options_format.html).
   */
export const getSecretFactory = (call: ApiClientImplementation) => (
  derivationOptionsJson: string
) => call<ApiMessages.GetSecret>(
  {
    command: Commands.getSecret,
    derivationOptionsJson
  },
  p => p.getJsObjectParameter<SecretFields>(Outputs.getSecret.secret)
);

export const getPasswordFactory = (call: ApiClientImplementation) => (
  derivationOptionsJson: string,
  wordLimit?: number
) => call<ApiMessages.GetPassword>(
  {
    command: Commands.getPassword,
    derivationOptionsJson,
    ...( wordLimit  != null ?
      {[Inputs.getPassword.wordLimit]: wordLimit} :
      {}
    )    
  },
  p => ({
    password: p.getStringParameter(Outputs.getPassword.password),
    derivationOptionsJson: p.getStringParameter(Outputs.getPassword.derivationOptionsJson)
  })
);

/**
 * Get an [UnsealingKey] derived from the user's DiceKey (the seed) and the key-derivation options
 * specified via [derivationOptionsJson],
 * in [Key-Derivation Options JSON Format](hhttps://dicekeys.github.io/seeded-crypto/derivation_options_format.html),
 * which must specify
 *  `"clientMayRetrieveKey": true`.
 */
export const getUnsealingKeyFactory = (call: ApiClientImplementation) => (
  derivationOptionsJson: string
) => call<ApiMessages.GetUnsealingKey>(
  {
    command: Commands.getUnsealingKey,
    derivationOptionsJson
  },
  p => p.getJsObjectParameter<UnsealingKeyFields>(Outputs.getUnsealingKey.unsealingKey)
);


/**
 * Get a [SymmetricKey] derived from the user's DiceKey (the seed) and the key-derivation options
 * specified via [derivationOptionsJson],
 * in [Key-Derivation Options JSON Format](hhttps://dicekeys.github.io/seeded-crypto/derivation_options_format.html),
 * which must specify
 *  `"clientMayRetrieveKey": true`.
 */
export const getSymmetricKeyFactory = (call: ApiClientImplementation) => (
  derivationOptionsJson: string
) => call<ApiMessages.GetSymmetricKey>(
  {
    command: Commands.getSymmetricKey,
    derivationOptionsJson
  },
  p => p.getJsObjectParameter<SymmetricKeyFields>(Outputs.getSymmetricKey.symmetricKey)
);

/**
 * Get a [SigningKey] derived from the user's DiceKey (the seed) and the key-derivation options
 * specified via [derivationOptionsJson],
 * in [Key-Derivation Options JSON Format](hhttps://dicekeys.github.io/seeded-crypto/derivation_options_format.html),
 * which must specify
 *  `"clientMayRetrieveKey": true`.
 */
export const getSigningKeyFactory = (call: ApiClientImplementation) => (
  derivationOptionsJson: string
) => call<ApiMessages.GetSigningKey>(
  {
    command: Commands.getSigningKey,
    derivationOptionsJson
  },
  p => p.getJsObjectParameter<SigningKeyFields>(Outputs.getSigningKey.signingKey)
);

/**
 * Get a [SealingKey] derived from the user's DiceKey and the [ApiDerivationOptions] specified
 * in [Key-Derivation Options JSON Format](hhttps://dicekeys.github.io/seeded-crypto/derivation_options_format.html)
 * as [derivationOptionsJson].
 */
export const getSealingKeyFactory = (call: ApiClientImplementation) => (
  derivationOptionsJson: string
) => call<ApiMessages.GetSealingKey>(
  {
    command: Commands.getSealingKey,
    derivationOptionsJson
  },
   p => p.getJsObjectParameter<SealingKeyFields>(Outputs.getSealingKey.sealingKey)
);


/**
 * Unseal (decrypt & authenticate) a message that was previously sealed with a
 * [SealingKey] to construct a [PackagedSealedMessage].
 * The public/private key pair will be re-derived from the user's seed (DiceKey) and the
 * key-derivation options packaged with the message.  It will also ensure that the
 * unsealing_instructions instructions have not changed since the message was packaged.
 *
 * @throws [CryptographicVerificationFailureException]
 */
export const unsealWithUnsealingKeyFactory = (call: ApiClientImplementation) => (
  packagedSealedMessage: PackagedSealedMessageFields
) => call<ApiMessages.UnsealWithUnsealingKey>(
  {
    command: Commands.unsealWithUnsealingKey,
    packagedSealedMessage
  },
  p => p.getBinaryParameter(Outputs.unsealWithUnsealingKey.plaintext)
);

/**
 * Seal (encrypt with a message-authentication code) a message ([plaintext]) with a
 * symmetric key derived from the user's DiceKey, the
 * [derivationOptionsJson]
 * in [Key-Derivation Options JSON Format](hhttps://dicekeys.github.io/seeded-crypto/derivation_options_format.html),
 * and [UnsealingInstructions] specified via a JSON string as
 * [unsealingInstructions] in the
 * in [Post-Decryption Instructions JSON Format](https://dicekeys.github.io/seeded-crypto/unsealing_instructions_format.html).
 */
export const sealWithSymmetricKeyFactory = (call: ApiClientImplementation) => (
  derivationOptionsJson: string,
  plaintext: Uint8Array,
  unsealingInstructions: string = ""
) =>
  call<ApiMessages.SealWithSymmetricKey>(
    {
      command: Commands.sealWithSymmetricKey, 
      derivationOptionsJson,
      plaintext,
      unsealingInstructions  
    },
    p => p.getJsObjectParameter<PackagedSealedMessageFields>(Outputs.sealWithSymmetricKey.packagedSealedMessage)
  );

/**
 * Unseal (decrypt & authenticate) a [packagedSealedMessage] that was previously sealed with a
 * symmetric key derived from the user's DiceKey, the
 * [ApiDerivationOptions] specified in JSON format via [PackagedSealedMessage.derivationOptionsJson],
 * and any [UnsealingInstructions] optionally specified by [PackagedSealedMessage.unsealingInstructions]
 * in [Post-Decryption Instructions JSON Format](https://dicekeys.github.io/seeded-crypto/unsealing_instructions_format.html).
 *
 * If any of those strings change, the wrong key will be derive and the message will
 * not be successfully unsealed, yielding a [org.dicekeys.crypto.seeded.CryptographicVerificationFailureException] exception.
 */
export const unsealWithSymmetricKeyFactory = (call: ApiClientImplementation) => (
  packagedSealedMessage: PackagedSealedMessageFields
) => call<ApiMessages.UnsealWithSymmetricKey>(
  {
    command: Commands.unsealWithSymmetricKey,
    packagedSealedMessage,
  },
  p => p.getBinaryParameter(Outputs.unsealWithSymmetricKey.plaintext)
);
    
/**
 * Get a public [SignatureVerificationKey] derived from the user's DiceKey and the
 * [ApiDerivationOptions] specified in JSON format via [derivationOptionsJson]
 */
export const getSignatureVerificationKeyFactory = (call: ApiClientImplementation) => (
  derivationOptionsJson: string
): Promise<SignatureVerificationKeyFields> => call<ApiMessages.GetSignatureVerificationKey>(
  {
    command: Commands.getSignatureVerificationKey,
    derivationOptionsJson
  },
  p => p.getJsObjectParameter<SignatureVerificationKeyFields>(Outputs.getSignatureVerificationKey.signatureVerificationKey)
);
