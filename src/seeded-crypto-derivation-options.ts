import { toNameMap } from "./to-name-map";
import {
  InvalidDerivationOptionsTypeFieldException
} from "./exceptions";

export const DerivableObjectNames = {
  "Password": "Password",
  "Secret": "Secret",
  "SigningKey": "SigningKey",
  "SymmetricKey": "SymmetricKey",
  "UnsealingKey": "UnsealingKey"
} as const;
export type DerivableObjectName = keyof typeof DerivableObjectNames;

export const WordListNames = [
  "EN_512_words_5_chars_max_ed_4_20200917",
  "EN_1024_words_6_chars_max_ed_4_20200917"
] as const;
export type WordListName = typeof WordListNames[number];
export const WordListBitLengths: {[name in WordListName]: number} = {
  "EN_512_words_5_chars_max_ed_4_20200917": 9,
  "EN_1024_words_6_chars_max_ed_4_20200917": 10
}

export const CheapHashFunction = toNameMap(["BLAKE2b" ]);
export type CheapHashFunction = keyof typeof CheapHashFunction;
export const ExpensiveHashFunction = toNameMap(["Argon2id"]);
export type ExpensiveHashFunction = keyof typeof CheapHashFunction;
export const HashFunction = {...CheapHashFunction, ...ExpensiveHashFunction};
export type HashFunction = keyof typeof HashFunction;


export interface CheapHashFunctionOptions {
  hashFunction?: CheapHashFunction;
}

/**
 * The subset of [[DerivationOptions]] specific to hash functions designed to be computationally expensive
 * and consume memory in order to slow brute-force guessing attacks, including
 * those attacks that might utilize specially-designed hardware.
 *
 * @category DerivationOptions
 */
export interface ExpensiveHashFunctionsOptions {
  hashFunction: ExpensiveHashFunction;
  /**
   * The  amount of memory that Argoin2id or Scrypt
   * will be required to iterate (pass) through in order to compute the correct output.
   *
   * As the name implies, the hashFunctionMemoryLimitInBytes field is specified in bytes.
   * It should be a multiple of 1,024, must be at least 8,192
   * and no greater than 2^31 (2,147,483,648).
   * The default is 67,108,864.
   * This field maps to the memlimit parameter in libsodium.
   */
  hashFunctionMemoryLimitInBytes?: number;
  /**
   * The number of passes that Argoin2id or Scrypt will need to make through that
   * memory to compute the hash.
   *
   * The hashFunctionMemoryPasses must be at least 1, no greater than 2^32-1 (4,294,967,295),
   * and is set to 2 memory passes by default.
   *
   * Since this parameter determines the number of
   * passes the hash function will make through the memory region specified by
   * [[hashFunctionMemoryLimitInBytes]], and results in hashing an amount of memory equal
   * to the product of these two parameters, the computational cost on the order of the
   * product of [[hashFunctionMemoryPasses]] times [[hashFunctionMemoryLimitInBytes]].
   *
   * (The hashFunctionMemoryPasses field maps to the poorly-documented opslimit in libsodium.
   * An examination of the libsodium source shows that opslimit is assigned to a parameter
   * named t_cost, which in turn is assigned to instance.passes on line 56 of argon2.c.)
   */
  hashFunctionMemoryPasses?: number;
}

export type HashFunctionOptions<HASH_FUNCTION extends HashFunction = HashFunction> =
  HASH_FUNCTION extends ExpensiveHashFunction ? ExpensiveHashFunctionsOptions :  CheapHashFunctionOptions;

// type x = HashFunctionOptions<"SHA256">

