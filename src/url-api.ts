import {
  apiCallFactory, generateRequestId
} from "./api-factory"
import * as Exceptions from "./exceptions";
import {
  Recipe
} from "./dicekeys-recipe";
import {
  toFieldNameMap, toNameMap
} from "./to-name-map"
import {
  urlSafeBase64Decode,
  urlSafeBase64Encode
} from "./encodings";

import {
  Command,
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
  RequestMetadataParameterNames,
  RequestCommandParameterNames,
  Request,
  ResultForRequest,
  RecipeFunctionParameterNames,
  GenerateSignatureParameterNames,
  SealWithSymmetricKeyParameterNames,
  UnsealWithUnsealingKeyParameterNames,
  ExceptionResponseParameterNames,
  ApiCallResult,
  GenerateSignatureSuccessResponseParameterNames,
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
  GetPasswordParameters,
  GetSeededCryptoObjectSuccessResponse,
  UnsealSuccessResponseParameterNames,
  SeededCryptoObjectResponseParameterNames
} from "./api-calls";
import { PackagedSealedMessageJson } from "./seeded-crypto-json-fields";

export interface UrlRequestMetadata {
  respondTo: string;
  authToken?: string
}

export const UrlRequestMetadataParameterNames = toFieldNameMap<UrlRequestMetadata>(
  "respondTo",
  "authToken"
);

export interface GetAuthTokenRequest {
  command: "getAuthToken"
}

export type UrlApiMetaRequests = GetAuthTokenRequest;
export type UrlApiMetaCommand = UrlApiMetaRequests["command"];

export const UrlApiMetaCommand = toNameMap<UrlApiMetaCommand>([
  "getAuthToken"
]);

export interface GetAuthTokenResponse {
  authToken: string;
}

  const GetAuthTokenResponseParameterNames = toFieldNameMap<GetAuthTokenResponse>(
  "authToken"
);


export class UrlApi {
  private pendingPromisesForRequestResponseUrls = new Map<string, (url: URL) => any>();

  constructor(
    private requestUrlString: string,
    private respondToUrl: string,
    private transmitRequest: (request: URL) => any
  ) {

  }

  private authToken?: string;
  protected getAuthToken = async (forceReload: boolean = false): Promise<string> => {
    if (forceReload || !this.authToken) {
      const requestUrl = new URL(this.requestUrlString);
      const requestId = generateRequestId();
      requestUrl.searchParams.set(RequestMetadataParameterNames.requestId, requestId);
      requestUrl.searchParams.set(UrlRequestMetadataParameterNames.respondTo, this.respondToUrl);
      requestUrl.searchParams.set(RequestCommandParameterNames.command, UrlApiMetaCommand.getAuthToken);
      return new Promise<string>( (resolve, reject) => {
        this.pendingPromisesForRequestResponseUrls.set(requestId, url => {
          const newAuthToken = url.searchParams.get(GetAuthTokenResponseParameterNames.authToken);
          if (newAuthToken != null) {
            this.authToken = newAuthToken;
            resolve(newAuthToken);        
          } else {
            reject(new Exceptions.ClientNotAuthorizedException());
          }
        });
        this.transmitRequest(requestUrl);
      })
    } else {
       return this.authToken;
    }
  }

