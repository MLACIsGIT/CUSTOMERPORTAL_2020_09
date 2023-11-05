import logger from '@selesterkft/express-logger';
import app from './app';

const port = process.env.PORT || 4000;

app.listen(port, () => {
  logger.info(`App is listening on ${port}. Node env: ${process.env.NODE_ENV}.`);
});
