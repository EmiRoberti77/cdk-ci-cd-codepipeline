export const handler = async (event: any, context: any): Promise<any> => {
  const message = 'lambda run successfully';
  console.log(message);
  return {
    statusCode: 200,
    body: message,
  };
};