  protected call = async <
    REQUEST extends Request>(
    request: REQUEST & Request
  ): Promise<ResultForRequest<REQUEST>> => {
    const requestUrl = new URL(this.requestUrlString);
    const marshallString = (field: string, value: string) => requestUrl.searchParams.set(field, value);
    const marshallBoolean = (field: string, value: boolean) => requestUrl.searchParams.set(field, value ? "true": "false");
    const requestId = generateRequestId();
    marshallString(RequestMetadataParameterNames.requestId, requestId);
    marshallString(UrlRequestMetadataParameterNames.respondTo, this.respondToUrl);
    marshallString(RequestCommandParameterNames.command, request.command)
    const recipe =
      "packagedSealedMessageJson" in request ?
        (JSON.parse(request.packagedSealedMessageJson) as PackagedSealedMessageJson).recipe ?? "" :
        request.recipe ?? "";
    if (typeof recipe !== "string") {
      throw new Exceptions.MissingParameter(`Missing parameter recipe`);
    }
    if ("recipe" in request && request.recipe != null) {
      marshallString(RecipeFunctionParameterNames.recipe, request.recipe)
    }
    if ("recipeMayBeModified" in request && request.recipeMayBeModified != null) {
      marshallBoolean(RecipeFunctionParameterNames.recipeMayBeModified, request.recipeMayBeModified)
    }
    const {requireAuthenticationHandshake} = Recipe(recipe);
    if (requireAuthenticationHandshake) {
      const authToken = await this.getAuthToken();
      requestUrl.searchParams.set(UrlRequestMetadataParameterNames.authToken!, authToken);
    }
    switch(request.command) {
      case Command.generateSignature:
        marshallString(GenerateSignatureParameterNames.message, urlSafeBase64Encode(request.message));
        break;
      case Command.getPassword:
      case Command.getSealingKey:
      case Command.getSecret:
      case Command.getSignatureVerificationKey:
      case Command.getSigningKey:
      case Command.getSymmetricKey:
      case Command.getUnsealingKey:
        break;
      case Command.sealWithSymmetricKey:
        marshallString(SealWithSymmetricKeyParameterNames.plaintext, urlSafeBase64Encode(request.plaintext));
        if (request.unsealingInstructions != null) {
          marshallString(SealWithSymmetricKeyParameterNames.unsealingInstructions, request.unsealingInstructions);
        }
        break;
      case Command.unsealWithSymmetricKey:
      case Command.unsealWithUnsealingKey:
        marshallString(UnsealWithUnsealingKeyParameterNames.packagedSealedMessageJson, request.packagedSealedMessageJson);
    }
    const urlPromise = new Promise<URL>( (resolve, _reject) => this.pendingPromisesForRequestResponseUrls.set(requestId, resolve));
    this.transmitRequest(requestUrl);
    const url = await urlPromise;
    const exception = url.searchParams.get(ExceptionResponseParameterNames.exception);
    if (typeof exception === "string") {
      const message = url.searchParams.get(ExceptionResponseParameterNames.message!) ?? undefined;
      const stack = url.searchParams.get(ExceptionResponseParameterNames.stack!) ?? undefined;
      throw Exceptions.restoreException(exception, message, stack);
    }

//    const fromJson = <T, U>(json: string, f: (t: T) => U) => f(JSON.parse(json) as T);
    const required = (parameterName: string): string => url.searchParams.get(parameterName) ??
      ( () => { throw new Exceptions.MissingResponseParameter(parameterName) ; })()


    switch(request.command) {
      case Command.generateSignature:
        return {
            [GenerateSignatureSuccessResponseParameterNames.signatureVerificationKeyJson]: required(GenerateSignatureSuccessResponseParameterNames.signatureVerificationKeyJson),
            [GenerateSignatureSuccessResponseParameterNames.signature]: urlSafeBase64Decode(required(GenerateSignatureSuccessResponseParameterNames.signature))            
        } as GenerateSignatureSuccessResponse;
      case Command.getPassword:
      case Command.getSealingKey:
      case Command.getSecret:
      case Command.getSigningKey:
      case Command.getSymmetricKey:
      case Command.getUnsealingKey:
      case Command.getSignatureVerificationKey:
      case Command.sealWithSymmetricKey:
        return {
          [SeededCryptoObjectResponseParameterNames[request.command]]: required(SeededCryptoObjectResponseParameterNames[request.command]),
        } as GetSeededCryptoObjectSuccessResponse<typeof request.command>
        break;
      case Command.unsealWithSymmetricKey:
        case Command.unsealWithUnsealingKey:
          return {plaintext: urlSafeBase64Decode(required(UnsealSuccessResponseParameterNames.plaintext))} as ApiCallResult<UnsealWithSymmetricKey>;
      default:
        throw new Error();
      }
  }
  
