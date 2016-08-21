'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _RestCursor = require('./RestCursor');

var _RestCursor2 = _interopRequireDefault(_RestCursor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

class RestService {
  constructor(restResources) {
    if (!(restResources instanceof Map)) {
      throw new TypeError('Value of argument "restResources" violates contract.\n\nExpected:\nMap\n\nGot:\n' + _inspect(restResources));
    }

    this.restResources = restResources;
  }

  addRestResource(key, restResource) {
    if (!(typeof key === 'string')) {
      throw new TypeError('Value of argument "key" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(key));
    }

    this.restResources.set(key, restResource);
  }

  get(key) {
    if (!(typeof key === 'string')) {
      throw new TypeError('Value of argument "key" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(key));
    }

    const restResource = this.restResources.get(key);
    if (!restResource) throw new Error(`Invalid rest resource: "${ key }"`);
    return restResource;
  }

  createCursor(restName, connectedUser, _ref) {
    var _arguments = arguments,
        _this = this;

    let criteria = _ref.criteria;
    let sort = _ref.sort;
    let limit = _ref.limit;
    return _asyncToGenerator(function* () {
      if (!(typeof restName === 'string')) {
        throw new TypeError('Value of argument "restName" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(restName));
      }

      if (!(connectedUser == null || connectedUser instanceof Object)) {
        throw new TypeError('Value of argument "connectedUser" violates contract.\n\nExpected:\n?Object\n\nGot:\n' + _inspect(connectedUser));
      }

      if (!(_arguments[2] != null && (_arguments[2].criteria == null || _arguments[2].criteria instanceof Object) && (_arguments[2].sort == null || _arguments[2].sort instanceof Object) && (_arguments[2].limit == null || typeof _arguments[2].limit === 'number'))) {
        throw new TypeError('Value of argument 2 violates contract.\n\nExpected:\n{\n  criteria: ?Object;\n  sort: ?Object;\n  limit: ?number;\n}\n\nGot:\n' + _inspect(_arguments[2]));
      }

      const restResource = _this.get(restName);
      criteria = restResource.criteria(connectedUser, criteria || {});
      sort = restResource.sort(connectedUser, sort);
      const cursor = yield restResource.store.cursor(criteria, sort);
      limit = restResource.limit(limit);
      if (limit) cursor.limit(connectedUser, limit);
      return new _RestCursor2.default(restResource, connectedUser, cursor);
    })();
  }
}
exports.default = RestService;

function _inspect(input, depth) {
  const maxDepth = 4;
  const maxKeys = 15;

  if (depth === undefined) {
    depth = 0;
  }

  depth += 1;

  if (input === null) {
    return 'null';
  } else if (input === undefined) {
    return 'void';
  } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
    return typeof input;
  } else if (Array.isArray(input)) {
    if (input.length > 0) {
      if (depth > maxDepth) return '[...]';

      const first = _inspect(input[0], depth);

      if (input.every(item => _inspect(item, depth) === first)) {
        return first.trim() + '[]';
      } else {
        return '[' + input.slice(0, maxKeys).map(item => _inspect(item, depth)).join(', ') + (input.length >= maxKeys ? ', ...' : '') + ']';
      }
    } else {
      return 'Array';
    }
  } else {
    const keys = Object.keys(input);

    if (!keys.length) {
      if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
        return input.constructor.name;
      } else {
        return 'Object';
      }
    }

    if (depth > maxDepth) return '{...}';
    const indent = '  '.repeat(depth - 1);
    let entries = keys.slice(0, maxKeys).map(key => {
      return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key], depth) + ';';
    }).join('\n  ' + indent);

    if (keys.length >= maxKeys) {
      entries += '\n  ' + indent + '...';
    }

    if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
      return input.constructor.name + ' {\n  ' + indent + entries + '\n' + indent + '}';
    } else {
      return '{\n  ' + indent + entries + '\n' + indent + '}';
    }
  }
}
//# sourceMappingURL=RestService.js.map