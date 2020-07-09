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

interface ApiRequestBase<COMMAND extends Command> {
  command: COMMAND
}

interface RequestWithDerivationOptions<COMMAND extends Command> extends ApiRequestBase<COMMAND> {
  derivationOptionsJson: string
}

export interface GetPasswordRequest extends RequestWithDerivationOptions<"getPassword"> {
  [Inputs.getPassword.wordLimit]?: number
}
export interface GetSecretRequest extends RequestWithDerivationOptions<"getSecret"> {}
export interface GetSignatureVerificationKeyRequest extends RequestWithDerivationOptions<"getSignatureVerificationKey"> {}
export interface GetSigningKeyRequest extends RequestWithDerivationOptions<"getSigningKey"> {}
export interface GetSealingKeyRequest extends RequestWithDerivationOptions<"getSealingKey"> {}
export interface GetUnsealingKeyRequest extends RequestWithDerivationOptions<"getUnsealingKey"> {}
export interface GetSymmetricKeyRequest extends RequestWithDerivationOptions<"getSymmetricKey"> {}
export interface UnsealWithSymmetricKeyRequest extends ApiRequestBase<"unsealWithSymmetricKey"> {
  [Inputs.unsealWithSymmetricKey.packagedSealedMessage]: PackagedSealedMessageFields;
}
export interface UnsealWithUnsealingKeyRequest extends ApiRequestBase<"unsealWithUnsealingKey"> {
  [Inputs.unsealWithUnsealingKey.packagedSealedMessage]: PackagedSealedMessageFields;
}
export interface SealWithSymmetricKeyRequest extends RequestWithDerivationOptions<"sealWithSymmetricKey"> {
  plaintext: Uint8Array;
  unsealingInstructions?: string
}
export interface GenerateSignatureRequest extends RequestWithDerivationOptions<"generateSignature"> {
  message: Uint8Array;
}
//interface GetAuthTokenRequest extends ApiRequestBase<"getAuthToken"> {}

type ApiRequestType =
  GetPasswordRequest |
  GetSecretRequest |
  GetSignatureVerificationKeyRequest |
  GetSigningKeyRequest |
  GetSealingKeyRequest |
  GetUnsealingKeyRequest |
  GetSymmetricKeyRequest |
  UnsealWithSymmetricKeyRequest |
  UnsealWithUnsealingKeyRequest |
  SealWithSymmetricKeyRequest |
  GenerateSignatureRequest;

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
export type SealWithSymmetricKeyResponse =PackagedSealedMessageFields;

type ApiResponseType =
  GetPasswordResponse |
  GetSecretResponse |
  GetSignatureVerificationKeyResponse |
  GetSigningKeyResponse |
  GetSealingKeyResponse |
  GetUnsealingKeyResponse |
  GetSymmetricKeyResponse |
  UnsealWithSymmetricKeyResponse |
  UnsealWithUnsealingKeyResponse |
  SealWithSymmetricKeyResponse |
  GenerateSignatureResponse;


interface ApiRequestAndResponse<REQUEST extends ApiRequestType, RESPONSE extends ApiResponseType> {
  request: REQUEST;
  response: RESPONSE;
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

export type ApiMethod =
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
export type REQUEST_OF<METHOD extends ApiMethod> = METHOD["request"];
export type RESPONSE_OF<METHOD extends ApiMethod> = METHOD["response"];
export type ApiRequest = REQUEST_OF<ApiMethod>
export type ApiResponse = RESPONSE_OF<ApiMethod>
