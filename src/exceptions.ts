export class ClientNotAuthorizedException extends Error {}

export class UserDeclinedToAuthorizeOperation extends Error {}


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

export const restoreException = (name: string, message?: string): Error => {
  if (name === ClientNotAuthorizedException.name) {
    return new ClientNotAuthorizedException(message)    
  } else if (name === InvalidDerivationOptionsTypeFieldException.name) {
    return new InvalidDerivationOptionsTypeFieldException(message);
  } else if (name === UserCancelledLoadingDiceKey.name) {
    return new UserCancelledLoadingDiceKey(message);
  } else if (name === UserDeclinedToAuthorizeOperation.name) {
    return new UserDeclinedToAuthorizeOperation(message);
  } else if (name === MissingParameter.name) {
    return new MissingParameter(message);
  } else {
    return new UnknownException(name, message);
  }
}

