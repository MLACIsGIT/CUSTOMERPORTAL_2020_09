import express from 'express';
import DataController from '../20_controllers/DataController';

const apiRouter = express.Router();

apiRouter.post('/seldata', DataController.getData);

export default apiRouter;
