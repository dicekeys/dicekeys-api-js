import {
  // API function factories
  apiCallFactory
} from "./api-factory"
import {
  postMessageApiCallFactory
} from "./post-message-api-factory";
import {
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
  UnsealWithUnsealingKey
 } from "./api-calls";

const callPostMessageApi = postMessageApiCallFactory();

/**
  * Sign a [[message]] using a public/private signing key pair derived
  * from the user's DiceKey and the derivation options specified in
  * JSON format via [[derivationOptionsJson]].
*/
export const generateSignature = apiCallFactory<GenerateSignature>("generateSignature", callPostMessageApi);
export const getSealingKey = apiCallFactory<GetSealingKey>("getSealingKey", callPostMessageApi);
export const getSecret = apiCallFactory<GetSecret>("getSecret", callPostMessageApi);
export const getPassword = apiCallFactory<GetPassword>("getPassword", callPostMessageApi);
export const getSignatureVerificationKey = apiCallFactory<GetSignatureVerificationKey>("getSignatureVerificationKey", callPostMessageApi);
export const getSigningKey = apiCallFactory<GetSigningKey>("getSigningKey", callPostMessageApi);
export const getSymmetricKey = apiCallFactory<GetSymmetricKey>("getSymmetricKey", callPostMessageApi);
export const getUnsealingKey = apiCallFactory<GetUnsealingKey>("getUnsealingKey", callPostMessageApi);
export const sealWithSymmetricKey = apiCallFactory<SealWithSymmetricKey>("sealWithSymmetricKey", callPostMessageApi);
export const unsealWithSymmetricKey = apiCallFactory<UnsealWithSymmetricKey>("unsealWithSymmetricKey", callPostMessageApi);
export const unsealWithUnsealingKey = apiCallFactory<UnsealWithUnsealingKey>("unsealWithUnsealingKey", callPostMessageApi);

