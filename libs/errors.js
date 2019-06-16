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

class TokenVerificationError extends BaseError {}

export {
  PublicKeyNotFoundError,
  TokenExpiredError,
  TokenNotIssuedError,
  TokenVerificationError,
  AuthenticationError,
};
