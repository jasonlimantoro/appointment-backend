import faker from 'faker';

import path from 'path';
import models from '../../database/models';
import entryFactory from './entry';

/**
 * Temporary fix because it is not yet implemented
 */
faker.system.directoryPath = () =>
  path.format({
    base: faker
      .fake('{{random.words}}')
      .replace(/ /g, path.sep)
      .toLowerCase(),
  });

/**
 * Temporary fix becuase it is not yet implemented
 */
faker.system.filePath = () =>
  faker.system.directoryPath() + path.sep + faker.system.fileName();

const data = async (props = {}) => {
  const defaultProps = {
    id: faker.random.uuid(),
    key: faker.system.filePath(),
    entryId: !props.entryId
      ? (await entryFactory()).getDataValue('id')
      : faker.random.uuid(),
  };
  return Object.assign({}, defaultProps, props);
};

export default async (props = {}, options = {}, num = 1) => {
  const filled = await Promise.all(
    Array.from({ length: num }, () => data(props, options)),
  );
  const res = await models.photo.bulkCreate(filled);
  if (num === 1) return res[0];
  return res;
};
