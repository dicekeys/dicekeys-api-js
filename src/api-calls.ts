import {
  toNameMap,
  toFieldNameMap
} from "./to-name-map";


interface ParametersWithRecipe {
  /**
   * JSON-encoded Recipe (plus arbitrary additional fields)
   */
  recipe?: string;

  /**
   * Determines whether the DiceKeys app may allow the user to make adjustments to the
   * recipe (desirable when creating a new secret/key/password), or if the options should be treated
   * as immutable (as would be desired when replicating a previously-generated key).
   * 
   * Defaults to true for "getSealingKey" and "sealWithSymmetricKey" (as no data has been sealed yet),
   * and false otherwise (such as when generating a password or secret, as we don't know if it's the first time,
   * or when generating other secrets).
   */
  recipeMayBeModified?: boolean;
}
export const RecipeFunctionParameterNames = toFieldNameMap<ParametersWithRecipe>(
  "recipe",
  "recipeMayBeModified",
)

export const getDefaultValueOfRecipeMayBeModified = (command: Command): boolean =>
  command === "getSealingKey" || command == "sealWithSymmetricKey";

export interface GetPasswordParameters extends ParametersWithRecipe {
  /**
   * JSON-encoded [[PasswordRecipe]] (with arbitrary additional JSON fields allowed)
   */
  recipe?: string;
}
export const GetPasswordParameterNames = RecipeFunctionParameterNames;

export interface GetSecretParameters extends ParametersWithRecipe {
  /**
   * JSON-encoded [[SecretRecipe]] (with arbitrary additional JSON fields allowed)
   */
  recipe?: string;
}
export const GetSecretParameterNames = RecipeFunctionParameterNames;

export interface GetSignatureVerificationKeyParameters extends ParametersWithRecipe {
  /**
   * JSON-encoded [[SigningKeyRecipe]] (with arbitrary additional JSON fields allowed)
   */
  recipe?: string;
}
export const GetSignatureVerificationKeyParameterNames = RecipeFunctionParameterNames;

export interface GetSigningKeyParameters extends ParametersWithRecipe{
  /**
   * JSON-encoded [[SigningKeyRecipe]] (with arbitrary additional JSON fields allowed)
   */
  recipe: string;
}
export const GetSigningKeyParameterNames = RecipeFunctionParameterNames;

export interface GetSealingKeyParameters extends ParametersWithRecipe {
  /**
   * JSON-encoded [[UnsealingKeyRecipe]] (with arbitrary additional JSON fields allowed)
   */
  recipe?: string;
}
export const GetSealingKeyParameterNames = RecipeFunctionParameterNames;

export interface GetUnsealingKeyParameters extends  ParametersWithRecipe {
  /**
   * JSON-encoded [[UnsealingKeyRecipe]] (with arbitrary additional JSON fields allowed)
   */
  recipe: string;
}
export const GetUnsealingKeyParameterNames = RecipeFunctionParameterNames;

export interface GetSymmetricKeyParameters extends ParametersWithRecipe {
  /**
   * JSON-encoded [[SymmetricKeyRecipe]] (with arbitrary additional JSON fields allowed)
   */
  recipe: string;
}
export const GetSymmetricKeyParameterNames = RecipeFunctionParameterNames;


export interface UnsealParameters {
  /**
   * The encrypted (sealed) message to be unsealed packaged with its recipe and optional unsealing instructions.
   */
  packagedSealedMessageJson: string;
}
export const UnsealParameterNames = toFieldNameMap<UnsealWithSymmetricKeyParameters>(
  "packagedSealedMessageJson"
);

export type  UnsealWithSymmetricKeyParameters = UnsealParameters;
export const UnsealWithSymmetricKeyParameterNames = UnsealParameterNames;
export type  UnsealWithUnsealingKeyParameters = UnsealParameters;
export const UnsealWithUnsealingKeyParameterNames = UnsealParameterNames;


