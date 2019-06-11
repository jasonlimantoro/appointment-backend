import { merge } from 'lodash';

const typeDefs = [];
const resolvers = {};

function loadDep(source, accum) {
  let loadedMod;
  source.keys().forEach(file => {
    loadedMod = source(file);
    if (Array.isArray(accum)) {
      accum.push(loadedMod);
    } else {
      merge(accum, loadedMod.default);
    }
  });
}

loadDep(require.context('./', true, /\.graphql$/), typeDefs);
loadDep(require.context('./', true, /resolvers\.js$/), resolvers);

export { typeDefs, resolvers };
