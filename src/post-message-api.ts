import {
  // API function factories
  apiCallFactory
} from "./api-factory";
import {
  postMessageApiCallFactory
} from "./post-message-api-factory";
import {
  GenerateSignature,
  GetSealingKey,
  GetSecret,
  GetPassword,
  GetSignatureVerificationKey,
  GetSigningKey,
  GetSymmetricKey,
  GetUnsealingKey,
  SealWithSymmetricKey,
  UnsealWithSymmetricKey,
  UnsealWithUnsealingKey,
  GenerateSignatureParameters,
  GenerateSignatureSuccessResponse,
  GetPasswordSuccessResponse,
  GetSealingKeySuccessResponse,
  GetSealingKeyParameters,
  GetSecretParameters,
  GetSecretSuccessResponse,
  GetSignatureVerificationKeyParameters,
  GetSignatureVerificationKeySuccessResponse,
  GetSigningKeyParameters,
  GetSigningKeySuccessResponse,
  GetSymmetricKeyParameters,
  GetSymmetricKeySuccessResponse,
  GetUnsealingKeyParameters,
  GetUnsealingKeySuccessResponse,
  SealWithSymmetricKeyParameters,
  SealWithSymmetricKeySuccessResponse,
  UnsealWithSymmetricKeyParameters,
  UnsealWithSymmetricKeySuccessResponse,
  UnsealWithUnsealingKeyParameters,
  UnsealWithUnsealingKeySuccessResponse,
  GetPasswordParameters
} from "./api-calls";

const callPostMessageApi = postMessageApiCallFactory();

/**
  * Sign a message using a public/private signing key pair derived
  * the user's DiceKey using the JSON-encoded [[SigningKeyDerivationOptions]].
 * 
*/
export const generateSignature: (params: GenerateSignatureParameters) => Promise<GenerateSignatureSuccessResponse> =
  apiCallFactory<GenerateSignature>("generateSignature", callPostMessageApi);

/**
 * Derive a password from the user's DiceKey and the JSON encoded
 * [[PasswordDerivationOptions]].
 */
export const getPassword: (params: GetPasswordParameters) => Promise<GetPasswordSuccessResponse> =
  apiCallFactory<GetPassword>("getPassword", callPostMessageApi);

/**
 * Derive a SealingKey from the user's DiceKey and the JSON encoded
 * [[UnsealingKeyDerivationOptions]].
 */
export const getSealingKey: (params: GetSealingKeyParameters) => Promise<GetSealingKeySuccessResponse> =
  apiCallFactory<GetSealingKey>("getSealingKey", callPostMessageApi);

/**
 * Derive a binary Secret from the user's DiceKey and the JSON encoded
 * [[SecretDerivationOptions]].
 */
export const getSecret: (params: GetSecretParameters) => Promise<GetSecretSuccessResponse> =
apiCallFactory<GetSecret>("getSecret", callPostMessageApi);

/**
 * Derive a SignatureVerificationKey from the user's DiceKey and the JSON encoded
 * [[SigningKeyDerivationOptions]].
 */
export const getSignatureVerificationKey: (params: GetSignatureVerificationKeyParameters) => Promise<GetSignatureVerificationKeySuccessResponse> =
  apiCallFactory<GetSignatureVerificationKey>("getSignatureVerificationKey", callPostMessageApi);

/**
 * Derive a SigningKey from the user's DiceKey and the JSON encoded
 * [[SigningKeyDerivationOptions]].
 */
export const getSigningKey: (params: GetSigningKeyParameters) => Promise<GetSigningKeySuccessResponse> =
  apiCallFactory<GetSigningKey>("getSigningKey", callPostMessageApi);

/**
 * Derive a SymmetricKey from the user's DiceKey and the JSON encoded
 * [[SymmetricKeyDerivationOptions]].
 */
export const getSymmetricKey: (params: GetSymmetricKeyParameters) => Promise<GetSymmetricKeySuccessResponse> =
  apiCallFactory<GetSymmetricKey>("getSymmetricKey", callPostMessageApi);

/**
 * Derive an UnsealingKey from the user's DiceKey and the JSON encoded
 * [[UnsealingKeyDerivationOptions]].
 */
export const getUnsealingKey: (params: GetUnsealingKeyParameters) => Promise<GetUnsealingKeySuccessResponse> =
  apiCallFactory<GetUnsealingKey>("getUnsealingKey", callPostMessageApi);

/**
 * Seal a message with a SymmetricKey derived from from the user's DiceKey and the JSON encoded
 * [[SymmetricKeyDerivationOptions]].
 */
export const sealWithSymmetricKey: (params: SealWithSymmetricKeyParameters) => Promise<SealWithSymmetricKeySuccessResponse> =
  apiCallFactory<SealWithSymmetricKey>("sealWithSymmetricKey", callPostMessageApi);

/**
 * Unseal a message sealed with a SymmetricKey derived from from the user's DiceKey and the JSON encoded
 * [[SymmetricKeyDerivationOptions]].
 */
export const unsealWithSymmetricKey: (params: UnsealWithSymmetricKeyParameters) => Promise<UnsealWithSymmetricKeySuccessResponse> =
  apiCallFactory<UnsealWithSymmetricKey>("unsealWithSymmetricKey", callPostMessageApi);

/**
 * Unseal a message sealed with an UnsealingKey derived from from the user's DiceKey and the JSON encoded
 * [[UnsealingKeyDerivationOptions]].
 */
export const unsealWithUnsealingKey: (params: UnsealWithUnsealingKeyParameters) => Promise<UnsealWithUnsealingKeySuccessResponse> =
  apiCallFactory<UnsealWithUnsealingKey>("unsealWithUnsealingKey", callPostMessageApi);
