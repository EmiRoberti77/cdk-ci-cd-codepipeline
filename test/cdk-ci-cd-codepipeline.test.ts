import { handler } from '../src/lambdas/task1Lambda/handler';
import { APIGatewayProxyEvent } from 'aws-lambda';
const title = 'ci/cd test suite';
const test_1 = 'task1lambda handler';

describe(title, () => {
  test(test_1, async () => {
    const mockEvent: APIGatewayProxyEvent = {
      body: '',
      headers: {},
      multiValueHeaders: {},
      httpMethod: 'GET',
      isBase64Encoded: false,
      path: '/',
      pathParameters: null,
      queryStringParameters: null,
      multiValueQueryStringParameters: null,
      stageVariables: null,
      resource: '/',
      requestContext: {
        accountId: '',
        apiId: '',
        authorizer: undefined,
        httpMethod: 'GET',
        identity: {
          accessKey: null,
          accountId: null,
          apiKey: null,
          apiKeyId: null,
          caller: null,
          cognitoAuthenticationProvider: null,
          cognitoAuthenticationType: null,
          cognitoIdentityId: null,
          cognitoIdentityPoolId: null,
          principalOrgId: null,
          sourceIp: '',
          user: null,
          userAgent: '',
          userArn: null,
          clientCert: null,
        },
        path: '/',
        protocol: 'HTTP/1.1',
        stage: 'dev',
        requestId: '',
        requestTimeEpoch: 0,
        resourceId: '',
        resourcePath: '/',
      },
    };

    const mockContext = {};

    const result = await handler(mockEvent, mockContext);
    expect(result.statusCode).toBe(200);
  });
});
