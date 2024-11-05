export default class LocalStorage {
  static loadState() {
    try {
      const serializedState = localStorage.getItem('state');
      if (serializedState === null) {
        return undefined;
      }
      return JSON.parse(serializedState);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('LocalStorage: Failed to load state!');
      return undefined;
    }
  }

  static saveState(state) {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem('state', serializedState);
    } catch {
      // eslint-disable-next-line no-console
      console.error('LocalStorage: Failed to save state!');
    }
  }
}
