/**
 * @jest-environment jsdom
 */
import {base64DecToArr, base64EncArr} from "./base64"
  
export const urlSafeBase64Encode = (unencoded: Uint8Array) =>
  base64EncArr(unencoded)
  .replace(/=/g, "")
  .replace(/\+/g, "-")
  .replace(/\//g, "_");
  //  .replace('+', '-').replace('/', '_').replace(/=+$/, '');

export const urlSafeBase64Decode  = (encoded: string) => {
  encoded = encoded
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  while (encoded.length % 4)
    encoded += '=';
  return base64DecToArr(encoded);
};
