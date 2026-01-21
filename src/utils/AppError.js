class AppError extends Error {
  constructor(message, code = null, errors=null ) {
    super(message);
    this.statusCode = code;
    this.errors=errors 
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
