import { toNameMap } from "./to-name-map";
import {
  InvalidRecipeTypeFieldException
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
 * The subset of [[Recipe]] specific to hash functions designed to be computationally expensive
 * and consume memory in order to slow brute-force guessing attacks, including
 * those attacks that might utilize specially-designed hardware.
 *
 * @category Recipe
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


export interface PasswordLengthAsCharsNeeded {
  /**
   * Add characters until either the secret has been exhausted
   * or the character length has been reached.
   */  
  lengthInChars: number
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
   * return a recipe string with the wordList field set
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
    PasswordLengthAsCharsNeeded |
    {}
  );

/**
* The subset of [[Recipe]] specific to generating a password.
*
* @category Recipe
*/
export type RecipeSpecificToPassword = PasswordOptions;


/**
* The subset of [[Recipe]] specific to a [[Secret]].
*
* @category Recipe
*/
export interface RecipeSpecificToSecret {
  /**
   * The length of the secret to be derived, in bytes.  If not set,
   * 32 bytes are derived.
   */
  type?: "Secret";
  lengthInBytes?: number;
};

/**
* The subset of [[Recipe]] specific to a [[SymmetricKey]].
*
* @category Recipe
*/
export interface RecipeSpecificToSymmetricKey {
  type?: "SymmetricKey";
  /**
   * The algorithm to use for the underlying key and cryptographic algorithms.
   * (leave empty to use the default.)
   */
  algorithm?: "XSalsa20Poly1305";
};

/**
* The subset of [[Recipe]] specific to an UnsealingKey.
*
* @category Recipe
*/
export type RecipeSpecificToUnsealingKey = {
  type?: "UnsealingKey";
  /**
   * The algorithm to use for the underlying key and cryptographic algorithms.
   * (leave empty to use the default.)
   */
  algorithm?: "X25519";
};

/**
* The subset of [[Recipe]] specific to a SigningKey.
*
* @category Recipe
*/
export type RecipeSpecificToSigningKey = {
  type?: "SigningKey";
  /**
   * The algorithm to use for the underlying key and cryptographic algorithms.
   * (leave empty to use the default.)
   */
  algorithm?: "Ed25519";
};


/**
* The Recipe used by the Seeded Crypto library
* and which implement the portion of the
* [JSON Derivation Options format](https://dicekeys.github.io/seeded-crypto/recipe_format.html).
* that are interpreted by this library.
*
* (Other options may appear in layers above that library.)
*
* @category Recipe
*/
export type SeededCryptoRecipe<
  TYPE extends DerivableObjectName = DerivableObjectName,
  HASH_FUNCTION extends HashFunction = HashFunction
> = HashFunctionOptions<HASH_FUNCTION> & (
  TYPE extends "Password" ? RecipeSpecificToPassword :
  TYPE extends "Secret" ? RecipeSpecificToSecret :
  TYPE extends "SymmetricKey" ? RecipeSpecificToSymmetricKey :
  TYPE extends "UnsealingKey" ? RecipeSpecificToUnsealingKey :
  TYPE extends "SigningKey" ? RecipeSpecificToSigningKey :
  never
  );

const SeededCryptoRecipeFor = <
  TYPE extends DerivableObjectName
>(  typeRequiredByOperation?: TYPE
) => <HASH_FUNCTION extends HashFunction = HashFunction> (
  recipeAsObjectOrJson?: string | null | (SeededCryptoRecipe<TYPE, HASH_FUNCTION>),
  optionsNotSpecifiedWithinThisStandard?: object
): SeededCryptoRecipe<TYPE, HASH_FUNCTION> => {
  const recipe = 
    (typeof recipeAsObjectOrJson === "object" && recipeAsObjectOrJson != null) ?
      recipeAsObjectOrJson :
      JSON.parse(recipeAsObjectOrJson ?? "{}") as SeededCryptoRecipe<TYPE, HASH_FUNCTION>;
  if (typeRequiredByOperation && recipe.type && recipe.type !== typeRequiredByOperation) {
    throw InvalidRecipeTypeFieldException.create(typeRequiredByOperation, recipe.type);
  }
  return optionsNotSpecifiedWithinThisStandard ?
    Object.assign({...optionsNotSpecifiedWithinThisStandard, recipe}) as SeededCryptoRecipe<TYPE, HASH_FUNCTION> :
    recipe
}

export const SeededCryptoRecipe = SeededCryptoRecipeFor<DerivableObjectName>();
export const SeededCryptoPasswordRecipe = SeededCryptoRecipeFor("Password")
export const SeededCryptoSecretRecipe = SeededCryptoRecipeFor("Secret")
export const SeededCryptoSymmetricKeyRecipe = SeededCryptoRecipeFor("SymmetricKey")
export const SeededCryptoUnsealingKeyRecipe = SeededCryptoRecipeFor("UnsealingKey")
export const SeededCryptoSigningKeyRecipe = SeededCryptoRecipeFor("SigningKey")

// const test = SeededCryptoPasswordRecipe({
//   hashFunction: "BLAKE2b",
//   lengthInBits: 3,
//   lengthInWords: 3,
//   hashFunctionMemoryPasses: undefined,
//   hashFunctionMemoryLimitInBytes: 3,
// }, {})