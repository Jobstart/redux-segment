'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventTypes = exports.createTracker = undefined;

var _types = require('./event/types');

var _types2 = _interopRequireDefault(_types);

var _identify = require('./event/identify');

var _page = require('./event/page');

var _track = require('./event/track');

var _alias = require('./event/alias');

var _group = require('./event/group');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function emit(type, fields) {
  var _window$analytics;

  var f = fields || {};
  window.analytics && (_window$analytics = window.analytics)[type].apply(_window$analytics, _toConsumableArray(f));
}

function createTracker() {
  return function () {
    return function (next) {
      return function (action) {
        return handleAction(next, action);
      };
    };
  };
}

function handleAction(next, action) {
  if (action.meta && action.meta.analytics) return handleSpec(next, action);

  return handleActionType(next, action);
}

function getFields(type, fields, actionType) {
  var _typeFieldHandlers;

  var typeFieldHandlers = (_typeFieldHandlers = {}, _defineProperty(_typeFieldHandlers, _types2.default.identify, _identify.extractIdentifyFields), _defineProperty(_typeFieldHandlers, _types2.default.page, _page.extractPageFields), _defineProperty(_typeFieldHandlers, _types2.default.track, function (eventFields) {
    return (0, _track.extractTrackFields)(eventFields, actionType);
  }), _defineProperty(_typeFieldHandlers, _types2.default.alias, _alias.extractAliasFields), _defineProperty(_typeFieldHandlers, _types2.default.group, _group.extractGroupFields), _typeFieldHandlers);

  return typeFieldHandlers[type](fields);
}

function getEventType(spec) {
  if (typeof spec === 'string') {
    return spec;
  }

  return spec.eventType;
}

function handleSpec(next, action) {
  var spec = action.meta.analytics;
  var type = getEventType(spec);
  var fields = getFields(type, spec.eventPayload || {}, action.type);

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
      emit(_types2.default.page);
      break;
    default:
  }

  return next(action);
}

exports.createTracker = createTracker;
exports.EventTypes = _types2.default;