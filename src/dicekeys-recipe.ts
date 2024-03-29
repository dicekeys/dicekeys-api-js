import {
  InvalidRecipeTypeFieldException
} from "./exceptions";
import {
  DerivableObjectName,
  SeededCryptoRecipe
} from "./seeded-crypto-recipe";


/**
 * Related readings:
 *   - How Apple operating systems maps URLs to Apps:
 *     - https://developer.apple.com/documentation/safariservices/supporting_associated_domains_in_your_app#3001215
 *     - https://<fully qualified domain>/.well-known/apple-app-site-association
 *     - paths are of form: "paths": [ "/buy/*", "NOT /help/website/*", "/help/*" ]
 *   - How Android delivers URLs to apps
 *     - https://developer.android.com/training/app-links/deep-linking
 *     - <data android:scheme="http" android:host="www.example.com" android:pathPrefix="/gizmos" />
 *     - android:host may have * as first character, causing prefix match, as documented at https://developer.android.com/guide/topics/manifest/data-element (see "android:host")
 *
 * 
 * For us:
 *     - scheme: always HTTPS, so no need to specify
 *         > origin = <scheme> "://" <hostname> [ ":" <port> ] = <scheme> "://" <host> = "https://" <host>
 *     - host: host with optional '*' in first character like android:host
 *     - path: path, if "*" is last character it is treated as suffix, ignored for postMessage API
 */

 /**
  * A web-standards based mechanism for identifying client code that is making
  * a request of the DiceKeys app.
  *
  * Regardless of API, we identify web applications by their host (the part of the origin
  * after the mandatory "https://" prefix). The host alone is is sufficient when using
  * intra-browser communication via postMessage APIs, as it is the only identifier we
  * have available.
  * 
  * When passing messages via URL, as occurs for interapp/intra-device communication within
  * iOS and Android, we can also restrict to a subset of valid paths and/or path prefixes.
  */
 export interface WebBasedApplicationIdentity {
  /**
  * The host, which is the same as a hostname unless a non-standard https port is used (not recommended).
  * Start it with a "*." to match a domain and any of its subdomains.
  * 
  * > origin = <scheme> "://" <hostname> [ ":" <port> ] = <scheme> "://" <host> = "https://" <host>
  * So, `host = origin.substr(8)`
  */
  host: string;

  /**
  * Restrict URL-based access to the API to a limited set of URL paths.
  *
  * If the specified path on the list ends in "/*", a path will validate it if it either shares
  * the same prefix (including the "/" just before the *) or if is exactly equal to prefix preceding the "/".
  * In other words, the requirement "/here/*" is satisfied by "/here/and/there", "/here/", and "/here",
  * but not, "/hereandthere/", "/her", "/her/", or "/thereandhere".
  * 
  * If the path does not end in "/*" but does end in "*", any path that starts with the string preceding the "*"
  * will be validated.
  * In other words, the requirement "/here*" is satisfied by "/here/and/there", "/here/", "/here", and "/hereandthere/",
  * but not "/her", "/her/", "/thereandhere", or "/thereandhere/".
  * 
  * If the path does not end in "*", it must match exactly.
  *
  * If paths is undefined, no path validation is ever performed.
  * 
  * If paths is et to an empty list is  empty, no path will match and the URL interface operations are disallowed.
  * 
  * Paths are not evaluated for the postMessage-based API as all authentication is done by
  * origin and postMessage not subject to cross-site request forgery.
  * 
  */
  paths?: string[];
}
  
export interface AuthenticationRequirements {
  /**
   * On Apple platforms, applications are specified by a URL containing a domain name
   * from the Internet's Domain Name System (DNS).
   *
   * If this value is specified, applications must come from clients that have a URL prefix
   * starting with one of the items on this list if they are to use a derived key.
   *
   * Since some platforms, including iOS, do not allow the DiceKeys app to authenticate
   * the sender of an API request, the app may perform a cryptographic operation
   * only if it has been instructed to send the result to a URL that starts with
   * one of the permitted prefixes.
   */
  allow?: WebBasedApplicationIdentity[];

  /**
   * When set, clients will need to issue a handshake request to the API,
   * and receive an authorization token (a random shared secret), before
   * issuing other requests where the URL at which they received the token
   * starts with one of the authorized prefixes.
   * 
   * The DiceKeys app will map the authorization token to that URL and,
   * when requests include that token, validate that the URL associated
   * with the token has a valid prefix. The DiceKeys app will continue to
   * validate that responses are also sent to a valid prefix. 
   *
   */
  requireAuthenticationHandshake?: boolean;

  
  /**
   * In Android, client applications are identified by their package name,
   * which must be cryptographically signed before an application can enter the
   * Google play store.
   *
   * If this value is specified, Android apps must have a package name that begins
   * with one of the provided prefixes if they are to use a derived key.
   *
   * Note that all prefixes, and the client package names they are compared to,
   * have an implicit '.' appended to to prevent attackers from registering the
   * suffix of a package name.  Hence the package name "com.example.app" is treated
   * as "com.example.app." and the prefix "com.example" is treated as
   * "com.example." so that an attacker cannot generate a key by registering
   * "com.examplesignedbyattacker".
   */
  allowAndroidPrefixes?: string[];
}

