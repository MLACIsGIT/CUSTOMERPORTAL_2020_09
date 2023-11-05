import logger from '@selesterkft/express-logger';

// eslint-disable-next-line no-unused-vars
export default function errorHandler(err, req, res, next) {
  logger.error(
    `${err.httpCode || 500} - ${err.message} - ${req.originalUrl} - ${
      req.method
    } - ${req.ip}`,
  );
  res.status(err.httpCode || 500);
  const logEnv = req.app.get('env');
  res.json({
    message:
      logEnv === 'development' || logEnv === 'test'
        ? err.message
        : 'Unknown error happened.',
  });
}
