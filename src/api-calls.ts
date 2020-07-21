import {
  Command,
  Inputs,
  Outputs,
  Commands,
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
  [Inputs.COMMON.command]: COMMAND
}

interface ParametersWithDerivationOptions<COMMAND extends Command> extends ApiParametersBase<COMMAND> {
  derivationOptionsJson: string
}

export interface GetPasswordRequest extends ParametersWithDerivationOptions<"getPassword"> {}
export interface GetSecretRequest extends ParametersWithDerivationOptions<"getSecret"> {}
export interface GetSignatureVerificationKeyRequest extends ParametersWithDerivationOptions<"getSignatureVerificationKey"> {}
export interface GetSigningKeyRequest extends ParametersWithDerivationOptions<"getSigningKey"> {}
export interface GetSealingKeyRequest extends ParametersWithDerivationOptions<"getSealingKey"> {}
export interface GetUnsealingKeyRequest extends ParametersWithDerivationOptions<"getUnsealingKey"> {}
export interface GetSymmetricKeyRequest extends ParametersWithDerivationOptions<"getSymmetricKey"> {}
export interface UnsealWithSymmetricKeyRequest extends ApiParametersBase<"unsealWithSymmetricKey"> {
  [Inputs.unsealWithSymmetricKey.packagedSealedMessageFields]: PackagedSealedMessageFields;
}
export interface UnsealWithUnsealingKeyRequest extends ApiParametersBase<"unsealWithUnsealingKey"> {
  [Inputs.unsealWithUnsealingKey.packagedSealedMessageFields]: PackagedSealedMessageFields;
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
  [Outputs.generateSignature.signatureVerificationKeyFields]: SignatureVerificationKeyFields;
}
export interface GetSecretResponse {[Outputs.getSecret.secretFields]: SecretFields}
export interface GetSignatureVerificationKeyResponse {
  [Outputs.getSignatureVerificationKey.signatureVerificationKeyFields]: SignatureVerificationKeyFields;
}
export interface GetSigningKeyResponse {
  [Outputs.getSigningKey.signingKeyFields]: SigningKeyFields;
}
export interface GetSealingKeyResponse {
  [Outputs.getSealingKey.sealingKeyFields]: SealingKeyFields;
}
export interface GetUnsealingKeyResponse {
  [Outputs.getUnsealingKey.unsealingKeyFields]: UnsealingKeyFields;
}
export interface GetSymmetricKeyResponse {
  [Outputs.getSymmetricKey.symmetricKeyFields]: SymmetricKeyFields;
}
export interface UnsealWithSymmetricKeyResponse {plaintext: Uint8Array}
export interface UnsealWithUnsealingKeyResponse {plaintext: Uint8Array}
export interface SealWithSymmetricKeyResponse {
  [Outputs.sealWithSymmetricKey.packagedSealedMessageFields]: PackagedSealedMessageFields;
}

// export interface ApiFunction<REQUEST, RESULT> {
//   (requestObject: REQUEST) : Promise<RESULT>
// }

export interface ApiFunction<REQUEST, RESULT extends {}> {
  parameters: Omit<REQUEST, "command">;
  request: REQUEST;
  result: RESULT;
  fn: (r: Omit<REQUEST, "command">) => Promise<RESULT>;
  apifn: (r: REQUEST) => Promise<RESULT>;
}

export interface GetPassword extends ApiFunction<GetPasswordRequest, GetPasswordResponse> {}
export interface GetSecret extends ApiFunction<GetSecretRequest, GetSecretResponse> {}
export interface GetSignatureVerificationKey extends ApiFunction<GetSignatureVerificationKeyRequest, GetSignatureVerificationKeyResponse> {}
export interface GetSigningKey extends ApiFunction<GetSigningKeyRequest, GetSigningKeyResponse> {}
export interface GetSealingKey extends ApiFunction<GetSealingKeyRequest, GetSealingKeyResponse> {}
export interface GetUnsealingKey extends ApiFunction<GetUnsealingKeyRequest, GetUnsealingKeyResponse> {}
export interface GetSymmetricKey extends ApiFunction<GetSymmetricKeyRequest, GetSymmetricKeyResponse> {}
export interface UnsealWithSymmetricKey extends ApiFunction<UnsealWithSymmetricKeyRequest, UnsealWithSymmetricKeyResponse> {}
export interface UnsealWithUnsealingKey extends ApiFunction<UnsealWithUnsealingKeyRequest, UnsealWithUnsealingKeyResponse> {}
export interface SealWithSymmetricKey extends ApiFunction<SealWithSymmetricKeyRequest, SealWithSymmetricKeyResponse> {}
export interface GenerateSignature extends ApiFunction<GenerateSignatureRequest, GenerateSignatureResponse> {}

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

