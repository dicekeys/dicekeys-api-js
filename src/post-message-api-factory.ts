import {
  generateRequestId,
} from "./api-factory";
import * as ApiMessages from "./api-messages";
import {
  Inputs,
  Outputs
} from "./api-strings";
import {
  restoreException
} from "./exceptions";

const apiUrl = "https://dicekeys.app";

//export type ApiMessage = MessageEvent & {data: {[name: string]: string | number | Uint8Array}};
type PostMessageRequestMessage<METHOD extends ApiMessages.ApiMethod> = {
  [Inputs.COMMON.requestId]: string,
  [Inputs.COMMON.windowName]: string
} & ApiMessages.REQUEST_OF<METHOD>;


interface MarshalledException {
  [Outputs.COMMON.exception]: string;
  [Outputs.COMMON.exceptionMessage]: string;
}

type PostMessageResponseMessage<METHOD extends ApiMessages.ApiMethod> = {
  [Outputs.COMMON.requestId]: string,
} & ( ApiMessages.RESPONSE_OF<METHOD> | MarshalledException );


/**
 * Typing for the transmit function, so that our unit testing framework
 * can substitute a custom transmitter to simulate postMessage reqeusts.
 */
export interface TransmitRequestFunction {
  <METHOD extends ApiMessages.ApiMethod>(
    request: PostMessageRequestMessage<METHOD>
  ): Promise<ApiMessages.RESPONSE_OF<METHOD>>
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
    resolve: (response: ApiMessages.ApiResponse) => any,
    reject: (err: any) => any
}>();

/*
 * Handles calls to window.onMessage to receive resposnes to requests.
 */
export const handlePossibleResultMessage = (result: MessageEvent) => {
  if (result.origin.startsWith(apiUrl) && result.data === "ready") {
    resolveDiceKeysAppWindowReadyPromise?.();
    return;
  }
  const {requestId, ...response} = result.data as PostMessageResponseMessage<ApiMessages.ApiMethod>;
    // FIXME -- validate origin is the Dicekeys app for good measure,
  // or treat the RequestId as an authentication key since it's strong enough?
  // Will do latter for now.
  if (requestId && pendingCallResolveFunctions.has(requestId)) {
    const resolveFn = pendingCallResolveFunctions.get(requestId)!;
    pendingCallResolveFunctions.delete(requestId);
    try {
      if ("exception" in response && typeof response.exception === "string") {
        throw restoreException(response.exception, response.exceptionMessage);
      } else {
        resolveFn.resolve(response as ApiMessages.RESPONSE_OF<ApiMessages.ApiMethod>);
      }
    } catch (e) {
      resolveFn.reject(e);
    }
  }
}
var liseningViaHandlePossibleResultMessage: boolean = false;


/**
 * Transmit reqeusts to a window running the DiceKeys app, creating that
 * window if necessary.
 */
const transmitRequest: TransmitRequestFunction = async <
METHOD extends ApiMessages.ApiMethod>(
  request: PostMessageRequestMessage<METHOD>
): Promise<ApiMessages.RESPONSE_OF<METHOD>> => {
  if (!liseningViaHandlePossibleResultMessage) {
    // Set up the listener for the reponse
    window.addEventListener("message", (messageEvent) =>
      handlePossibleResultMessage(messageEvent)
    );
    liseningViaHandlePossibleResultMessage = true;
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
  const responseMessagePromise =
    new Promise<ApiMessages.RESPONSE_OF<METHOD>>(
      (resolve, reject) =>
        pendingCallResolveFunctions.set(request[Inputs.COMMON.requestId] as string, {resolve, reject})
    );
  diceKeysAppWindow!.postMessage(request, apiUrl);
  // We now await the response, which will arrive via a message event,
  // be processed by [[handlePossibleResultMessage]], which will
  // cause the promise to be resolved or rejected.
  return await responseMessagePromise;
}


export const postMessageApiCallFactory = (
  transmitRequestFn: TransmitRequestFunction = transmitRequest,
) => async <METHOD extends ApiMessages.ApiMethod>(
  request: ApiMessages.REQUEST_OF<METHOD>,
) : Promise<ApiMessages.RESPONSE_OF<METHOD>> => {
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
    requestId,
    windowName,
  }
  const requestObject: PostMessageRequestMessage<METHOD> = {
    ...request,
    ...metaParameters,
  };
  // We'll now transmit the request.  We use a transmitRequest function which
  // is set by the constructor to facilitate testing.  In production, all
  // that does is call the [[defaultTransmitRequest]], which creates a window
  // for the DiceKey app if necessary and sends a postMessage to the app.
  return await transmitRequestFn(requestObject);
}
