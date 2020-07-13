export class ClientNotAuthorizedException extends Error {}

export class UserDeclinedToAuthorizeOperation extends Error {}

export class ClientMayRetrieveKeyNotSetInDerivationOptions extends ClientNotAuthorizedException {}

export class InvalidDerivationOptionsTypeFieldException extends Error {
  static create(
    typeRequiredByOperation: string,
    typeSpecifiedInDerivationOptions: string
  ) {
    return new InvalidDerivationOptionsTypeFieldException(`Operation for type ${typeRequiredByOperation} cannot use derivation options with type ${typeSpecifiedInDerivationOptions}.`);
  }
}

export class MissingParameter extends Error {
static create(missingParameterName: string) {
    return new MissingParameter(`This operation requires the parameter '${missingParameterName}'.`);
  }
}

export class MissingResponseParameter extends Error {
  static create(missingParameterName: string) {
    return new MissingParameter(`Expected but did not receive response parameter '${missingParameterName}'.`);
  }
}

export class WordListNotFound extends Error {
  static create(wordListName: string) {
    return new WordListNotFound(`Could not generate password using the following word list as it could not be found '${wordListName}'.`);
  }
}

export class UnknownException extends Error {
  constructor(
    public readonly exceptionName: string,
    public readonly marshalledMessage?: string
  ) {
    super(`Unknown exception of type ${exceptionName} and message "${marshalledMessage}"`);
  }
}

export class UserCancelledLoadingDiceKey extends Error {
  static create(message: string = `This operation requires a DiceKey and the user declined or cancelled the scanning operation.`) {
    new UserCancelledLoadingDiceKey(message)
  }
}

export class InvalidCommand extends Error {
  static create(message: string = `Invalid API Command`) {
    new InvalidCommand(message)
  }
}

const Exceptions = [
  ClientNotAuthorizedException,
  ClientMayRetrieveKeyNotSetInDerivationOptions,
  InvalidDerivationOptionsTypeFieldException,
  UserCancelledLoadingDiceKey,
  UserDeclinedToAuthorizeOperation,
  MissingParameter,
  MissingResponseParameter,
  WordListNotFound,
  InvalidCommand
];

/**
 * Restore a serialized exception from it's name and message.
 * @param name The exception name
 * @param message The exception's message.
 */
export const restoreException = (name: string, message?: string, stack?: string): Error => {
  // Search known exceptions
  for (const exception of Exceptions) {
    if (exception.name === name) {
      // The exception's name matches a known exception.
      // Re-constitute it.
      const e = new exception(message);
      e.stack = stack;
      return e;
    }
  }
  // The exception is not among the list of known exceptions, so
  // generate an UnknwonException.
  const e = new UnknownException(name, message);
  e.stack = stack;
  return e;
}

