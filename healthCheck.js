import connectToDb from './database';

const handler = async () => {
  await connectToDb();
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'connection to Amazon Aurora successful',
    }),
  };
};

export { handler };
