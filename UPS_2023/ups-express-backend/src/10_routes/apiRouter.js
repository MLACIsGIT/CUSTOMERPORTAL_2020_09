import express from 'express';
import DataController from '../20_controllers/DataController';
import SystemController from '../20_controllers/SystemController';
import authenticate from '../auth/authenticate';

const apiRouter = express.Router();
apiRouter.post('/seldata', authenticate, DataController.getData);
apiRouter.get('/heartbeat', SystemController.getHeartbeat);

export default apiRouter;
