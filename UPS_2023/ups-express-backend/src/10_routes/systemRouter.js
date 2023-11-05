import express from 'express';
import SystemController from '../20_controllers/SystemController';

const systemRouter = express.Router();

systemRouter.get('/heartbeat', SystemController.getHeartbeat);
systemRouter.get('/hello', SystemController.getHelloWorld);

export default systemRouter;
