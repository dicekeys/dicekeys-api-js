import * as ApiCalls from "./api-calls";
import {
  randomBytes
} from "crypto";


/**
 * Generate random request IDs for API calls to distinguish
 * between different requests.
 */
export const generateRequestId = (): string => {
  var requestIdBytes: Uint8Array;
  if (global.window && window.crypto) {
    requestIdBytes = new Uint8Array(20);
    crypto.getRandomValues(requestIdBytes);
  } else {
    requestIdBytes = randomBytes(20);
  }
  return [...requestIdBytes].map( byte => byte.toString(16) ).join("");
}

/**
 * An API requst object is just a set of parameters with the function (command)
 * name attached.  This function adds the commands to the parameters to create
 * a request that can be sent over the wire.
 * 
 * @param command The API call name.
 * @param parameters The parameters to that API call.
 */
export const addCommandNameToParameterObject = <METHOD extends ApiCalls.ApiCall>(
  command: ApiCalls.ApiCommand<METHOD>,
  parameters: ApiCalls.ApiCallParameters<METHOD>
): ApiCalls.ApiRequestObject<METHOD> => ({
  ...parameters,
  command
} as ApiCalls.ApiRequestObject<METHOD>);

export interface ApiClientImplementation{
  <METHOD extends ApiCalls.ApiCall>(
    request: ApiCalls.ApiRequestObject<METHOD>
  ): Promise<ApiCalls.ApiCallResult<METHOD>>
}

/**
 * This factory creates an API call from the name of the API command
 * and a generic function for sending API requests and handling the
 * responses.
 * 
 * @param command The API call name.
 * @param client An API client function that implements generic marshalling
 * of the request object and response object and sends the call
 */
export const apiCallFactory = <METHOD extends ApiCalls.ApiCall>(
  command: ApiCalls.ApiCommand<METHOD>,
  client: ApiClientImplementation
) => (
    parameters: ApiCalls.ApiCallParameters<METHOD>
  ) =>
    client<METHOD>(addCommandNameToParameterObject(command, parameters));
