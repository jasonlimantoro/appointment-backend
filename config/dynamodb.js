import AWS from 'aws-sdk';

const dbClient = new AWS.DynamoDB.DocumentClient(
  process.env.IS_OFFLINE ? { region: 'localhost', endpoint: 'http://localhost:8000' } : {},
);

export default dbClient;
