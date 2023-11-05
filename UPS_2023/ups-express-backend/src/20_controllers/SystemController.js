import SystemService from '../30_services/SystemService';

export default class SystemController {
  static async getHelloWorld(req, res, next) {
    try {
      const data = await SystemService.generateHelloWorld();

      res.status(200).json(data);
    } catch (e) {
      next(e);
    }
  }

  static async getHeartbeat(req, res, next) {
    try {
      const data = await SystemService.generateHeartbeat();

      res.status(200).json(data);
    } catch (e) {
      next(e);
    }
  }
}
