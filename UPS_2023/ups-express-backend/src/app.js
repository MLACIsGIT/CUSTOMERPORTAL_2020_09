import express from 'express';
import logger from '@selesterkft/express-logger';
import cors from 'cors';
import passport from 'passport';

import errorHandler from './utils/errorHandler';
import bearerStrategy from './auth/bearerStrategy';
// import authenticate from './auth/authenticate';
import { apiRouter, systemRouter } from './10_routes';

const app = express();

/*
CORS Settings
*/
// Define allowed origins
if (!process.env.CORS_ORIGIN1) {
  throw new Error('CORS_ORIGIN1 is not defined!');
}
const allowedOrigins = [process.env.CORS_ORIGIN1];
if (process.env.CORS_ORIGIN2) {
  allowedOrigins.push(process.env.CORS_ORIGIN2);
}

app.use(cors({
  origin: process.env.CORS_ORIGIN1,
  // origin(origin, callback) {
  //   // If no origin is provided (like when accessing from localhost), allow it
  //   if (!origin) return callback(null, true);

  //   if (allowedOrigins.indexOf(origin) === -1) {
  //     // If the origin isn't allowed, return an error
  //     return callback(new Error('Not allowed by CORS'), false);
  //   }
  //   // Allow the request if the origin is in the list
  //   return callback(null, true);
  // },
  // Ensure OPTIONS is included
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  // Add any other headers your frontend might send
  allowedHeaders: ['Content-Type', 'Authorization'],
  // Enable credentials if needed (e.g., cookies, authorization headers)
  credentials: true,
  // For older browsers (legacy browsers) to handle OPTIONS success response
  optionsSuccessStatus: 200,
}));

/*
Remove x-powered-by
*/
app.disable('x-powered-by');

app.use(express.json());
app.use(logger.middleware());

app.use(passport.initialize());
passport.use(bearerStrategy);

app.use('/api', apiRouter);
app.use('/system', systemRouter);

app.use(errorHandler);

export default app;