// interface HashFunctionOptions<HASH_FUNCTION extends HashFunction> {
//   hashFunction: HASH_FUNCTION;
//   /**
//    * The  amount of memory that Argoin2id or Scrypt
//    * will be required to iterate (pass) through in order to compute the correct output.
//    *
//    * As the name implies, the hashFunctionMemoryLimitInBytes field is specified in bytes.
//    * It should be a multiple of 1,024, must be at least 8,192
//    * and no greater than 2^31 (2,147,483,648).
//    * The default is 67,108,864.
//    * This field maps to the memlimit parameter in libsodium.
//    */
//   hashFunctionMemoryLimitInBytes?: HASH_FUNCTION extends CheapHashFunction ? undefined : number;
//   /**
//    * The number of passes that Argoin2id or Scrypt will need to make through that
//    * memory to compute the hash.
//    *
//    * The hashFunctionMemoryPasses must be at least 1, no greater than 2^32-1 (4,294,967,295),
//    * and is set to 2 memory passes by default.
//    *
//    * Since this parameter determines the number of
//    * passes the hash function will make through the memory region specified by
//    * [[hashFunctionMemoryLimitInBytes]], and results in hashing an amount of memory equal
//    * to the product of these two parameters, the computational cost on the order of the
//    * product of [[hashFunctionMemoryPasses]] times [[hashFunctionMemoryLimitInBytes]].
//    *
//    * (The hashFunctionMemoryPasses field maps to the poorly-documented opslimit in libsodium.
//    * An examination of the libsodium source shows that opslimit is assigned to a parameter
//    * named t_cost, which in turn is assigned to instance.passes on line 56 of argon2.c.)
//    */
//   hashFunctionMemoryPasses?: HASH_FUNCTION extends CheapHashFunction ? undefined : number | undefined;
// }


export interface PasswordLengthAsWordsNeeded {
  /**
   * Generate a password of this length, or the number of
   * words available from a 256-bit secret, whichever is
   * smaller.
   */
  lengthInWords: number
}

export interface PasswordLengthAsBitsNeeded {
  /**
   * Add words until either the secret has been exhausted
   * or the bit strength has been reached or exceeded.
   * 
   * For example, if set to 50 and using a list of 512 words
   * (9 bits/word), a 6 word (53 bit) password will be generated.
   */  
  lengthInBits: number
}

export interface PasswordWordList {
  /**
   * The name of the word list to use to convert a binary secret (a byte array)
   * into a password.
   * 
   * If the field is not set, the
   * DiceKeys app should allow the user to choose from a set of word lists
   * to match the user's preference of language and vocabulary size once
   * more than one word list is available.  The DiceKeys app will then
   * return a derivationOptionsJson string with the wordList field set
   * to the user's chosen word list.
   * 
   * If the derivation options are not set, the DiceKeys app will default
   * to the EN_512_5_chars_4_min_edit_distance_20200916
   * word list.
   */
  wordList?: WordListName;
}

export type PasswordOptions =
  {type?: "Password"} &
  PasswordWordList &
  (
    PasswordLengthAsWordsNeeded |
    PasswordLengthAsBitsNeeded |
    {}
  );

/**
* The subset of [[DerivationOptions]] specific to generating a password.
*
* @category DerivationOptions
*/
export type DerivationOptionsSpecificToPassword = PasswordOptions;


/**
* The subset of [[DerivationOptions]] specific to a [[Secret]].
*
* @category DerivationOptions
*/
export interface DerivationOptionsSpecificToSecret {
  /**
   * The length of the secret to be derived, in bytes.  If not set,
   * 32 bytes are derived.
   */
  type?: "Secret";
  lengthInBytes?: number;
};

/**
* The subset of [[DerivationOptions]] specific to a [[SymmetricKey]].
*
* @category DerivationOptions
*/
export interface DerivationOptionsSpecificToSymmetricKey {
  type?: "SymmetricKey";
  /**
   * The algorithm to use for the underlying key and cryptographic algorithms.
   * (leave empty to use the default.)
   */
  algorithm?: "XSalsa20Poly1305";
};

/**
* The subset of [[DerivationOptions]] specific to an UnsealingKey.
*
* @category DerivationOptions
*/
export type DerivationOptionsSpecificToUnsealingKey = {
  type?: "UnsealingKey";
  /**
   * The algorithm to use for the underlying key and cryptographic algorithms.
   * (leave empty to use the default.)
   */
  algorithm?: "X25519";
};

