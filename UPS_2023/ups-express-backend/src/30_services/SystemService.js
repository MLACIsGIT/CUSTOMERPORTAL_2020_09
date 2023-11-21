import ping from '../40_db/storedProcedures/ping';

export default class SystemService {
  static async generateHelloWorld() {
    return {
      message: 'Hello World!',
    };
  }

  static async generateHeartbeat() {
    const response = await ping();

    return response;
  }
}