// export type ApiRequestObject<METHOD extends ApiCall = ApiCall> = METHOD extends (p: infer PARAMETERS) => any ? PARAMETERS : never;
export type ApiRequestObject<METHOD extends ApiCall = ApiCall> = METHOD["request"];
export type ApiCommand<METHOD extends ApiCall = ApiCall> = ApiRequestObject<METHOD>["command"];
export type ApiCallParameters<METHOD extends ApiCall = ApiCall> = Omit<ApiRequestObject<METHOD>, "command">;
//type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;
// export type ApiCallPromisedResult<METHOD extends ApiCall = ApiCall> = ReturnType<METHOD>;
// export type ApiCallResult<METHOD extends ApiCall = ApiCall> = ThenArg<ApiCallPromisedResult<METHOD>>;
export type ApiCallResult<METHOD extends ApiCall = ApiCall> = METHOD["result"];
export type ApiCallPromisedResult<METHOD extends ApiCall = ApiCall> = Promise<ApiCallResult<METHOD>>;
export type Function<METHOD extends ApiCall = ApiCall> = METHOD["fn"]
export type FunctionWithCommand<METHOD extends ApiCall = ApiCall> = METHOD["apifn"]

export type CommandsApiCall<COMMAND extends Command> =
  COMMAND extends typeof Commands.getPassword ? GetPassword :
  COMMAND extends typeof Commands.getSecret  ? GetSecret :
  COMMAND extends typeof Commands.getSignatureVerificationKey ? GetSignatureVerificationKey :
  COMMAND extends typeof Commands.getSigningKey ? GetSigningKey :
  COMMAND extends typeof Commands.getSealingKey ? GetSealingKey :
  COMMAND extends typeof Commands.getUnsealingKey ? GetUnsealingKey :
  COMMAND extends typeof Commands.getSymmetricKey ? GetSymmetricKey :
  COMMAND extends typeof Commands.unsealWithSymmetricKey ? UnsealWithSymmetricKey :
  COMMAND extends typeof Commands.unsealWithUnsealingKey ? UnsealWithUnsealingKey :
  COMMAND extends typeof Commands.sealWithSymmetricKey ? SealWithSymmetricKey :
  COMMAND extends typeof Commands.generateSignature ? GenerateSignature :
    never;
export type ResponseForCommand<COMMAND extends Command> = ApiCallResult<CommandsApiCall<COMMAND>>;
export type RequestsApiCall<REQUEST extends ApiRequestObject> = CommandsApiCall<REQUEST["command"]>
export type ResultForRequest<REQUEST extends ApiRequestObject> = ApiCallResult<RequestsApiCall<REQUEST>>


export interface RequestMetadata {
  [Inputs.COMMON.requestId]: string,
}

export interface PostMessageRequestMetadata extends RequestMetadata {
  [Inputs.COMMON.windowName]: string
}

export type RequestMessage<CALL extends ApiCall = ApiCall> = ApiRequestObject<CALL> & RequestMetadata;


export interface ResponseMetadata {
  [Inputs.COMMON.requestId]: string,
}

export type SuccessResult<CALL extends ApiCall = ApiCall> =
ResponseMetadata & ApiCallResult<CALL>;

export interface ExceptionResponse extends ResponseMetadata {
  [Outputs.COMMON.exception]: string;
  [Outputs.COMMON.message]?: string | undefined;
  [Outputs.COMMON.stack]?: string | undefined;
}

export type Response<CALL extends ApiCall = ApiCall> = SuccessResult<CALL> | ExceptionResponse;
export type ResponseForRequest<REQUEST extends ApiRequestObject = ApiRequestObject> = Response<RequestsApiCall<REQUEST>>