import * as ApiCalls from "./api-calls";


/**
 * Generate random request IDs for API calls to distinguish
 * between different requests.
 */
export const generateRequestId = (): string => {
  var requestIdBytes: Uint8Array;
  if (typeof window !== "undefined" && window.crypto) {
    requestIdBytes = new Uint8Array(20);
    crypto.getRandomValues(requestIdBytes);
  } else {
    throw "Need to mock window.crypto.getRandomValues()";
  }
  return [...requestIdBytes].map( byte => byte.toString(16) ).join("");
}

/**
 * An API request object is just a set of parameters with the function (command)
 * name attached.  This function adds the commands to the parameters to create
 * a request that can be sent over the wire.
 * 
 * @param command The API call name.
 * @param parameters The parameters to that API call.
 */
export const addCommandNameToParameterObject = <METHOD extends ApiCalls.ApiCall>(
  command: METHOD["request"]["command"],
  parameters: METHOD["parameters"]
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
  command: METHOD["request"]["command"],
  client: ApiClientImplementation
) => (
    parameters: METHOD["parameters"]
  ): Promise<METHOD["result"]> =>
    client<METHOD>(addCommandNameToParameterObject(command, parameters));
