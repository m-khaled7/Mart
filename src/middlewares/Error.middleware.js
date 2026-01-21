export default (err, req, res, next) => {

  if (!err.isOperational) {
    console.error(err);
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    errors:  err.errors || null,
  });

}