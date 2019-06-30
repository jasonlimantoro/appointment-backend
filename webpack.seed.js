const path = require('path');

module.exports = {
  entry: {
    guests: './fixtures/guests.js',
    entries: './fixtures/entries.js',
  },
  output: {
    path: path.resolve(__dirname, 'fixtures/out/'),
    libraryTarget: 'commonjs2',
    libraryExport: 'default',
  },
  mode: 'development',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
        include: __dirname,
        exclude: /node_modules/,
      },
    ],
  },
};
