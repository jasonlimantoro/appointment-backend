import * as handler from '../handler';

test('hello', async () => {
  const event = 'event';
  const context = 'context';
  await handler.hello(event, context, (error, response) => {
    expect(response.statusCode).toEqual(200);
    expect(typeof response.body).toBe("string");
  });
});
