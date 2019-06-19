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
