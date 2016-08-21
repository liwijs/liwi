function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

import RestCursor from './RestCursor';

export default class RestService {
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

    var restResource = this.restResources.get(key);
    if (!restResource) throw new Error(`Invalid rest resource: "${ key }"`);
    return restResource;
  }

  createCursor(restName, connectedUser, _ref) {
    var _arguments = arguments,
        _this = this;

    var criteria = _ref.criteria;
    var sort = _ref.sort;
    var limit = _ref.limit;
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

      var restResource = _this.get(restName);
      criteria = restResource.criteria(connectedUser, criteria || {});
      sort = restResource.sort(connectedUser, sort);
      var cursor = yield restResource.store.cursor(criteria, sort);
      limit = restResource.limit(limit);
      if (limit) cursor.limit(connectedUser, limit);
      return new RestCursor(restResource, connectedUser, cursor);
    })();
  }
}

function _inspect(input, depth) {
  var maxDepth = 4;
  var maxKeys = 15;

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
      var _ret = function () {
        if (depth > maxDepth) return {
            v: '[...]'
          };

        var first = _inspect(input[0], depth);

        if (input.every(item => _inspect(item, depth) === first)) {
          return {
            v: first.trim() + '[]'
          };
        } else {
          return {
            v: '[' + input.slice(0, maxKeys).map(item => _inspect(item, depth)).join(', ') + (input.length >= maxKeys ? ', ...' : '') + ']'
          };
        }
      }();

      if (typeof _ret === "object") return _ret.v;
    } else {
      return 'Array';
    }
  } else {
    var keys = Object.keys(input);

    if (!keys.length) {
      if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
        return input.constructor.name;
      } else {
        return 'Object';
      }
    }

    if (depth > maxDepth) return '{...}';
    var indent = '  '.repeat(depth - 1);
    var entries = keys.slice(0, maxKeys).map(key => {
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