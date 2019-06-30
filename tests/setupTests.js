require('jest-chain');
require('../libs/seeder');

process.env.guestsTable = 'dev-guests';
process.env.entriesTable = 'dev-entries';
process.env.sessionsTable = 'dev-sessions';
process.env.photosTable = 'dev-photos';
process.env.dynamoDBEndPoint = 'http://localhost:8000';
