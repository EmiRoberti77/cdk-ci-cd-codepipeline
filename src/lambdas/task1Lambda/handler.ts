import { APIGatewayProxyEvent, APIGatewayProxyResultV2 } from 'aws-lambda';

export const handler = async (
  event: APIGatewayProxyEvent,
  context: any
): Promise<APIGatewayProxyResultV2> => {
  const message = 'lambda run successfully';
  console.log(message);
  return {
    statusCode: 200,
    body: JSON.stringify({
      message,
      timeStamp: new Date().toISOString(),
    }),
  };
};
