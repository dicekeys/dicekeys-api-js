import {
  toNameMap,
  toFieldNameMap
} from "./to-name-map";
import {
  PackagedSealedMessageFields,
  SecretFields,
  SignatureVerificationKeyFields,
  SigningKeyFields,
  SealingKeyFields,
  UnsealingKeyFields,
  SymmetricKeyFields
} from "./seeded-crypto-object-fields";



interface ParametersWithDerivationOptions {
  /**
   * JSON-encoded DerivationOptions (plus arbitrary additional fields)
   */
  derivationOptionsJson: string;
}
export const DerivationFunctionParameterNames = toFieldNameMap<ParametersWithDerivationOptions>(
  "derivationOptionsJson"
)


export interface GetPasswordParameters extends ParametersWithDerivationOptions {
  /**
   * JSON-encoded [[PasswordDerivationOptions]] (with arbitrary additional JSON fields allowed)
   */
  derivationOptionsJson: string;
}
export const GetPasswordParameterNames = DerivationFunctionParameterNames;

export interface GetSecretParameters extends ParametersWithDerivationOptions {
  /**
   * JSON-encoded [[SecretDerivationOptions]] (with arbitrary additional JSON fields allowed)
   */
  derivationOptionsJson: string;
}
export const GetSecretParameterNames = DerivationFunctionParameterNames;

export interface GetSignatureVerificationKeyParameters extends ParametersWithDerivationOptions {
  /**
   * JSON-encoded [[SigningKeyDerivationOptions]] (with arbitrary additional JSON fields allowed)
   */
  derivationOptionsJson: string;
}
export const GetSignatureVerificationKeyParameterNames = DerivationFunctionParameterNames;

export interface GetSigningKeyParameters extends ParametersWithDerivationOptions{
  /**
   * JSON-encoded [[SigningKeyDerivationOptions]] (with arbitrary additional JSON fields allowed)
   */
  derivationOptionsJson: string;
}
export const GetSigningKeyParameterNames = DerivationFunctionParameterNames;

export interface GetSealingKeyParameters extends ParametersWithDerivationOptions {
  /**
   * JSON-encoded [[UnsealingKeyDerivationOptions]] (with arbitrary additional JSON fields allowed)
   */
  derivationOptionsJson: string;
}
export const GetSealingParameterNames = DerivationFunctionParameterNames;

export interface GetUnsealingKeyParameters extends  ParametersWithDerivationOptions {
  /**
   * JSON-encoded [[UnsealingKeyDerivationOptions]] (with arbitrary additional JSON fields allowed)
   */
  derivationOptionsJson: string;
}
export const GetUnsealingKeyParameterNames = DerivationFunctionParameterNames;

export interface GetSymmetricKeyParameters extends ParametersWithDerivationOptions {
  /**
   * JSON-encoded [[SymmetricKeyDerivationOptions]] (with arbitrary additional JSON fields allowed)
   */
  derivationOptionsJson: string;
}
export const GetSymmetricKeyParameterNames = DerivationFunctionParameterNames;

export interface UnsealWithSymmetricKeyParameters {
  /**
   * The encrypted (sealed) message to be unsealed packaged with its derivation options and optional unsealing instructions.
   */
  packagedSealedMessageFields: PackagedSealedMessageFields;
}
export const UnsealWithSymmetricKeyParameterNames = toFieldNameMap<UnsealWithSymmetricKeyParameters>(
  "packagedSealedMessageFields"
);

export interface UnsealWithUnsealingKeyParameters {
  /**
   * The sealed (encrypted and authenticated) message to be unsealed packaged with its derivation options and optional unsealing instructions.
   */
  packagedSealedMessageFields: PackagedSealedMessageFields;
}
export const UnsealWithUnsealingKeyParameterNames = toFieldNameMap<UnsealWithUnsealingKeyParameters>(
  "packagedSealedMessageFields"
);

export interface SealWithSymmetricKeyParameters extends ParametersWithDerivationOptions {
  /**
   * JSON-encoded [[UnsealingKeyDerivationOptions]] (with arbitrary additional JSON fields allowed)
   */
  derivationOptionsJson: string;
  /**
   * The plaintext message to seal (encrypt and authenticate)
   */
  plaintext: Uint8Array;
  /**
   * An optional JSON encoded [[UnsealingInstructions]] object encoding additional requirements for unsealing
   */
  unsealingInstructions?: string
}
export const SealWithSymmetricKeyParameterNames = toFieldNameMap<SealWithSymmetricKeyParameters>(
  "derivationOptionsJson", "plaintext", "unsealingInstructions"
);

