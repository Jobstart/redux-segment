import EventTypes from './event/types';
import { extractIdentifyFields } from './event/identify';
import { extractPageFields } from './event/page';
import { extractTrackFields } from './event/track';
import { extractAliasFields } from './event/alias';
import { extractGroupFields } from './event/group';


function emit(type, fields) {
  const f = fields || {};
  window.analytics && window.analytics[type](...f);
}

function createTracker() {
  return () =>  next => action => handleAction(next, action);
}

function handleAction(next, action) {
  if (action.meta && action.meta.analytics) return handleSpec(next, action);

  return handleActionType(next, action);
}

function getFields(type, fields, actionType) {
  const typeFieldHandlers = {
    [EventTypes.identify]: extractIdentifyFields,
    [EventTypes.page]: extractPageFields,
    [EventTypes.track]: eventFields => extractTrackFields(eventFields, actionType),
    [EventTypes.alias]: extractAliasFields,
    [EventTypes.group]: extractGroupFields,
  };

  return typeFieldHandlers[type](fields);
}

function getEventType(spec) {
  if (typeof spec === 'string') {
    return spec;
  }

  return spec.eventType;
}

function handleSpec(next, action) {
  const spec = action.meta.analytics;
  const type = getEventType(spec);
  const fields = getFields(type, spec.eventPayload || {}, action.type);

  emit(type, fields);

  return next(action);
}

function handleActionType(next, action) {
  switch (action.type) {
    case '@@router/INIT_PATH':
    case '@@router/UPDATE_PATH':
    case '@@router/UPDATE_LOCATION':
    case '@@router/CALL_HISTORY_LOCATION':
    case '@@reduxReactRouter/initRoutes':
    case '@@reduxReactRouter/routerDidChange':
    case '@@reduxReactRouter/replaceRoutes':
      emit(EventTypes.page);
      break;
    default:
  }

  return next(action);
}


export {
  createTracker,
  EventTypes,
};
