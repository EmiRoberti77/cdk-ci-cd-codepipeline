import { handler } from '../src/lambdas/task1Lambda/handler';

describe('ci/cd test suite', () => {
  test('task1lambda handler', async () => {
    const result = await handler({}, {});
    expect(result.statusCode).toBe(200);
  });
});
