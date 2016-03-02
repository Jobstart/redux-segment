function getAliasProperties(fields) {
  if (!fields.previousId) return [ 'userId', 'options' ];

  return [ 'userId', 'previousId', 'options' ];
}

function validateAliasFields(fields) {
  if (!fields.userId) return new Error('missing userId field for EventTypes.alias');

  return null;
}

function extractFields(obj, keys) {
  return keys.map(key => obj[key]);
}

function extractAliasFields(fields) {
  const props = getAliasProperties(fields);

  const err = validateAliasFields(fields);
  if (err) throw err;

  return extractFields(fields, props);
}


export {
  extractAliasFields,
};
