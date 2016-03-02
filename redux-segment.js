(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.reduxSegment = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
function getAliasProperties(fields) {
  if (!fields.previousId) return ['userId', 'options'];

  return ['userId', 'previousId', 'options'];
}

function validateAliasFields(fields) {
  if (!fields.userId) return new Error('missing userId field for EventTypes.alias');

  return null;
}

function extractFields(obj, keys) {
  return keys.map(function (key) {
    return obj[key];
  });
}

function extractAliasFields(fields) {
  var props = getAliasProperties(fields);

  var err = validateAliasFields(fields);
  if (err) throw err;

  return extractFields(fields, props);
}

exports.extractAliasFields = extractAliasFields;

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
function getGroupProperties() {
  return ['groupId', 'traits', 'options'];
}

function validateGroupFields(fields) {
  if (!fields.groupId) return new Error('missing groupId field for EventTypes.alias');

  return null;
}

function extractFields(obj, keys) {
  return keys.map(function (key) {
    return key === 'traits' ? obj[key] || {} : obj[key];
  });
}

function extractGroupFields(fields) {
  var props = getGroupProperties(fields);

  var err = validateGroupFields(fields);
  if (err) throw err;

  return extractFields(fields, props);
}

exports.extractGroupFields = extractGroupFields;

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
function getIdentifyProperties(fields) {
  if (!fields.userId) return ['traits', 'options'];

  return ['userId', 'traits', 'options'];
}

function extractFields(obj, keys) {
  return keys.map(function (key) {
    return key === 'traits' ? obj[key] || {} : obj[key];
  });
}

function extractIdentifyFields(fields) {
  // all fields are optional for identify events
  if (!fields) {
    return [];
  }

  var props = getIdentifyProperties(fields);

  return extractFields(fields, props);
}

exports.extractIdentifyFields = extractIdentifyFields;

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
function validatePageFields(fields) {
  if (fields.category && !fields.name) {
    return new Error('missing name field for EventTypes.page');
  }

  return null;
}

function getPageProperties(fields) {
  if (fields.category) return ['category', 'name', 'properties', 'options'];
  if (!fields.name) return ['properties', 'options'];

  return ['name', 'properties', 'options'];
}

function extractFields(obj, keys) {
  return keys.map(function (key) {
    return key === 'properties' ? obj[key] || {} : obj[key];
  });
}

function extractPageFields(fields) {
  // all fields are optional for page events
  if (!fields) {
    return [];
  }

  var err = validatePageFields(fields);
  if (err) throw err;

  var props = getPageProperties(fields);

  return extractFields(fields, props);
}

exports.extractPageFields = extractPageFields;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
function validateTrackFields(fields, actionType) {
  if (typeof actionType !== 'string' && !fields.event) {
    return new Error('missing event field for EventTypes.track');
  }

  return null;
}

function getTrackProperties(fields) {
  if (!fields.properties) return ['event', 'options'];

  return ['event', 'properties', 'options'];
}

function extractFields(obj, keys, actionType) {
  return keys.map(function (key) {
    return key === 'event' ? obj[key] || actionType : obj[key];
  });
}

function extractTrackFields(fields, actionType) {
  var props = getTrackProperties(fields);

  var err = validateTrackFields(fields, actionType);
  if (err) throw err;

  return extractFields(fields, props, actionType);
}

exports.extractTrackFields = extractTrackFields;

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var EventTypes = {
  identify: 'identify',
  page: 'page',
  track: 'track',
  alias: 'alias',
  group: 'group'
};

exports['default'] = EventTypes;
module.exports = exports['default'];

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _eventTypes = require('./event/types');

var _eventTypes2 = _interopRequireDefault(_eventTypes);

var _eventIdentify = require('./event/identify');

var _eventPage = require('./event/page');

var _eventTrack = require('./event/track');

var _eventAlias = require('./event/alias');

var _eventGroup = require('./event/group');

function emit(type, fields) {
  var _window$analytics;

  window.analytics && (_window$analytics = window.analytics)[type].apply(_window$analytics, fields);
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

  var typeFieldHandlers = (_typeFieldHandlers = {}, _defineProperty(_typeFieldHandlers, _eventTypes2['default'].identify, _eventIdentify.extractIdentifyFields), _defineProperty(_typeFieldHandlers, _eventTypes2['default'].page, _eventPage.extractPageFields), _defineProperty(_typeFieldHandlers, _eventTypes2['default'].track, function (eventFields) {
    return (0, _eventTrack.extractTrackFields)(eventFields, actionType);
  }), _defineProperty(_typeFieldHandlers, _eventTypes2['default'].alias, _eventAlias.extractAliasFields), _defineProperty(_typeFieldHandlers, _eventTypes2['default'].group, _eventGroup.extractGroupFields), _typeFieldHandlers);

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
      emit(_eventTypes2['default'].page);
      break;
    default:
  }

  return next(action);
}

exports.createTracker = createTracker;
exports.EventTypes = _eventTypes2['default'];

},{"./event/alias":1,"./event/group":2,"./event/identify":3,"./event/page":4,"./event/track":5,"./event/types":6}]},{},[7])(7)
});