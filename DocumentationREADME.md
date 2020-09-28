# DiceKeys API

This package contains the [DiceKeys app](https://dicekeys.app/)'s Application Programming Interface (API),
for use by websites and browser-based via the browser's PostMessage interface.

Your app can use this API to ask the user to user their DiceKey to:

  - Derive a password or secret from the user's DiceKey
  - Derive a cryptographic key from the user's DiceKey
  - Unseal (decrypt and authenticate) secrets encrypted with
    keys derived from the user's DiceKey
  - Sign messages with a signing key derived from the user's
    Dicekey