export default class ModelService {
  constructor({ tableName, dataSource } = {}) {
    this.dataSource = dataSource;
    this.tableName = tableName;
  }

  put = ({ Item, ...rest }) => this.dataSource
    .put({ TableName: this.tableName, Item, ...rest })
    .promise()
    .then(() => Item);

  get = ({ key, ...rest }) => this.dataSource
    .get({ TableName: this.tableName, Key: key, ...rest })
    .promise()
    .then(r => r.Item);

  list = ({ ...rest }) => this.dataSource
    .scan({
      TableName: this.tableName,
      ...rest,
    })
    .promise()
    .then(r => r);

  update = ({ key, ...rest }) => this.dataSource
    .update({ TableName: this.tableName, Key: key, ...rest })
    .promise()
    .then(r => r.Attributes);

  where = ({ ...rest }) => this.dataSource
    .query({
      TableName: this.tableName,
      ...rest,
    })
    .promise()
    .then(r => r);
}
