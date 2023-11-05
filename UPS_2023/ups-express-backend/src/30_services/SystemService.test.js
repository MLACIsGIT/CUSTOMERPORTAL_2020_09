import SystemService from './SystemService';

test('getHelloWorld', async () => {
  const result = await SystemService.generateHelloWorld();

  expect(result.message).toEqual('Hello World!');
});
