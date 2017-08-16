var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false, descriptor.configurable = true, "value" in descriptor && (descriptor.writable = true), Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { return void reject(error); } return info.done ? void resolve(value) : Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function"); }

import RestCursor from './RestCursor';

import t from 'flow-runtime';

var RestService = function () {
  function RestService(restResources) {
    _classCallCheck(this, RestService);

    var _restResourcesType = t.ref('Map', t.string(), t.any());

    t.param('restResources', _restResourcesType).assert(restResources), this.restResources = restResources;
  }

  return _createClass(RestService, [{
    key: 'addRestResource',
    value: function addRestResource(key, restResource) {
      var _keyType = t.string();

      t.param('key', _keyType).assert(key), this.restResources.set(key, restResource);
    }
  }, {
    key: 'get',
    value: function get(key) {
      var _keyType2 = t.string();

      t.param('key', _keyType2).assert(key);

      var restResource = this.restResources.get(key);
      if (!restResource) throw new Error('Invalid rest resource: "' + key + '"');
      return restResource;
    }
  }, {
    key: 'createCursor',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(restResource, connectedUser, _arg) {
        var _connectedUserType, _returnType, _t$object$assert, criteria, sort, limit, cursor;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          for (;;) switch (_context.prev = _context.next) {
            case 0:
              return _connectedUserType = t.nullable(t.object()), _returnType = t.return(t.mixed()), t.param('connectedUser', _connectedUserType).assert(connectedUser), _t$object$assert = t.object(t.property('criteria', t.nullable(t.object())), t.property('sort', t.nullable(t.object())), t.property('limit', t.nullable(t.number()))).assert(_arg), criteria = _t$object$assert.criteria, sort = _t$object$assert.sort, limit = _t$object$assert.limit, criteria = restResource.criteria(connectedUser, criteria || {}), sort = restResource.sort(connectedUser, sort), _context.next = 7, restResource.store.cursor(criteria, sort);

            case 7:
              return cursor = _context.sent, _context.abrupt('return', (limit = restResource.limit(limit), limit && cursor.limit(connectedUser, limit), _returnType.assert(new RestCursor(restResource, connectedUser, cursor))));

            case 9:
            case 'end':
              return _context.stop();
          }
        }, _callee, this);
      }));

      return function createCursor() {
        return _ref.apply(this, arguments);
      };
    }()
  }]), RestService;
}();

export { RestService as default };
//# sourceMappingURL=RestService.js.map