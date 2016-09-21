var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

import _t from 'tcomb-forked';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import RestCursor from './RestCursor';

var RestService = function () {
  function RestService(restResources) {
    _assert(restResources, Map, 'restResources');

    _classCallCheck(this, RestService);

    this.restResources = restResources;
  }

  _createClass(RestService, [{
    key: 'addRestResource',
    value: function addRestResource(key, restResource) {
      _assert(key, _t.String, 'key');

      this.restResources.set(key, restResource);
    }
  }, {
    key: 'get',
    value: function get(key) {
      _assert(key, _t.String, 'key');

      var restResource = this.restResources.get(key);
      if (!restResource) throw new Error('Invalid rest resource: "' + key + '"');
      return restResource;
    }
  }, {
    key: 'createCursor',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(restName, connectedUser, _ref2) {
        var criteria = _ref2.criteria;
        var sort = _ref2.sort;
        var limit = _ref2.limit;
        var restResource, cursor;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _assert(restName, _t.String, 'restName');

                _assert(connectedUser, _t.maybe(_t.Object), 'connectedUser');

                _assert({
                  criteria: criteria,
                  sort: sort,
                  limit: limit
                }, _t.interface({
                  criteria: _t.maybe(_t.Object),
                  sort: _t.maybe(_t.Object),
                  limit: _t.maybe(_t.Number)
                }), '{ criteria, sort, limit }');

                restResource = this.get(restName);

                criteria = restResource.criteria(connectedUser, criteria || {});
                sort = restResource.sort(connectedUser, sort);
                _context.next = 8;
                return restResource.store.cursor(criteria, sort);

              case 8:
                cursor = _context.sent;

                limit = restResource.limit(limit);
                if (limit) cursor.limit(connectedUser, limit);
                return _context.abrupt('return', new RestCursor(restResource, connectedUser, cursor));

              case 12:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function createCursor(_x, _x2, _x3) {
        return _ref.apply(this, arguments);
      }

      return createCursor;
    }()
  }]);

  return RestService;
}();

export default RestService;

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _t.stringify(x) + ' supplied to ' + name + ' (expected a ' + _t.getTypeName(type) + ')';
  }

  if (_t.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _t.getTypeName(type)]);

      _t.fail(message());
    }

    return type(x);
  }

  if (!(x instanceof type)) {
    _t.fail(message());
  }

  return x;
}
//# sourceMappingURL=RestService.js.map