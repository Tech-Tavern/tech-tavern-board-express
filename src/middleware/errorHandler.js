export function notFound(req, res, next) {
  const err = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(err);
}

export function errorHandler(err, req, res, next) {
  const status = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(status);
  res.json({
    message: err.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}
