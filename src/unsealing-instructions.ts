import {
    AuthenticationRequirements
} from "./dicekeys-derivation-options";

// export interface RequestForUsersConsent {
//     question: string,
//     actionButtonLabels: {
//       allow: string,
//       decline: string
//     }
// }

// export enum UsersConsentResponse {
//   Allow = "Allow",
//   Deny =  "Deny"
// };

/**
   * You can instruct the DiceKeys app to display a consent question to the user
   * before unsealing the message and returning it to the client app.
   * You specify the `question`, the text for the button that will `allow` the data
   * to be unsealed, and the text for the button that will `deny` the client access
   * to the unsealed data.
   * The language of the warning is chosen by the sealer of the message, which should use
   * it's best knowledge about the language of the user at the time of sealing.

   requireUsersConsent?: RequestForUsersConsent,

 */

export interface UnsealingInstructions extends AuthenticationRequirements {
}

export const UnsealingInstructions = (
  unsealingInstructionsAsObjectOrJson?: string | UnsealingInstructions
): UnsealingInstructions => 
  (typeof unsealingInstructionsAsObjectOrJson === "object") ?
    unsealingInstructionsAsObjectOrJson :
    JSON.parse(unsealingInstructionsAsObjectOrJson || "{}") as UnsealingInstructions
