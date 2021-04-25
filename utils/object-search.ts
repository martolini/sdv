export const findPaths = (
  rootObject,
  searchValue,
  { searchKeys = typeof searchValue === 'string', rootMaxDepth = 20 } = {}
) => {
  const paths = [];
  const notObject = typeof searchValue !== 'object';
  const gvpio = (obj, maxDepth, prefix) => {
    if (!maxDepth) return;

    Object.entries(obj).forEach(([curr, currElem]) => {
      if (searchKeys && curr === searchValue) {
        // To search for property name too ...
        paths.push(prefix + curr);
      }

      if (typeof currElem === 'object') {
        // object is "object" and "array" is also in the eyes of "typeof"
        // search again :D
        gvpio(currElem, maxDepth - 1, `${prefix + curr}/`);
        if (notObject) {
          return;
        }
      }
      // it's something else... probably the value we are looking for
      // compares with "searchValue"
      if (currElem === searchValue) {
        // return index AND/OR property name
        paths.push(prefix + curr);
      }
    });
  };
  gvpio(rootObject, rootMaxDepth, '');
  return paths;
};

export const findObjects = (rootObject, searchValue, offset: number = null) =>
  findPaths(rootObject, searchValue).map((path) => {
    let objectPath = path.split('/');
    if (offset) {
      objectPath = objectPath.slice(0, -offset);
    }
    return objectPath.reduce((p, c) => p[c], rootObject);
  });