export interface GenerateSignatureParameters extends ParametersWithDerivationOptions{
  /**
   * JSON-encoded [[SigningKeyDerivationOptions]] (with arbitrary additional JSON fields allowed)
   */
  derivationOptionsJson: string;
  /**
   * The plaintext message to generate a signature for.
   */
  message: Uint8Array;
}
export const GenerateSignatureParameterNames = toFieldNameMap<GenerateSignatureParameters>(
  "derivationOptionsJson", "message"
);

export type Parameters = 
  GetPasswordParameters |
  GetSecretParameters |
  GetSignatureVerificationKeyParameters |
  GetSigningKeyParameters |
  GetSealingKeyParameters |
  GetUnsealingKeyParameters |
  GetSymmetricKeyParameters |
  UnsealWithSymmetricKeyParameters |
  UnsealWithUnsealingKeyParameters |
  SealWithSymmetricKeyParameters |
  GenerateSignatureParameters;

export const Command = toNameMap([
  "getPassword",
  "getSecret",
  "getSignatureVerificationKey",
  "getSigningKey",
  "getSealingKey",
  "getUnsealingKey",
  "getSymmetricKey",
  "unsealWithSymmetricKey",
  "unsealWithUnsealingKey",
  "sealWithSymmetricKey",
  "generateSignature",  
])
export type Command = keyof typeof Command;

export interface GetPasswordSuccessResponse {
  /**
   * The generated password.
   */
  password: string,
  /**
   * The JSON-encoded [[PasswordDerivationOptions]] used to derive the password,
   * which may have been modified during the request if it was passed with the
   * `mutable` option set to true.
   */
  derivationOptionsJson: string
}
export const GetPasswordSuccessResponseParameterNames = toFieldNameMap<GetPasswordSuccessResponse>(
  "derivationOptionsJson", "password"
);

export interface GenerateSignatureSuccessResponse {
  /**
   * The signature of the message
   */
  signature: Uint8Array
  /**
   * The fields of the SignatureVerificationKey matching the derived SigningKey,
   * in case the party receiving the signature needs to be reminded of the verification key.
   */
  signatureVerificationKeyFields: SignatureVerificationKeyFields;
}
export const GenerateSignatureSuccessResponseParameterNames = toFieldNameMap<GenerateSignatureSuccessResponse>(
  "signature", "signatureVerificationKeyFields"
);

export interface GetSecretSuccessResponse {
  /**
   * The fields of the derived Secret.
   */
  secretFields: SecretFields
}
export const GetSecretSuccessResponseParameterNames = toFieldNameMap<GetSecretSuccessResponse>(
  "secretFields"
);

export interface GetSignatureVerificationKeySuccessResponse {
  /**
   * The fields of the derived SignatureVerificationKey.
   */
  signatureVerificationKeyFields: SignatureVerificationKeyFields;
}
export const GetSignatureVerificationKeySuccessResponseParameterNames = toFieldNameMap<GetSignatureVerificationKeySuccessResponse>(
  "signatureVerificationKeyFields"
);

export interface GetSigningKeySuccessResponse {
  /**
   * The fields of the derived SigningKey.
   */
  signingKeyFields: SigningKeyFields;
}
export const GetSigningKeySuccessResponseParameterNames = toFieldNameMap<GetSigningKeySuccessResponse>(
  "signingKeyFields"
);

export interface GetSealingKeySuccessResponse {
  /**
   * The fields of the derived SealingKey.
   */
  sealingKeyFields: SealingKeyFields;
}
export const GetSealingKeySuccessResponseParameterNames = toFieldNameMap<GetSealingKeySuccessResponse>(
  "sealingKeyFields"
);

export interface GetUnsealingKeySuccessResponse {
  /**
   * The fields of the derived UnsealingKey.
   */
  unsealingKeyFields: UnsealingKeyFields;
}
export const GetUnsealingKeySuccessResponseParameterNames = toFieldNameMap<GetUnsealingKeySuccessResponse>(
  "unsealingKeyFields"
);

export interface GetSymmetricKeySuccessResponse {
  /**
   * The fields of the derived SymmetricKey.
   */
  symmetricKeyFields: SymmetricKeyFields;
}
export const GetSymmetricKeySuccessResponseParameterNames = toFieldNameMap<GetSymmetricKeySuccessResponse>(
  "symmetricKeyFields"
);

