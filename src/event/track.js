function validateTrackFields(fields, actionType) {
  if (typeof actionType !== 'string' && !fields.event) {
    return new Error('missing event field for EventTypes.track');
  }

  return null;
}

function getTrackProperties(fields) {
  if (!fields.properties) return [ 'event', 'options' ];

  return [ 'event', 'properties', 'options' ];
}

function extractFields(obj, keys, actionType) {
  return keys.map(key => key === 'event' ? obj[key] || actionType : obj[key]);
}

function extractTrackFields(fields, actionType) {
  const props = getTrackProperties(fields);

  const err = validateTrackFields(fields, actionType);
  if (err) throw err;

  return extractFields(fields, props, actionType);
}


export {
  extractTrackFields,
};
