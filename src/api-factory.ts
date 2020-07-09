import {
  Inputs,
  Outputs,
  Command,
  Commands
} from "./api-strings";
import {
  PackagedSealedMessageFields,
  DerivedPasswordWithDerivationOptionsJson,
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
  <T>(
    command: Command,
    parameters: [string, string | Uint8Array | PackagedSealedMessageFields ][],
    processResponse: (unmarshallerForResponse: UnmsarshallerForResponse) => T | Promise<T>
  ): Promise<T>
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
  async  (
    derivationOptionsJson: string,
    message: Uint8Array
  ): Promise<GenerateSignatureResult> => call(
  Commands.generateSignature,
  [
    [Inputs.generateSignature.derivationOptionsJson, derivationOptionsJson],
    [Inputs.generateSignature.message, message]
  ],
  p => {
    const signature = p.getBinaryParameter(Outputs.generateSignature.signature)
    const signatureVerificationKey = p.getJsObjectParameter<SignatureVerificationKeyFields>(Outputs.generateSignature.signatureVerificationKey);
    return {
      signature,
      signatureVerificationKey
    }
  })

  /**
   * Derive a pseudo-random cryptographic [Secret] from the user's DiceKey and
   * the key-derivation options passed as [derivationOptionsJson]
   * in [Key-Derivation Options JSON Format](hhttps://dicekeys.github.io/seeded-crypto/derivation_options_format.html).
   */
export const getSecretFactory = (call: ApiClientImplementation) => (
  derivationOptionsJson: string
): Promise<SecretFields> => call(
  Commands.getSecret,
  [
    [Inputs.getSecret.derivationOptionsJson, derivationOptionsJson]
  ],
  (p) => p.getJsObjectParameter<SecretFields>(Outputs.getSecret.secret)
);

export const getPasswordFactory = (call: ApiClientImplementation) => (
  derivationOptionsJson: string
): Promise<DerivedPasswordWithDerivationOptionsJson> => call(
  Commands.getPassword,
  [
    [Inputs.getPassword.derivationOptionsJson, derivationOptionsJson]
  ],
  (p) => p.getJsObjectParameter<DerivedPasswordWithDerivationOptionsJson>(Outputs.getPassword.passwordWithDerivationOptionsJson)
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
): Promise<UnsealingKeyFields> => call(
  Commands.getUnsealingKey,
  [ 
    [Inputs.getUnsealingKey.derivationOptionsJson, derivationOptionsJson ]
  ],
  async (p) => p.getJsObjectParameter<UnsealingKeyFields>(Outputs.getUnsealingKey.unsealingKey)
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
): Promise<SymmetricKeyFields> => call(
  Commands.getSymmetricKey,
  [ 
    [Inputs.getUnsealingKey.derivationOptionsJson, derivationOptionsJson ]
  ],
  async (p) => p.getJsObjectParameter<SymmetricKeyFields>(Outputs.getSymmetricKey.symmetricKey)
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
): Promise<SigningKeyFields> => call(
  Commands.getSigningKey,
  [ 
    [Inputs.getUnsealingKey.derivationOptionsJson, derivationOptionsJson ]
  ],
    async (p) => p.getJsObjectParameter<SigningKeyFields>(Outputs.getSigningKey.signingKey)
);


/**
 * Get a [SealingKey] derived from the user's DiceKey and the [ApiDerivationOptions] specified
 * in [Key-Derivation Options JSON Format](hhttps://dicekeys.github.io/seeded-crypto/derivation_options_format.html)
 * as [derivationOptionsJson].
 */
export const getSealingKeyFactory = (call: ApiClientImplementation) => (
  derivationOptionsJson: string
): Promise<SealingKeyFields> => call(
  Commands.getSealingKey,
  [ [Inputs.getUnsealingKey.derivationOptionsJson, derivationOptionsJson ] ],
  async (p) => p.getJsObjectParameter<SealingKeyFields>(Outputs.getSealingKey.sealingKey)
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
): Promise<Uint8Array> => call(
  Commands.unsealWithUnsealingKey,
  [ [ Inputs.unsealWithUnsealingKey.packagedSealedMessage, packagedSealedMessage ]],
  async (p) => p.getBinaryParameter(Outputs.unsealWithUnsealingKey.plaintext)
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
): Promise<PackagedSealedMessageFields> =>
  call(
    Commands.sealWithSymmetricKey, 
    [
      [Inputs.sealWithSymmetricKey.derivationOptionsJson, derivationOptionsJson],
      [Inputs.sealWithSymmetricKey.plaintext, plaintext],
      [Inputs.sealWithSymmetricKey.unsealingInstructions, unsealingInstructions]  
    ],
    async (p) => p.getJsObjectParameter<PackagedSealedMessageFields>(Outputs.sealWithSymmetricKey.packagedSealedMessage)
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
): Promise<Uint8Array> => call(
  Commands.unsealWithSymmetricKey,
  [ [Inputs.unsealWithSymmetricKey.packagedSealedMessage, packagedSealedMessage ] ],
  async (p) => p.getBinaryParameter(Outputs.unsealWithSymmetricKey.plaintext)
);
    
/**
 * Get a public [SignatureVerificationKey] derived from the user's DiceKey and the
 * [ApiDerivationOptions] specified in JSON format via [derivationOptionsJson]
 */
export const getSignatureVerificationKeyFactory = (call: ApiClientImplementation) => (
  derivationOptionsJson: string
): Promise<SignatureVerificationKeyFields> => call(
  Commands.getSignatureVerificationKey,
  [ [Inputs.getSignatureVerificationKey.derivationOptionsJson, derivationOptionsJson] ],
  async (p) => p.getJsObjectParameter<SignatureVerificationKeyFields>(Outputs.getSignatureVerificationKey.signatureVerificationKey)
);
