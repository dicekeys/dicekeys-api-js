/**
 * The types of objects that can be converted into C++ byte arrays.
 *
 * @category Parameter Passing
 */
export declare type ByteArray = ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array;
/**
 * The types of objects that can be passed into operations that take
 * either a UTF8 string or a byte array.
 *
 * @category Parameter Passing
 */
export declare type ByteArrayOrString = ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string;
/**
 * A string that contains a binary object encoded using
 * encoded to URL-safe Base64 per
 * [RFC 4648 Section 5](https://tools.ietf.org/html/rfc4648#section-5).
 *
 * @category JSON Serialization Format
 */
export declare type ByteArrayAsUrlSafeBase64String = string;

interface DerivedSecretJson {
    /**
     * The options used to derive a secret or key, specified using the
     * [JSON Derivation Options format](https://dicekeys.github.io/seeded-crypto/derivation_options_format.html).
     */
    derivationOptionsJson: string;
}

/**
 * The JSON encoding format of the PackagedSealedMessage class.
 *
 * @category JSON Serialization Format
 */
export interface PackagedSealedMessageJson {
    /**
     * The encrypted contents of the message,
     * encoded to URL-safe Base64 per [RFC 4648 Section 5](https://tools.ietf.org/html/rfc4648#section-5).
     */
    ciphertext: ByteArrayAsUrlSafeBase64String;
    /**
     * The derivation options used to derive the key used to seal the message, and
     * which can be used to re-derive the key needed to unseal it.
     */
    derivationOptionsJson: string;
    /**
     * Any unsealing instructions that parties able to unseal the message should be
     * aware of.  These are stored in plaintext and are meant to be readable by
     * anyone with a copy of the message.  However, the message cannot be unsealed
     * if these instructions have been modified.
     */
    unsealingInstructions: string;
}


export interface PasswordJson extends DerivedSecretJson {
    /**
     * The string containing the derived password.
     */
    password: string;
}


/**
 * The JSON encoding format of the SealingKey class.
 *
 * @category JSON Serialization Format
 */
export interface SealingKeyJson extends DerivedSecretJson {
    /**
     * The raw key bytes of the sealing key,
     * encoded to URL-safe Base64 per [RFC 4648 Section 5](https://tools.ietf.org/html/rfc4648#section-5).
     */
    sealingKeyBytes: ByteArrayAsUrlSafeBase64String;
}

/**
 * The JSON encoding format of the Secret class.
 *
 * @category JSON Serialization Format
 */
export interface SecretJson extends DerivedSecretJson {
    /**
     * The array of bytes that constitutes the derived secret,
     * encoded to URL-safe Base64 per [RFC 4648 Section 5](https://tools.ietf.org/html/rfc4648#section-5).
     */
    secretBytes: ByteArrayAsUrlSafeBase64String;
}
/**
 * The static methods of the SignatureVerificationKey class.
 * @category SignatureVerificationKey
 */

 
export interface SignatureVerificationKeyJson extends DerivedSecretJson {
    /**
     * The raw key bytes used to verify signatures,
     * encoded to URL-safe Base64 per [RFC 4648 Section 5](https://tools.ietf.org/html/rfc4648#section-5).
     */
    signatureVerificationKeyBytes: ByteArrayAsUrlSafeBase64String;
}


/**
 * The JSON encoding format of the SigningKey class.
 *
 * @category JSON Serialization Format
 */
export interface SigningKeyJson extends DerivedSecretJson {
    /**
     * The raw key bytes used to generate signatures,
     * encoded to URL-safe Base64 per [RFC 4648 Section 5](https://tools.ietf.org/html/rfc4648#section-5).
     */
    signingKeyBytes: ByteArrayAsUrlSafeBase64String;
    /**
     * The raw key bytes used to verify signatures,
     * encoded to URL-safe Base64 per [RFC 4648 Section 5](https://tools.ietf.org/html/rfc4648#section-5).
     *
     * This field is optional because, if it's not provided,
     * it can be re-derived from the [[signingKeyBytes]] when the
     * object is reconstituted.  (It does so on an as-needed basis,
     * so if the field is never used, we save both on storage by
     * not including this field and on computation if we never
     * need to re-derive it.)
     */
    signatureVerificationKeyBytes?: ByteArrayAsUrlSafeBase64String;
}
/**
 * The JSON encoding format of the SymmetricKey class.
 *
 * @category JSON Serialization Format
 */
export interface SymmetricKeyJson extends DerivedSecretJson {
    /**
     * The raw symmetric key bytes used to seal and unseal messages,
     * encoded to URL-safe Base64 per [RFC 4648 Section 5](https://tools.ietf.org/html/rfc4648#section-5).
    */
    keyBytes: ByteArrayAsUrlSafeBase64String;
}


/**
 * The JSON encoding format of the UnsealingKey class.
 *
 * @category JSON Serialization Format
 */
export interface UnsealingKeyJson extends DerivedSecretJson {
    /**
     * The raw key bytes of the key used to seal messages,
     * kept with the unsealing key for use when [[getSealingKey]] is called,
     * encoded to URL-safe Base64 per [RFC 4648 Section 5](https://tools.ietf.org/html/rfc4648#section-5).
     */
    sealingKeyBytes: ByteArrayAsUrlSafeBase64String;
    /**
     * The raw key bytes of the key used to unseal messages that were
     * previously sealed by the sealing key,
     * encoded to URL-safe Base64 per [RFC 4648 Section 5](https://tools.ietf.org/html/rfc4648#section-5).
     */
    unsealingKeyBytes: ByteArrayAsUrlSafeBase64String;
}