interface RecipeSpecificToDiceKeysApi extends AuthenticationRequirements {
  /**
   * A string that may be added by the DiceKeys app to help users remember which
   * seed (DiceKey) they used to derive a key or secret.
   * 
   * e.g. `My DiceKey labeled "Personal Accounts".`
   */
  seedHint?: string;

  /**
   * An optional field used to convey what the creator of the recipe intended
   * the secret generated from it to be used for.
   */
  purpose?: string;

  /**
   * A sequence number for obtaining multiple derived values without changing
   * any other field of the recipe.
   */
  "#"?: number;

  /**
   * A 2-3 character string container the letter, digit, and optionally the
   * orientation of the center die used as a hint for which key should be
   * paired with this recipe.
   */
  centerDie?: string;

  /**
   * The DiceKeys app will want to get a user's consent before deriving a
   * secret on behalf of an app.
   * 
   * When a user approves a set of Recipe, this field
   * allows us to record that the options were, at least at one time, approved
   * by the holder of this DiceKey.
   * 
   * Set this field to empty (two double quotes, ""), call Recipe.derivePrimarySecret
   * with the seed (DiceKey) and these derivation options.  Take that primary secret,
   * turn it into url-safe base64, and then re-run derivePrimarySecret with that
   * base64 encoding as the seed. Insert the base64 encoding of the first 128 bits
   * into this field.  (If the derivation options derive fewer than 128 bits, use
   * whatever bits are available.)
   */
  proofOfPriorDerivation?: string;


  /**
   * Unless this value is explicitly set to _true_, the DiceKeys may prevent
   * to obtain a raw derived [[SymmetricKey]],
   * UnsealingKey, or
   * SigningKey.
   * Clients may retrieve a derived SealingKey,
   * or SignatureVerificationKey even if this value
   * is not set or set to false.
   *
   * Even if this value is set to true, requests for keys are not permitted unless
   * the client would be authorized to perform cryptographic operations on those keys.
   * In other words, access is forbidden if the [restrictions] field is set and the
   * specified [Restrictions] are not met.
   */
  clientMayRetrieveKey?: boolean;

  /**
   * When using a DiceKey as a seed, the default seed string will be a 75-character
   * string consisting of triples for each die in canonical order:
   * 
   *   1 The uppercase letter on the die
   *   2 The digit on the die
   *   3 The orientation relative to the top of the square
   *
   * If  `excludeOrientationOfFaces` is set to `true` set to true,
   * the orientation character (the third member of each triple) will be
   * set to "?" before the canonical form is determined
   * (the choice of the top left corner that results in the human readable
   * form earliest in the sort order) and "?" will be the third character
   * in each triple.
   * 
   * This option exists because orientations may be harder for users to copy correctly
   * than letters and digits are. With this option on, should a user choose to manually
   * copy the contents of a DiceKey and make an error in copying an orientation, that
   * error will not prevent them from re-deriving the specified key or secret.

    */
  excludeOrientationOfFaces?: boolean;
}



export type Recipe<
  TYPE extends DerivableObjectName = DerivableObjectName
> = RecipeSpecificToDiceKeysApi & SeededCryptoRecipe<TYPE>;

export type PasswordRecipe = Recipe<"Password">;
export type SecretRecipe = Recipe<"Secret">;
export type SymmetricKeyRecipe = Recipe<"SymmetricKey">;
export type UnsealingKeyRecipe = Recipe<"UnsealingKey">;
export type SigningKeyRecipe = Recipe<"SigningKey">;

const RecipeForDiceKeysApiFor = <
  TYPE extends DerivableObjectName
>(  typeRequiredByOperation?: TYPE
) => (
  recipeAsObjectOrJson?: string | null | (Recipe<TYPE>),
  optionsNotSpecifiedWithinThisStandard?: object
): Recipe<TYPE> => {
  const recipe: Recipe<TYPE> = 
    (recipeAsObjectOrJson == null || recipeAsObjectOrJson === "") ?
      {} as Recipe<TYPE> :
    (typeof recipeAsObjectOrJson === "string") ?
      (JSON.parse(recipeAsObjectOrJson) as Recipe<TYPE>) :
    recipeAsObjectOrJson;

  if (typeRequiredByOperation && recipe.type && recipe.type !== typeRequiredByOperation) {
    throw InvalidRecipeTypeFieldException.create(typeRequiredByOperation, recipe.type);
  }
  return optionsNotSpecifiedWithinThisStandard ?
    Object.assign({...optionsNotSpecifiedWithinThisStandard, recipe}) as Recipe<TYPE> :
    recipe
}

export const Recipe = RecipeForDiceKeysApiFor<DerivableObjectName>();
export const PasswordRecipe = RecipeForDiceKeysApiFor("Password")
export const SecretRecipe = RecipeForDiceKeysApiFor("Secret")
export const SymmetricKeyRecipe = RecipeForDiceKeysApiFor("SymmetricKey")
export const UnsealingKeyRecipe = RecipeForDiceKeysApiFor("UnsealingKey")
export const SigningKeyRecipe = RecipeForDiceKeysApiFor("SigningKey")