  /**
  * Sign a message using a public/private signing key pair derived
  * the user's DiceKey using the JSON-encoded [[SigningKeyRecipe]].
 * 
*/
  readonly generateSignature: (params: GenerateSignatureParameters) => Promise<GenerateSignatureSuccessResponse> =
    apiCallFactory<GenerateSignature>(Command.generateSignature, this.call);

/**
* Derive a password from the user's DiceKey and the JSON encoded
* [[PasswordRecipe]].
*/
  readonly getPassword: (params: GetPasswordParameters) => Promise<GetPasswordSuccessResponse> =
    apiCallFactory<GetPassword>(Command.getPassword, this.call);

/**
* Derive a SealingKey from the user's DiceKey and the JSON encoded
* [[UnsealingKeyRecipe]].
*/
  readonly getSealingKey: (params: GetSealingKeyParameters) => Promise<GetSealingKeySuccessResponse> =
    apiCallFactory<GetSealingKey>(Command.getSealingKey, this.call);

/**
* Derive a binary Secret from the user's DiceKey and the JSON encoded
* [[SecretRecipe]].
*/
  readonly getSecret: (params: GetSecretParameters) => Promise<GetSecretSuccessResponse> =
    apiCallFactory<GetSecret>(Command.getSecret, this.call);

/**
* Derive a SignatureVerificationKey from the user's DiceKey and the JSON encoded
* [[SigningKeyRecipe]].
*/
  readonly getSignatureVerificationKey: (params: GetSignatureVerificationKeyParameters) => Promise<GetSignatureVerificationKeySuccessResponse> =
    apiCallFactory<GetSignatureVerificationKey>(Command.getSignatureVerificationKey, this.call);

/**
* Derive a SigningKey from the user's DiceKey and the JSON encoded
* [[SigningKeyRecipe]].
*/
  readonly getSigningKey: (params: GetSigningKeyParameters) => Promise<GetSigningKeySuccessResponse> =
    apiCallFactory<GetSigningKey>(Command.getSigningKey, this.call);

/**
* Derive a SymmetricKey from the user's DiceKey and the JSON encoded
* [[SymmetricKeyRecipe]].
*/
  readonly getSymmetricKey: (params: GetSymmetricKeyParameters) => Promise<GetSymmetricKeySuccessResponse> =
    apiCallFactory<GetSymmetricKey>(Command.getSymmetricKey, this.call);

/**
* Derive an UnsealingKey from the user's DiceKey and the JSON encoded
* [[UnsealingKeyRecipe]].
*/
  readonly getUnsealingKey: (params: GetUnsealingKeyParameters) => Promise<GetUnsealingKeySuccessResponse> =
    apiCallFactory<GetUnsealingKey>(Command.getUnsealingKey, this.call);

/**
* Seal a message with a SymmetricKey derived from from the user's DiceKey and the JSON encoded
* [[SymmetricKeyRecipe]].
*/
  readonly sealWithSymmetricKey: (params: SealWithSymmetricKeyParameters) => Promise<SealWithSymmetricKeySuccessResponse> =
    apiCallFactory<SealWithSymmetricKey>(Command.sealWithSymmetricKey, this.call);

/**
* Unseal a message sealed with a SymmetricKey derived from from the user's DiceKey and the JSON encoded
* [[SymmetricKeyRecipe]].
*/
  readonly unsealWithSymmetricKey: (params: UnsealWithSymmetricKeyParameters) => Promise<UnsealWithSymmetricKeySuccessResponse> =
    apiCallFactory<UnsealWithSymmetricKey>(Command.unsealWithSymmetricKey, this.call);

/**
* Unseal a message sealed with an UnsealingKey derived from from the user's DiceKey and the JSON encoded
* [[UnsealingKeyRecipe]].
*/
  readonly unsealWithUnsealingKey: (params: UnsealWithUnsealingKeyParameters) => Promise<UnsealWithUnsealingKeySuccessResponse> =
    apiCallFactory<UnsealWithUnsealingKey>(Command.unsealWithUnsealingKey, this.call);


  /**
   * Activities and Fragments that use this API should implement onActivityResult and
   * and call handleOnActivityResult with the data/intent (third parameter) received.
   * Doing so allows this class to process results returned to the activity/fragment
   * and then call the appropriate callback functions when an API call has either
   * succeeded or failed.
   */
  handleResult = (result: URL) => {
    const requestId = result.searchParams.get(RequestMetadataParameterNames.requestId);
    if (requestId && this.pendingPromisesForRequestResponseUrls.has(requestId)) {
      const resolve = this.pendingPromisesForRequestResponseUrls.get(requestId)!;
      this.pendingPromisesForRequestResponseUrls.delete(requestId);
      resolve(result);
    }
  }

}