export interface SealWithSymmetricKeyParameters extends ParametersWithRecipe {
  /**
   * JSON-encoded [[UnsealingKeyRecipe]] (with arbitrary additional JSON fields allowed)
   */
  recipe?: string;
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
  "recipe", "plaintext", "unsealingInstructions", "recipeMayBeModified"
);

export interface GenerateSignatureParameters extends ParametersWithRecipe{
  /**
   * JSON-encoded [[SigningKeyRecipe]] (with arbitrary additional JSON fields allowed)
   */
  recipe: string;
  /**
   * The plaintext message to generate a signature for.
   */
  message: Uint8Array;
}
export const GenerateSignatureParameterNames = toFieldNameMap<GenerateSignatureParameters>(
  "recipe", "message"
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

export const Commands = [
  "generateSignature",  
  "getPassword",
  "getSealingKey",
  "getSecret",
  "getSigningKey",
  "getSignatureVerificationKey",
  "getSymmetricKey",
  "getUnsealingKey",
  "sealWithSymmetricKey",
  "unsealWithSymmetricKey",
  "unsealWithUnsealingKey",
] as const;
export const Command = toNameMap(Commands)
export type Command = keyof typeof Command;


export const ParameterNames = {
  [Command.generateSignature]: GenerateSignatureParameterNames,
  [Command.getPassword]: GetPasswordParameterNames,
  [Command.getSecret]: GetSecretParameterNames,
  [Command.getSignatureVerificationKey]: GetSignatureVerificationKeyParameterNames,
  [Command.getSigningKey]: GetSigningKeyParameterNames,
  [Command.getSymmetricKey]: GetSymmetricKeyParameterNames,
  [Command.getSealingKey]: GetSealingKeyParameterNames,
  [Command.getUnsealingKey]: GetUnsealingKeyParameterNames,
  [Command.unsealWithSymmetricKey]: UnsealWithSymmetricKeyParameterNames,
  [Command.unsealWithUnsealingKey]: UnsealWithUnsealingKeyParameterNames,
  [Command.sealWithSymmetricKey]: SealWithSymmetricKeyParameterNames,
} as const;



const ListOfCommandsThatRequireRecipeToSetClientMayRetrieveKey = [
  Command.getSigningKey,
  Command.getUnsealingKey,
  Command.getSymmetricKey
] as const;
export type CommandsThatRequireRecipeToSetClientMayRetrieveKey = typeof ListOfCommandsThatRequireRecipeToSetClientMayRetrieveKey[number];


export const SetOfCommandsThatRequireRecipeToSetClientMayRetrieveKey = new Set(ListOfCommandsThatRequireRecipeToSetClientMayRetrieveKey);
export const commandRequiresRecipeToSetClientMayRetrieveKey = (
  command: Command
): command is CommandsThatRequireRecipeToSetClientMayRetrieveKey =>
  SetOfCommandsThatRequireRecipeToSetClientMayRetrieveKey.has(command as CommandsThatRequireRecipeToSetClientMayRetrieveKey);
export const requestRequiresRecipeToSetClientMayRetrieveKey = (
  request: ApiRequestObject
): request is CommandsApiCall<CommandsThatRequireRecipeToSetClientMayRetrieveKey>["request"] =>
  commandRequiresRecipeToSetClientMayRetrieveKey(request.command);

export type CommandWithJsonResponse =
  typeof Command.generateSignature |
  typeof Command.getPassword |
  typeof Command.getSealingKey |
  typeof Command.getSecret |
  typeof Command.getSigningKey |
  typeof Command.getSignatureVerificationKey |
  typeof Command.getSymmetricKey |
  typeof Command.getUnsealingKey |
  typeof Command.sealWithSymmetricKey;
export const commandHasJsonResponse = (command: Command): command is CommandWithJsonResponse =>
  command != Command.unsealWithSymmetricKey && command != Command.unsealWithUnsealingKey;

export const SuccessResponseParameterNames = {
  [Command.generateSignature]: toFieldNameMap<GenerateSignatureSuccessResponse>("signatureVerificationKeyJson", "signature"), // as (keyof GenerateSignatureSuccessResponse)[],
  [Command.getPassword]: toFieldNameMap<GetPasswordSuccessResponse>("passwordJson"),
  [Command.getSecret]: toFieldNameMap<GetSecretSuccessResponse>("secretJson"),
  [Command.getSignatureVerificationKey]: toFieldNameMap<GetSignatureVerificationKeySuccessResponse>("signatureVerificationKeyJson"),
  [Command.getSigningKey]: toFieldNameMap<GetSigningKeySuccessResponse>("signingKeyJson"),
  [Command.getSymmetricKey]: toFieldNameMap<GetSymmetricKeySuccessResponse>("symmetricKeyJson"),
  [Command.getSealingKey]: toFieldNameMap<GetSealingKeySuccessResponse>("sealingKeyJson"),
  [Command.getUnsealingKey]: toFieldNameMap<GetUnsealingKeySuccessResponse>("unsealingKeyJson"),
  [Command.unsealWithSymmetricKey]: toFieldNameMap<UnsealWithSymmetricKeySuccessResponse>("plaintext"),
  [Command.unsealWithUnsealingKey]: toFieldNameMap<UnsealWithUnsealingKeySuccessResponse>("plaintext"),
  [Command.sealWithSymmetricKey]: toFieldNameMap<SealWithSymmetricKeySuccessResponse>("packagedSealedMessageJson"),
} as const;

export const SeededCryptoObjectResponseParameterNames = {
  [Command.generateSignature]: "signatureVerificationKeyJson",
  [Command.getPassword]: "passwordJson",
  [Command.getSealingKey]: "sealingKeyJson",
  [Command.getSecret]: "secretJson",
  [Command.getSigningKey]: "signingKeyJson",
  [Command.getSignatureVerificationKey]: "signatureVerificationKeyJson",
  [Command.getSymmetricKey]: "symmetricKeyJson",
  [Command.getUnsealingKey]: "unsealingKeyJson",
  [Command.sealWithSymmetricKey]: "packagedSealedMessageJson"
} as const;
export type SeededCryptoObjectResponseParameterNames = typeof SeededCryptoObjectResponseParameterNames;
export type SeededCryptoObjectResponseParameterName<COMMAND extends CommandWithJsonResponse> = SeededCryptoObjectResponseParameterNames[COMMAND];


export type GetSeededCryptoObjectSuccessResponse<COMMAND extends CommandWithJsonResponse> = {
  [key in SeededCryptoObjectResponseParameterName<COMMAND>]: string
}
export const GetSeededCryptoObjectResponseParameterNames = <COMMAND extends CommandWithJsonResponse>(
  command: COMMAND
) => ({
  [SeededCryptoObjectResponseParameterNames[command]]: SeededCryptoObjectResponseParameterNames[command]
} as {[key in SeededCryptoObjectResponseParameterName<COMMAND>]: SeededCryptoObjectResponseParameterName<COMMAND>});

export type  GetPasswordSuccessResponse = GetSeededCryptoObjectSuccessResponse<typeof Command.getPassword>;
export const GetPasswordSuccessResponseParameterNames = GetSeededCryptoObjectResponseParameterNames(Command.getPassword);


export type GenerateSignatureSuccessResponse = GetSeededCryptoObjectSuccessResponse<typeof Command.generateSignature> & {
  /**
   * The signature of the message
   */
  signature: Uint8Array
}
export const GenerateSignatureSuccessResponseParameterNames = toFieldNameMap<GenerateSignatureSuccessResponse>(
  "signature", "signatureVerificationKeyJson"
);

export type  GetSecretSuccessResponse = GetSeededCryptoObjectSuccessResponse<typeof Command.getSecret>;
export const GetSecretSuccessResponseParameterNames = GetSeededCryptoObjectResponseParameterNames(Command.getSecret);
export type  GetSignatureVerificationKeySuccessResponse = GetSeededCryptoObjectSuccessResponse<typeof Command.getSignatureVerificationKey>;
export const GetSignatureVerificationKeySuccessResponseParameterNames = GetSeededCryptoObjectResponseParameterNames(Command.getSignatureVerificationKey);
export type  GetSigningKeySuccessResponse = GetSeededCryptoObjectSuccessResponse<typeof Command.getSigningKey>;
export const GetSigningKeySuccessResponseParameterNames = GetSeededCryptoObjectResponseParameterNames(Command.getSigningKey);
export type  GetSealingKeySuccessResponse = GetSeededCryptoObjectSuccessResponse<typeof Command.getSealingKey>;
export const GetSealingKeySuccessResponseParameterNames = GetSeededCryptoObjectResponseParameterNames(Command.getSealingKey);
export type  GetSymmetricKeySuccessResponse = GetSeededCryptoObjectSuccessResponse<typeof Command.getSymmetricKey>;
export const GetSymmetricKeySuccessResponseParameterNames = GetSeededCryptoObjectResponseParameterNames(Command.getSymmetricKey);
export type  GetUnsealingKeySuccessResponse = GetSeededCryptoObjectSuccessResponse<typeof Command.getUnsealingKey>;
export const GetUnsealingKeySuccessResponseParameterNames = GetSeededCryptoObjectResponseParameterNames(Command.getUnsealingKey);
export type  SealWithSymmetricKeySuccessResponse = GetSeededCryptoObjectSuccessResponse<typeof Command.sealWithSymmetricKey>;
export const SealWithSymmetricKeySuccessResponseParameterNames = GetSeededCryptoObjectResponseParameterNames(Command.sealWithSymmetricKey);

export interface UnsealSuccessResponse {
  /**
   * The unsealed plaintext decrypted and authenticated using
   * the derived SymmetricKey.
   */
  plaintext: Uint8Array;
}
export const UnsealSuccessResponseParameterNames = toFieldNameMap<UnsealSuccessResponse>(
  "plaintext"
);

export type  UnsealWithSymmetricKeySuccessResponse = UnsealSuccessResponse;
export const UnsealWithSymmetricKeySuccessResponseParameterNames = UnsealSuccessResponseParameterNames;
export type  UnsealWithUnsealingKeySuccessResponse = UnsealSuccessResponse;
export const UnsealWithUnsealingKeySuccessResponseParameterNames = UnsealSuccessResponseParameterNames;


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

  type SuccessResponseParameterNameTypes<COMMAND extends Command> =
  COMMAND extends "generateSignature" ?
  (keyof typeof GenerateSignatureSuccessResponseParameterNames) :
  COMMAND extends ("unsealWithSymmetricKey" | "unsealWithUnsealingKey") ?
  (keyof typeof UnsealSuccessResponseParameterNames) :
  SeededCryptoObjectResponseParameterNames[COMMAND & CommandWithJsonResponse]

export const SuccessResponseParameters = Commands.reduce( 
  <COMMAND extends Command>(
      result: {[command in COMMAND]: SuccessResponseParameterNameTypes<command>[]},
      command: COMMAND
    ) => {
      result[command] = [
        ...( command in SeededCryptoObjectResponseParameterNames ?
          [SeededCryptoObjectResponseParameterNames[command as keyof SeededCryptoObjectResponseParameterNames]] :
          []
        ),
        ...( command === "generateSignature" ?
          Object.keys(GenerateSignatureSuccessResponseParameterNames) : []
        ),
        ...( (command === "unsealWithSymmetricKey" || command === "unsealWithUnsealingKey") ?
          Object.keys(UnsealSuccessResponseParameterNames) : []
        ),
      ] as SuccessResponseParameterNameTypes<typeof command>[];
      return result;
  }, {} as {
    [command in Command]: SuccessResponseParameterNameTypes<command>[]
  });
export type SuccessResponseParameterName = typeof SuccessResponseParameters[Command][number];
export type SuccessResponseParameterNameToType<P extends SuccessResponseParameterName> =
    P extends ("signature" | "plaintext") ? Uint8Array :
    string;
export type SuccessResponseParameterNameToTypeName<P extends SuccessResponseParameterName> =
    P extends ("signature" | "plaintext") ? "Uint8Array" :
    "string";
export const SuccessResponseParameterNameToTypeName = <SUCCESS_RESPONSE_NAME extends SuccessResponseParameterName>(
  pName: SUCCESS_RESPONSE_NAME
) => (pName === "signature" || pName === "plaintext") ?
      "Uint8Array" : "string";

export interface RequestCommand<COMMAND extends string> {
  /**
   * The name of the command
   */
  command: COMMAND
}
export const RequestCommandParameterNames = toFieldNameMap<RequestCommand<any>>(
  "command"
);

export type RequestWithRecipeParameter = 
  GetPasswordRequest |
  GetSecretRequest |
  GetSignatureVerificationKeyRequest |
  GetSigningKeyRequest |
  GetSealingKeyRequest |
  GetUnsealingKeyRequest |
  GetSymmetricKeyRequest |
  SealWithSymmetricKeyRequest |
  GenerateSignatureRequest;

export type RequestWithPackagedSealedMessageParameter = 
  UnsealWithSymmetricKeyRequest |
  UnsealWithUnsealingKeyRequest;

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

type KeysIncludingOptionalKeys<T> = T extends any ? keyof T : never;
type RequestParameterName = KeysIncludingOptionalKeys<Request>;
export type RequestParameterNameToType<P extends RequestParameterName> =
    P extends ("message" | "plaintext") ? Uint8Array :
    P extends "recipeMayBeModified" ? boolean :
    string;
export type RequestParameterNameToTypeName<P extends RequestParameterName> =
    P extends ("message" | "plaintext") ? "Uint8Array" :
    P extends "recipeMayBeModified" ? "boolean" :
    "string";
export const requestParameterNameToTypeName = <REQUEST_NAME extends RequestParameterName>(
  requestName: REQUEST_NAME
) => (
    (requestName === "message" || requestName === "plaintext") ?
      "Uint8Array" :
    (requestName === "recipeMayBeModified") ? "boolean" :
    "string"
  ) as RequestParameterNameToTypeName<REQUEST_NAME>;
  
export const requestHasPackagedSealedMessageParameter = (request: Request): request is RequestWithPackagedSealedMessageParameter =>
  request.command === Command.unsealWithSymmetricKey || request.command === Command.unsealWithUnsealingKey;

export const requestHasRecipeParameter = (request: Request): request is RequestWithRecipeParameter =>
  !requestHasPackagedSealedMessageParameter(request);

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

export type ApiCallsThatTakeRecipeParameter = 
  GetPassword |
  GetSecret |
  GetSignatureVerificationKey |
  GetSigningKey |
  GetSealingKey |
  GetUnsealingKey |
  GetSymmetricKey |
  SealWithSymmetricKey |
  GenerateSignature;

export type ApiCallsWithNoRecipeParameter =  
    UnsealWithSymmetricKey |
    UnsealWithUnsealingKey;


export type ApiCall =
  ApiCallsThatTakeRecipeParameter |
  ApiCallsWithNoRecipeParameter;





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


export interface RequestMetadata extends RequestCommand<any> {
  requestId: string,
}
export const RequestMetadataParameterNames = toFieldNameMap<RequestMetadata>(
  "requestId", "command"
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

export interface ExceptionParameters {
  exception: string;
  message?: string | undefined;
  stack?: string | undefined;
}
export const ExceptionParameterNames = toFieldNameMap<ExceptionParameters>(
  "exception",
  "message",
  "stack"
);

export interface ExceptionResponse extends ExceptionParameters, ResponseMetadata {
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