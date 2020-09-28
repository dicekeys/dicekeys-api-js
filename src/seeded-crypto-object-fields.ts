export interface PackagedSealedMessageFields {
  /**
   * The encrypted contents of the message
   */
  readonly ciphertext: Uint8Array;
  /**
   * The derivation options used to derive the key used to seal the message, and
   * which can be used to re-derive the key needed to unseal it.
   */
  readonly derivationOptionsJson: string;
  /**
   * Any unsealing instructions that parties able to unseal the message should be
   * aware of.  These are stored in plaintext and are meant to be readable by
   * anyone with a copy of the message.  However, the message cannot be unsealed
   * if these instructions have been modified.
   */
  readonly unsealingInstructions: string;
}

export interface DerivedSecretFields {
  /**
   * The `derivationOptionsJson` passed as the second parameter to
   * `deriveFromSeed()` when this object was first derived from a
   * a secret seed.  Uses
   * [JSON Derivation Options format](https://dicekeys.github.io/seeded-crypto/derivation_options_format.html).
   */
  readonly derivationOptionsJson: string;    
}

export interface SealingKeyFields extends DerivedSecretFields {
  /**
   * The raw key bytes of the sealing key.
   */
  readonly sealingKeyBytes: Uint8Array;
}

export interface SecretFields extends DerivedSecretFields {
  /**
   * The array of bytes that constitutes the derived secret.
   */
  readonly secretBytes: Uint8Array;
}

export interface SignatureVerificationKeyFields extends DerivedSecretFields {
  /**
   * The raw key bytes used to verify signatures.
   */
  readonly signatureVerificationKeyBytes: Uint8Array;
}

export interface SigningKeyFields extends SignatureVerificationKeyFields {
  /**
   * The raw key bytes used to generate signatures.
   */
  readonly signingKeyBytes: Uint8Array;
}

export interface SymmetricKeyFields extends DerivedSecretFields {
  /**
   * The raw symmetric key bytes used to seal and unseal messages.
   */
  readonly keyBytes: Uint8Array;
}

export interface UnsealingKeyFields extends SealingKeyFields {
  /**
   * The raw key bytes of the key used to unseal messages that were
   * previously sealed by the sealing key.
   */
  readonly unsealingKeyBytes: Uint8Array;
}


export type SeededCryptoObjectFields =
  PackagedSealedMessageFields |
  SecretFields | 
  SymmetricKeyFields |
  SealingKeyFields |
  UnsealingKeyFields |
  SigningKeyFields |
  SignatureVerificationKeyFields;