export interface UnsealWithSymmetricKeySuccessResponse {
  /**
   * The unsealed plaintext decrypted and authenticated using
   * the derived SymmetricKey.
   */
  plaintext: Uint8Array;
}
export const UnsealWithSymmetricKeySuccessResponseParameterNames = toFieldNameMap<UnsealWithSymmetricKeySuccessResponse>(
  "plaintext"
);

export interface UnsealWithUnsealingKeySuccessResponse {
  /**
   * The unsealed plaintext decrypted and authenticated using
   * the derived UnsealingKey.
   */
  plaintext: Uint8Array;
}
export const UnsealWithUnsealingKeySuccessResponseParameterNames = toFieldNameMap<UnsealWithUnsealingKeySuccessResponse>(
  "plaintext"
);

/**
 * The fields of the PackagedSealedMessage which encode everything
 * the DiceKey holder will need to re-derive the SymmetricKey and
 * the sealed message. 
 */
export interface SealWithSymmetricKeySuccessResponse {
  packagedSealedMessageFields: PackagedSealedMessageFields;
}
export const SealWithSymmetricKeySuccessResponseParameterNames = toFieldNameMap<SealWithSymmetricKeySuccessResponse>(
  "packagedSealedMessageFields"
);

export type SuccessResponse = 
  GetPasswordSuccessResponse |
  GetSecretSuccessResponse |
  GetSignatureVerificationKeySuccessResponse |
  GetSigningKeySuccessResponse |
  GetSealingKeySuccessResponse |
  GetUnsealingKeySuccessResponse |
  GetSymmetricKeySuccessResponse |
  UnsealWithSymmetricKeySuccessResponse |
  UnsealWithUnsealingKeySuccessResponse |
  SealWithSymmetricKeySuccessResponse |
  GenerateSignatureSuccessResponse;


export interface RequestCommand<COMMAND extends string> {
  /**
   * The name of the command
   */
  command: COMMAND
}
export const RequestCommandParameterNames = toFieldNameMap<RequestCommand<any>>(
  "command"
);

export type Request = 
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
export type GetPasswordRequest = GetPasswordParameters & RequestCommand<typeof Command.getPassword>;
export type GetSecretRequest = GetSecretParameters & RequestCommand<typeof Command.getSecret>;
export type GetSignatureVerificationKeyRequest = GetSignatureVerificationKeyParameters & RequestCommand<typeof Command.getSignatureVerificationKey>;
export type GetSigningKeyRequest = GetSigningKeyParameters & RequestCommand<typeof Command.getSigningKey>;
export type GetSealingKeyRequest = GetSealingKeyParameters & RequestCommand<typeof Command.getSealingKey>;
export type GetUnsealingKeyRequest = GetUnsealingKeyParameters & RequestCommand<typeof Command.getUnsealingKey>;
export type GetSymmetricKeyRequest = GetSymmetricKeyParameters & RequestCommand<typeof Command.getSymmetricKey>;
export type UnsealWithSymmetricKeyRequest = UnsealWithSymmetricKeyParameters & RequestCommand<typeof Command.unsealWithSymmetricKey>;
export type UnsealWithUnsealingKeyRequest = UnsealWithUnsealingKeyParameters & RequestCommand<typeof Command.unsealWithUnsealingKey>;
export type SealWithSymmetricKeyRequest = SealWithSymmetricKeyParameters & RequestCommand<typeof Command.sealWithSymmetricKey>;
export type GenerateSignatureRequest = GenerateSignatureParameters & RequestCommand<typeof Command.generateSignature>;


interface ApiFunction<PARAMETERS extends Parameters, COMMAND_NAME extends Command, SUCCESS_RESPONSE extends SuccessResponse> {
  parameters: PARAMETERS;
  request: RequestCommand<COMMAND_NAME> & PARAMETERS;
  result: SUCCESS_RESPONSE;
  fn: (r: PARAMETERS) => Promise<SUCCESS_RESPONSE>;
  apiFn: (r: RequestCommand<COMMAND_NAME> & PARAMETERS) => Promise<SUCCESS_RESPONSE>;
}

