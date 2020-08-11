# [DiceKeys](https://dicekeys.com/) PostMessage Api

This package contains the [DiceKeys app](https://dicekeys.app/)'s Application Programming Interface (API),
for use by websites and browser-based via the browser's PostMessage interface.

Your app can use this API to ask the user to user their DiceKey to:

  - Derive a password or secret from the user's DiceKey
  - Derive a cryptographic key from the user's DiceKey
  - Unseal (decrypt and authenticate) secrets encrypted with
    keys derived from the user's DiceKey
  - Sign messages with a signing key derived from the user's
    Dicekey

```ts
import {
  DerivationOptions,
  getPassword
} from "@dicekeys/dicekeys-api-js"

// See https://dicekeys.github.io/seeded-crypto/derivation_options_format.html
const derivationOptionsJson = JSON.stringify(DerivationOptions({
  type: "Secret",
  mutable: true,
  wordLimit: 13,
  allow: [{"host": document.location.host}]
}));

// Call the API to request a password specific to this host
// derived from the user's DiceKey
const {password} = await getPassword({derivationOptionsJson});
```

## Installation

In your `.npmrc` file
```
@dicekeys:registry=https://npm.pkg.github.com
```

```bash
> npm install @dicekeys/dicekeys-api-js
```

## Documentation

[Generated via TypeDoc](https://dicekeys.github.io/dicekeys-api-js/)