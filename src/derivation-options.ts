import {DerivationOptions as CryptoDerivationOptions} from "@dicekeys/seeded-crypto-js";
import {
  InvalidDerivationOptionsTypeFieldException
} from "./exceptions";
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
  * Used by URL-based interfaces and ignored by the PostMessage-based interface.
  * If the last character is a '*', the path will match if the preceding characters are a prefix of the URL's path.
  * If the last character is not a '*', the path must be an exact match.
  * 
  * If not specified, all paths are allowed.
  * If empty, no path will match and the URL interface is disallowed.
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
}

export type DerivationOptions = CryptoDerivationOptions & ApiDerivationOptions;

export const DerivationOptions = (
  derivationOptionsAsObjectOrJson?: string | DerivationOptions | null,
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