/**
* The subset of [[DerivationOptions]] specific to a SigningKey.
*
* @category DerivationOptions
*/
export type DerivationOptionsSpecificToSigningKey = {
  type?: "SigningKey";
  /**
   * The algorithm to use for the underlying key and cryptographic algorithms.
   * (leave empty to use the default.)
   */
  algorithm?: "Ed25519";
};


/**
* The DerivationOptions used by the Seeded Crypto library
* and which implement the portion of the
* [JSON Derivation Options format](https://dicekeys.github.io/seeded-crypto/derivation_options_format.html).
* that are interpreted by this library.
*
* (Other options may appear in layers above that library.)
*
* @category DerivationOptions
*/
export type SeededCryptoDerivationOptions<
  TYPE extends DerivableObjectName = DerivableObjectName,
  HASH_FUNCTION extends HashFunction = HashFunction
> = HashFunctionOptions<HASH_FUNCTION> & (
  TYPE extends "Password" ? DerivationOptionsSpecificToPassword :
  TYPE extends "Secret" ? DerivationOptionsSpecificToSecret :
  TYPE extends "SymmetricKey" ? DerivationOptionsSpecificToSymmetricKey :
  TYPE extends "UnsealingKey" ? DerivationOptionsSpecificToUnsealingKey :
  TYPE extends "SigningKey" ? DerivationOptionsSpecificToSigningKey :
  never
  );

const SeededCryptoDerivationOptionsFor = <
  TYPE extends DerivableObjectName
>(  typeRequiredByOperation?: TYPE
) => <HASH_FUNCTION extends HashFunction = HashFunction> (
  derivationOptionsAsObjectOrJson?: string | null | (SeededCryptoDerivationOptions<TYPE, HASH_FUNCTION>),
  optionsNotSpecifiedWithinThisStandard?: object
): SeededCryptoDerivationOptions<TYPE, HASH_FUNCTION> => {
  const derivationOptions = 
    (typeof derivationOptionsAsObjectOrJson === "object" && derivationOptionsAsObjectOrJson != null) ?
      derivationOptionsAsObjectOrJson :
      JSON.parse(derivationOptionsAsObjectOrJson ?? "{}") as SeededCryptoDerivationOptions<TYPE, HASH_FUNCTION>;
  if (typeRequiredByOperation && derivationOptions.type && derivationOptions.type !== typeRequiredByOperation) {
    throw InvalidDerivationOptionsTypeFieldException.create(typeRequiredByOperation, derivationOptions.type);
  }
  return optionsNotSpecifiedWithinThisStandard ?
    Object.assign({...optionsNotSpecifiedWithinThisStandard, derivationOptions}) as SeededCryptoDerivationOptions<TYPE, HASH_FUNCTION> :
    derivationOptions
}

export const SeededCryptoDerivationOptions = SeededCryptoDerivationOptionsFor<DerivableObjectName>();
export const SeededCryptoPasswordDerivationOptions = SeededCryptoDerivationOptionsFor("Password")
export const SeededCryptoSecretDerivationOptions = SeededCryptoDerivationOptionsFor("Secret")
export const SeededCryptoSymmetricKeyDerivationOptions = SeededCryptoDerivationOptionsFor("SymmetricKey")
export const SeededCryptoUnsealingKeyDerivationOptions = SeededCryptoDerivationOptionsFor("UnsealingKey")
export const SeededCryptoSigningKeyDerivationOptions = SeededCryptoDerivationOptionsFor("SigningKey")

// const test = SeededCryptoPasswordDerivationOptions({
//   hashFunction: "BLAKE2b",
//   lengthInBits: 3,
//   lengthInWords: 3,
//   hashFunctionMemoryPasses: undefined,
//   hashFunctionMemoryLimitInBytes: 3,
// }, {})