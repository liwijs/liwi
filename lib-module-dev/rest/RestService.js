var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import RestCursor from './RestCursor';

import t from 'flow-runtime';

var RestService = function () {
  function RestService(restResources) {
    _classCallCheck(this, RestService);

    var _restResourcesType = t.ref('Map', t.string(), t.any());

    t.param('restResources', _restResourcesType).assert(restResources);

    this.restResources = restResources;
  }

  _createClass(RestService, [{
    key: 'addRestResource',
    value: function addRestResource(key, restResource) {
      var _keyType = t.string();

      t.param('key', _keyType).assert(key);

      this.restResources.set(key, restResource);
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
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _connectedUserType = t.nullable(t.object());
                _returnType = t.return(t.mixed());
                t.param('connectedUser', _connectedUserType).assert(connectedUser);
                _t$object$assert = t.object(t.property('criteria', t.nullable(t.object())), t.property('sort', t.nullable(t.object())), t.property('limit', t.nullable(t.number()))).assert(_arg), criteria = _t$object$assert.criteria, sort = _t$object$assert.sort, limit = _t$object$assert.limit;

                // TODO: restResource.query(connectedUser, criteria || {}, sort).cursor()
                criteria = restResource.criteria(connectedUser, criteria || {});
                sort = restResource.sort(connectedUser, sort);
                _context.next = 8;
                return restResource.store.cursor(criteria, sort);

              case 8:
                cursor = _context.sent;

                limit = restResource.limit(limit);
                if (limit) cursor.limit(connectedUser, limit);
                return _context.abrupt('return', _returnType.assert(new RestCursor(restResource, connectedUser, cursor)));

              case 12:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function createCursor() {
        return _ref.apply(this, arguments);
      };
    }()
  }]);

  return RestService;
}();

export { RestService as default };
//# sourceMappingURL=RestService.js.map