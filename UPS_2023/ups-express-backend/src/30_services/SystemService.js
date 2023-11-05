export default class SystemService {
  static async generateHelloWorld() {
    return {
      message: 'Hello World!',
    };
  }

  static async generateHeartbeat() {
    return {
      db: true,
    };
  }
}
