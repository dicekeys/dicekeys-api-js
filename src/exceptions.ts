export class NamedException extends Error {
  constructor(message?: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ClientNotAuthorizedException extends NamedException {}

export class UserDeclinedToAuthorizeOperation extends NamedException {}

export class ClientMayRetrieveKeyNotSetInDerivationOptions extends ClientNotAuthorizedException {}

export class InvalidDerivationOptionsTypeFieldException extends NamedException {
  static create(
    typeRequiredByOperation: string,
    typeSpecifiedInDerivationOptions: string
  ) {
    return new InvalidDerivationOptionsTypeFieldException(`Operation for type ${typeRequiredByOperation} cannot use derivation options with type ${typeSpecifiedInDerivationOptions}.`);
  }
}

export class MissingParameter extends NamedException {
static create(missingParameterName: string) {
    return new MissingParameter(`This operation requires the parameter '${missingParameterName}'.`);
  }
}

export class MissingResponseParameter extends NamedException {
  static create(missingParameterName: string) {
    return new MissingParameter(`Expected but did not receive response parameter '${missingParameterName}'.`);
  }
}

export class WordListNotFound extends NamedException {
  static create(wordListName: string) {
    return new WordListNotFound(`Could not generate password using the following word list as it could not be found '${wordListName}'.`);
  }
}

export class UserCancelledLoadingDiceKey extends NamedException {
  static create(message: string = `This operation requires a DiceKey and the user declined or cancelled the scanning operation.`) {
    new UserCancelledLoadingDiceKey(message)
  }
}

export class InvalidCommand extends NamedException {
  static create(message: string = `Invalid API Command`) {
    new InvalidCommand(message)
  }
}

export class UnknownException extends Error {
  constructor(
    exceptionName: string,
    message?: string
  ) {
    super(message);
    this.name = exceptionName;
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
  // generate an UnknownException.
  const e = new UnknownException(name, message);
  e.stack = stack;
  return e;
}

