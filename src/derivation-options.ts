import {DerivationOptions as CryptoDerivationOptions} from "@dicekeys/seeded-crypto-js";
import {
  InvalidDerivationOptionsTypeFieldException
} from "./exceptions";
import {
  WordListName
} from "./word-lists";
export const DerivableObjectNames = {
  "Secret": "Secret",
  "SigningKey": "SigningKey",
  "SymmetricKey": "SymmetricKey",
  "UnsealingKey": "UnsealingKey"
} as const;
export type DerivableObjectName = keyof typeof DerivableObjectNames;

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
  * A web-standards bsaed mechanism for identifying client code that is making
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
  * the same prefix (including the "/" just beore the *) or if is exactly equal to prefix preceding the "/".
  * In other words, the requirement "/here/*" is satisfied by "/here/and/there", "/here/", and "/here",
  * but not, "/hereandthere/", "/her", "/her/", or "/thereandhere".
  * 
  * If the path does not end in "/*" but does end in "*", any path that starts with the string preceding the "*"
  * will be validated.
  * In other words, the requirement "/here*" is satisfied by "/here/and/there", "/here/", "/here", and "/hereandthere/",
  * but not "/her", "/her/", "/thereandhere", or "/thereandhere/".
  * 
  * If the path does not end in "*", it must match exctly.
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
   * when reqeusts include that token, validate that the URL associated
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

export interface ApiDerivationOptions extends AuthenticationRequirements {

  /**
   * Set this field to indicate that the user may modify the DerivationOptions
   * in the DiceKeys app.  For example, if this field is set, the user may
   * choose to remove the orietnation of faces in their DiceKeys within the app,
   * and the app will add `"excludeOrientationOfFaces": true` to the
   * DerivationOptions before performing an operation.
   * 
   * If the API operation returns a key or secret, the caller will receive the
   * modified derivation options via the derivationOptionsJson field of the the
   * derived key or secret.  It will need to store the modified JSON to ensure
   * the key or secret can be re-generated.
   * 
   * For seal operations via a derived [[SymmetricKey]] or [[UnsealingKey]],
   * the PackagedSealedMessage will contain the updated derivation options
   * in its derivationOptionsJson field.  For signing operations, the
   * signature verification key will contain the updated derivationOptionsJson.
   * 
   * Regardless, the derivationOptionsJson return will no longer have the
   * `mutable` field set to true as the derivation options can no longer
   * be modified without causing the resulting key to be different from the
   * one generated by the API operation.
   *
   * **Important**
   * An API client MUST NOT set the field to true unless it can and will store
   * the modified derivationOptionsJson field and ensure that value will be available
   * should the key or secret need to be re-derived in the future.
   * Applications and services that cannot reliably store this state should
   * use a constant set of derivation options that cannot be modified by the
   * user.
   * 
   */
  mutable?: boolean; // Default: false

  /**
   * A string that may be added by the DiceKeys app to help users remember which
   * seed (DiceKey) they used to derive a key or secret.
   * 
   * e.g. `My DiceKey labeled "Personal Accounts".`
   */
  seedHint?: string;

  /**
   * A specific seed hint consisting of the letters at the four corners of
   * the DiceKey, in clockwise order from whereever the user initially
   * scanned as the top-left corner.
   * 
   * The array must be a string consisting of four uppercase characters
   */
  cornerLetters?: string;

  /**
   * The DiceKeys app will want to get a user's consent before deriving a
   * secret on behalf of an app.
   * 
   * When a user approves a set of DerivationOtpions, this field
   * allows us to record that the options were, at least at one time, approved
   * by the holder of this DiceKey.
   * 
   * Set this field to empty (two double quotes, ""), call DerivationOptions.derivePrimarySecret
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
   * [[UnsealingKey]], or
   * [[SigningKey]].
   * Clients may retrieve a derived [[SealingKey]],
   * or [[SignatureVerificationKey]] even if this value
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
   * string consisting of triples for each die in canonoical order:
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

  /**
   * When generating a [Secret] that will be converted to a password, this
   * field stores the name of the word list to use to convert it to a password.
   * 
   * If this field is set, the specified word list will be used to turn the
   * secret into a password if getPassword is called.
   * 
   * If the field is not set and the derivation options are mutable, the
   * DiceKeys app should allow the user to choose from a set of word lists
   * to match the user's preference of language and vocabulary size once
   * more than one word list is avaialble.  The DiceKeys app will then
   * return a derivationOptionsJson string with the wordList field set
   * to the user's chosen word list.
   * 
   * If the derivation options are not mutable and this field is not set, the
   * DiceKeys app will default to the en_1024_words_5_chars_max_20200709 word list.
   */
  wordList?: WordListName;

  /**
   * When generating a [Secret] that will be converted to a password, this
   * field specifies the maximum number of words to derive.
   */
  wordLimit?: number;

}

export type DerivationOptions = CryptoDerivationOptions & ApiDerivationOptions & {[key:string]: any};

export const DerivationOptions = (
  derivationOptionsAsObjectOrJson?: string | null | DerivationOptions,
  typeRequiredByOperation?: DerivableObjectName
): DerivationOptions => {
  const derivationOptions = 
    (typeof derivationOptionsAsObjectOrJson === "object" && derivationOptionsAsObjectOrJson != null) ?
      derivationOptionsAsObjectOrJson :
      JSON.parse(derivationOptionsAsObjectOrJson ?? "{}") as DerivationOptions;
  if (typeRequiredByOperation && derivationOptions.type && derivationOptions.type !== typeRequiredByOperation) {
    throw InvalidDerivationOptionsTypeFieldException.create(typeRequiredByOperation, derivationOptions.type);
  }
  return derivationOptions;
}