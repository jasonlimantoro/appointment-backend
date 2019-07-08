class BaseError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
class TokenExpiredError extends BaseError {
  constructor(message = 'Token is expired') {
    super(message);
  }
}

class TokenNotIssuedError extends BaseError {
  constructor(message = 'Token is not issued for this audience') {
    super(message);
  }
}

class PublicKeyNotFoundError extends BaseError {
  constructor(message = 'Public key not found in JWK') {
    super(message);
  }
}

class AuthenticationError extends BaseError {
  constructor(message = 'You are not authenticated') {
    super(message);
  }
}
class AuthorizationError extends BaseError {
  constructor(message = 'Forbidden access') {
    super(message);
  }
}

class InvalidArgumentError extends BaseError {
  constructor(message = 'Invalid argument') {
    super(message);
  }
}

class NotImplementedError extends BaseError {
  constructor(message = 'Must implement this method') {
    super(message);
  }
}

class LogoutError extends BaseError {
  constructor(message = 'Logout fails') {
    super(message);
  }
}

export {
  PublicKeyNotFoundError,
  TokenExpiredError,
  TokenNotIssuedError,
  AuthenticationError,
  AuthorizationError,
  LogoutError,
  InvalidArgumentError,
  NotImplementedError,
};
