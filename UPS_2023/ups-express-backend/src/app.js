import express from 'express';
import logger from '@selesterkft/express-logger';
import cors from 'cors';
import passport from 'passport';

import errorHandler from './utils/errorHandler';
import bearerStrategy from './auth/bearerStrategy';
// import authenticate from './auth/authenticate';
import { apiRouter, systemRouter } from './10_routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger.middleware());

app.use(passport.initialize());
passport.use(bearerStrategy);

app.use('/api', apiRouter);
app.use('/system', systemRouter);

app.use(errorHandler);

export default app;
