export const transformObjectKeysToLower = obj => {
  const result = {};
  for (const key in obj) {
    const value = obj[key];
    if (Array.isArray(value)) {
      const transformedArray = [];
      for (let i = 0; i < value.length; i++) {
        const item = value[i];
        if (typeof item === 'object') {
          transformedArray.push(transformObjectKeysToLower(item));
        } else {
          transformedArray.push(item);
        }
      }
      result[key.toLowerCase()] = transformedArray;
    } else if (typeof value === 'object') {
      result[key.toLowerCase()] = transformObjectKeysToLower(value);
    } else {
      result[key.toLowerCase()] = value;
    }
  }
  return result;
};

export const encryptBase64 = str => Buffer.from(str).toString('base64');

export const decryptBase64 = base64 => Buffer.from(base64, 'base64').toString('ascii');
