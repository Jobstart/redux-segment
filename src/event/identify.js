function getIdentifyProperties(fields) {
  if (!fields.userId) return [ 'traits', 'options' ];

  return [ 'userId', 'traits', 'options' ];
}

function extractFields(obj, keys) {
  return keys.map(key => key === 'traits' ? obj[key] || {} : obj[key]);
}

function extractIdentifyFields(fields) {
  // all fields are optional for identify events
  if (!fields) {
    return [];
  }

  const props = getIdentifyProperties(fields);

  return extractFields(fields, props);
}


export {
  extractIdentifyFields,
};