export interface GetPassword extends ApiFunction<GetPasswordParameters, typeof Command.getPassword, GetPasswordSuccessResponse> {}
export interface GetSecret extends ApiFunction<GetSecretParameters, typeof Command.getSecret, GetSecretSuccessResponse> {}
export interface GetSignatureVerificationKey extends ApiFunction<GetSignatureVerificationKeyParameters, typeof Command.getSignatureVerificationKey, GetSignatureVerificationKeySuccessResponse> {}
export interface GetSigningKey extends ApiFunction<GetSigningKeyParameters, typeof Command.getSigningKey, GetSigningKeySuccessResponse> {}
export interface GetSealingKey extends ApiFunction<GetSealingKeyParameters, typeof Command.getSealingKey, GetSealingKeySuccessResponse> {}
export interface GetUnsealingKey extends ApiFunction<GetUnsealingKeyParameters, typeof Command.getUnsealingKey, GetUnsealingKeySuccessResponse> {}
export interface GetSymmetricKey extends ApiFunction<GetSymmetricKeyParameters, typeof Command.getSymmetricKey, GetSymmetricKeySuccessResponse> {}
export interface UnsealWithSymmetricKey extends ApiFunction<UnsealWithSymmetricKeyParameters, typeof Command.unsealWithSymmetricKey, UnsealWithSymmetricKeySuccessResponse> {}
export interface UnsealWithUnsealingKey extends ApiFunction<UnsealWithUnsealingKeyParameters, typeof Command.unsealWithUnsealingKey, UnsealWithUnsealingKeySuccessResponse> {}
export interface SealWithSymmetricKey extends ApiFunction<SealWithSymmetricKeyParameters, typeof Command.sealWithSymmetricKey, SealWithSymmetricKeySuccessResponse> {}
export interface GenerateSignature extends ApiFunction<GenerateSignatureParameters, typeof Command.generateSignature, GenerateSignatureSuccessResponse> {}

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
//type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;
// export type ApiCallPromisedResult<METHOD extends ApiCall = ApiCall> = ReturnType<METHOD>;
// export type ApiCallResult<METHOD extends ApiCall = ApiCall> = ThenArg<ApiCallPromisedResult<METHOD>>;
export type ApiCallResult<METHOD extends ApiCall = ApiCall> = METHOD["result"];
export type ApiCallPromisedResult<METHOD extends ApiCall = ApiCall> = Promise<ApiCallResult<METHOD>>;
export type Function<METHOD extends ApiCall = ApiCall> = METHOD["fn"]
export type FunctionWithCommand<METHOD extends ApiCall = ApiCall> = METHOD["apiFn"];

export type CommandsApiCall<COMMAND extends Command> =
  COMMAND extends typeof Command.getPassword ? GetPassword :
  COMMAND extends typeof Command.getSecret ? GetSecret :
  COMMAND extends typeof Command.getSignatureVerificationKey ? GetSignatureVerificationKey :
  COMMAND extends typeof Command.getSigningKey ? GetSigningKey :
  COMMAND extends typeof Command.getSealingKey ? GetSealingKey :
  COMMAND extends typeof Command.getUnsealingKey ? GetUnsealingKey :
  COMMAND extends typeof Command.getSymmetricKey ? GetSymmetricKey :
  COMMAND extends typeof Command.unsealWithSymmetricKey ? UnsealWithSymmetricKey :
  COMMAND extends typeof Command.unsealWithUnsealingKey ? UnsealWithUnsealingKey :
  COMMAND extends typeof Command.sealWithSymmetricKey ? SealWithSymmetricKey :
  COMMAND extends typeof Command.generateSignature ? GenerateSignature :
    never;
export type ResponseForCommand<COMMAND extends Command> = ApiCallResult<CommandsApiCall<COMMAND>>;
export type RequestsApiCall<REQUEST extends Request> = CommandsApiCall<REQUEST["command"]>
export type ResultForRequest<REQUEST extends Request> = ApiCallResult<RequestsApiCall<REQUEST>>


export interface RequestMetadata {
  requestId: string,
}
export const RequestMetadataParameterNames = toFieldNameMap<RequestMetadata>(
  "requestId"
);

export type RequestMessage<CALL extends ApiCall = ApiCall> = ApiRequestObject<CALL> & RequestMetadata


export interface ResponseMetadata {
  requestId: string,
}
export const ResponseMetadataParameterNames = toFieldNameMap<ResponseMetadata>(
  "requestId"
);

export type SuccessResult<CALL extends ApiCall = ApiCall> =
ResponseMetadata & ApiCallResult<CALL>;

export interface ExceptionResponse extends ResponseMetadata {
  exception: string;
  message?: string | undefined;
  stack?: string | undefined;
}
export const ExceptionResponseParameterNames = toFieldNameMap<ExceptionResponse>(
  "requestId",
  "exception",
  "message",
  "stack"
);
export type Response<CALL extends ApiCall = ApiCall> = SuccessResult<CALL> | ExceptionResponse;
export type ResponseForRequest<REQUEST extends Request = Request> = Response<RequestsApiCall<REQUEST>>