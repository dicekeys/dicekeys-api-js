import {
  toFieldNameMap
} from "./to-name-map";
import {
  generateRequestId,
} from "./api-factory";
import * as ApiCalls from "./api-calls";
import {
  restoreException
} from "./exceptions";

const apiUrl = "https://dicekeys.app";


export interface PostMessageRequestMetadata extends ApiCalls.RequestMetadata {
  windowName: string
}
  
export const PostMessageRequestMetadataParameterNames = toFieldNameMap<PostMessageRequestMetadata>(
  "windowName"
);

/**
 * Typing for the transmit function, so that our unit testing framework
 * can substitute a custom transmitter to simulate postMessage requests.
 */
export interface PostMessageTransmitRequestFunction {
  <METHOD extends ApiCalls.ApiCall>(
    request: ApiCalls.RequestMessage<METHOD> & PostMessageRequestMetadata 
  ): Promise<ApiCalls.ApiCallResult<METHOD>>
};


/**
 * An window opened in the DiceKeys app to which we can send
 * API requests.
 * 
 * Private and internal to this module to prevent rogue code form accessing it.
 */
var diceKeysAppWindow: Window | undefined;
var resolveDiceKeysAppWindowReadyPromise: () => any | undefined;

/**
 * Map requestIds to the resolve/reject functions needed to re-start
 * resume the [[call]] function when the DiceKeys app sends the response
 * to a request.
 *
 * Private and internal to this module to prevent rogue code form accessing it.
 */
const pendingCallResolveFunctions = new Map<string, 
  {
    resolve: (response: any) => any,
    reject: (err: any) => any
}>();

/*
 * Handles calls to window.onMessage to receive responses to requests.
 */
export const handlePossibleResultMessage = (result: MessageEvent) => {
  if (result.origin.startsWith(apiUrl) && result.data === "ready") {
    resolveDiceKeysAppWindowReadyPromise?.();
    return;
  }
  const {requestId, ...response} = result.data as ApiCalls.Response;
    // FIXME -- validate origin is the Dicekeys app for good measure,
  // or treat the RequestId as an authentication key since it's strong enough?
  // Will do latter for now.
  if (requestId && pendingCallResolveFunctions.has(requestId)) {
    const resolveFn = pendingCallResolveFunctions.get(requestId)!;
    pendingCallResolveFunctions.delete(requestId);
    try {
      if ("exception" in response && typeof response.exception === "string") {
        throw restoreException(response.exception, response.message, response.stack);
      } else {
        resolveFn.resolve(response as ApiCalls.ApiCallResult<ApiCalls.ApiCall>);
      }
    } catch (e) {
      resolveFn.reject(e);
    }
  }
}
var alreadyListeningForResultMessages: boolean = false;

export const addPostMessageApiPromise = <T>(
  requestId: string
) =>
  new Promise<T>(
    (resolve, reject) =>
      pendingCallResolveFunctions.set(requestId, {resolve, reject})
  );

/**
 * Transmit requests to a window running the DiceKeys app, creating that
 * window if necessary.
 */
const transmitRequest: PostMessageTransmitRequestFunction = async <
  METHOD extends ApiCalls.ApiCall
>(
  request: ApiCalls.RequestMessage<METHOD> & PostMessageRequestMetadata
): Promise<ApiCalls.ApiCallResult<METHOD>> => {
  if (!alreadyListeningForResultMessages) {
    // Set up the listener for the response if one is not yet running
    window.addEventListener("message", (messageEvent) =>
      handlePossibleResultMessage(messageEvent)
    );
    alreadyListeningForResultMessages = true;
  }
  if (!diceKeysAppWindow || diceKeysAppWindow.closed) {
    const diceKeysAppWindowReadyPromise = new Promise<void>( (resolve) => {resolveDiceKeysAppWindowReadyPromise = resolve} )
    // Need to create a new window to send API requests to
    diceKeysAppWindow = window.open(apiUrl, "dicekeys-api-window") ?? undefined;
    await diceKeysAppWindowReadyPromise!
  }
  // We'll use a promise to wait for the response, storing a resolve and
  // reject function so that the [[handlePossibleResultMessage]] function can
  // find them by the requestId.
  const responseMessagePromise = addPostMessageApiPromise<ApiCalls.ApiCallResult<METHOD>>(request.requestId);
  diceKeysAppWindow!.postMessage(request, apiUrl);
  // We now await the response, which will arrive via a message event,
  // be processed by [[handlePossibleResultMessage]], which will
  // cause the promise to be resolved or rejected.
  return await responseMessagePromise;
}


export const postMessageApiCallFactory = (
  transmitRequestFn: PostMessageTransmitRequestFunction = transmitRequest,
) => async <METHOD extends ApiCalls.ApiCall>(
  request: ApiCalls.ApiRequestObject<METHOD>,
) : Promise<ApiCalls.ApiCallResult<METHOD>> => {
  if (!window.name || window.name === "view") {
    // This window needs a name so that the window we're calling can
    // refer to it by name.
    window.name = generateRequestId();
  }

  // Generate a random request ID, which will be returned with the response,
  // so that we will know that response is for this request.
  const requestId = generateRequestId();
  // Build a request as an object matching parameter names to
  // parameters, which can either be strings or byte arrays.
  const windowName = window.name;
  const metaParameters = {
    command: request.command, // this line not necessary, but keeps TypeScript happy
    requestId,
    windowName,
  } as PostMessageRequestMetadata;
  const requestObject: ApiCalls.RequestMessage<METHOD> & PostMessageRequestMetadata = {
    ...request,
    ...metaParameters,
  };
  // We'll now transmit the request.  We use a transmitRequest function which
  // is set by the constructor to facilitate testing.  In production, all
  // that does is call the [[defaultTransmitRequest]], which creates a window
  // for the DiceKey app if necessary and sends a postMessage to the app.
  return await transmitRequestFn(requestObject);
}
