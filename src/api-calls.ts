import {
  Command,
  Inputs,
  Outputs,
} from "./api-strings"
import {
  PackagedSealedMessageFields,
  SecretFields,
  SignatureVerificationKeyFields,
  SigningKeyFields,
  SealingKeyFields,
  UnsealingKeyFields,
  SymmetricKeyFields
} from "./seeded-crypto-object-fields";

interface ApiParametersBase<COMMAND extends Command> {
  command: COMMAND
}

interface ParametersWithDerivationOptions<COMMAND extends Command> extends ApiParametersBase<COMMAND> {
  derivationOptionsJson: string
}

export interface GetPasswordRequest extends ParametersWithDerivationOptions<"getPassword"> {
  [Inputs.getPassword.wordLimit]?: number
}
export interface GetSecretRequest extends ParametersWithDerivationOptions<"getSecret"> {}
export interface GetSignatureVerificationKeyRequest extends ParametersWithDerivationOptions<"getSignatureVerificationKey"> {}
export interface GetSigningKeyRequest extends ParametersWithDerivationOptions<"getSigningKey"> {}
export interface GetSealingKeyRequest extends ParametersWithDerivationOptions<"getSealingKey"> {}
export interface GetUnsealingKeyRequest extends ParametersWithDerivationOptions<"getUnsealingKey"> {}
export interface GetSymmetricKeyRequest extends ParametersWithDerivationOptions<"getSymmetricKey"> {}
export interface UnsealWithSymmetricKeyRequest extends ApiParametersBase<"unsealWithSymmetricKey"> {
  [Inputs.unsealWithSymmetricKey.packagedSealedMessage]: PackagedSealedMessageFields;
}
export interface UnsealWithUnsealingKeyRequest extends ApiParametersBase<"unsealWithUnsealingKey"> {
  [Inputs.unsealWithUnsealingKey.packagedSealedMessage]: PackagedSealedMessageFields;
}
export interface SealWithSymmetricKeyRequest extends ParametersWithDerivationOptions<"sealWithSymmetricKey"> {
  plaintext: Uint8Array;
  unsealingInstructions?: string
}
export interface GenerateSignatureRequest extends ParametersWithDerivationOptions<"generateSignature"> {
  message: Uint8Array;
}

export interface GetPasswordResponse {
  [Outputs.getPassword.password]: string,
  [Outputs.getPassword.derivationOptionsJson]: string
}
export interface GenerateSignatureResponse {
  [Outputs.generateSignature.signature]: Uint8Array
  [Outputs.generateSignature.signatureVerificationKey]: SignatureVerificationKeyFields
}
export type GetSecretResponse = SecretFields;
export type GetSignatureVerificationKeyResponse = SignatureVerificationKeyFields;
export type GetSigningKeyResponse = SigningKeyFields;
export type GetSealingKeyResponse = SealingKeyFields;
export type GetUnsealingKeyResponse= UnsealingKeyFields;
export type GetSymmetricKeyResponse = SymmetricKeyFields;
export type UnsealWithSymmetricKeyResponse = Uint8Array;
export type UnsealWithUnsealingKeyResponse = Uint8Array;
export type SealWithSymmetricKeyResponse = PackagedSealedMessageFields;



// interface ApiRequestAndResponse<REQUEST extends ApiRequestType, RESPONSE extends ApiResponseType> {
//   request: REQUEST;
//   response: RESPONSE;
// }
interface ApiRequestAndResponse<PARAMETERS, RESULT> {
  (parameters: PARAMETERS) : Promise<RESULT>
}

export interface GetPassword extends ApiRequestAndResponse<GetPasswordRequest, GetPasswordResponse> {}
export interface GetSecret extends ApiRequestAndResponse<GetSecretRequest, GetSecretResponse> {}
export interface GetSignatureVerificationKey extends ApiRequestAndResponse<GetSignatureVerificationKeyRequest, GetSignatureVerificationKeyResponse> {}
export interface GetSigningKey extends ApiRequestAndResponse<GetSigningKeyRequest, GetSigningKeyResponse> {}
export interface GetSealingKey extends ApiRequestAndResponse<GetSealingKeyRequest, GetSealingKeyResponse> {}
export interface GetUnsealingKey extends ApiRequestAndResponse<GetUnsealingKeyRequest, GetUnsealingKeyResponse> {}
export interface GetSymmetricKey extends ApiRequestAndResponse<GetSymmetricKeyRequest, GetSymmetricKeyResponse> {}
export interface UnsealWithSymmetricKey extends ApiRequestAndResponse<UnsealWithSymmetricKeyRequest, UnsealWithSymmetricKeyResponse> {}
export interface UnsealWithUnsealingKey extends ApiRequestAndResponse<UnsealWithUnsealingKeyRequest, UnsealWithUnsealingKeyResponse> {}
export interface SealWithSymmetricKey extends ApiRequestAndResponse<SealWithSymmetricKeyRequest, SealWithSymmetricKeyResponse> {}
export interface GenerateSignature extends ApiRequestAndResponse<GenerateSignatureRequest, GenerateSignatureResponse> {}

export type ApiCall =
  GetPassword |
  GetSecret |
  GetSignatureVerificationKey |
  GetSigningKey |
  GetSealingKey |
  GetUnsealingKey |
  GetSymmetricKey |
  UnsealWithSymmetricKey |
  UnsealWithUnsealingKey |
  SealWithSymmetricKey |
  GenerateSignature;
export type ApiCallObject<METHOD extends ApiCall = ApiCall> = Parameters<METHOD>[0];
export type ApiCommand<METHOD extends ApiCall = ApiCall> = Parameters<METHOD>[0]["command"];
export type ApiCallParameters<METHOD extends ApiCall = ApiCall> = Omit<ApiCallObject<METHOD>, "command">
type ThenArg<T> = T extends PromiseLike<infer U> ? U : T
export type ApiCallPromisedResult<METHOD extends ApiCall = ApiCall> = ReturnType<METHOD>;
export type ApiCallResult<METHOD extends ApiCall = ApiCall> = ThenArg<ApiCallPromisedResult<METHOD>>;
