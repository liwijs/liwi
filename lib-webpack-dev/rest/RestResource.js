var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

import _t from "tcomb-forked";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RestResourceService = function () {
  function RestResourceService(store) {
    _classCallCheck(this, RestResourceService);

    this.store = store;
  }

  _createClass(RestResourceService, [{
    key: "limit",
    value: function limit(connectedUser, _limit) {
      _assert(connectedUser, _t.maybe(_t.Object), "connectedUser");

      return _limit;
    }
  }, {
    key: "criteria",
    value: function criteria(connectedUser, _criteria) {
      _assert(connectedUser, _t.maybe(_t.Object), "connectedUser");

      _assert(_criteria, _t.Object, "_criteria");

      return {};
    }
  }, {
    key: "sort",
    value: function sort(connectedUser, _sort) {
      _assert(connectedUser, _t.maybe(_t.Object), "connectedUser");

      _assert(_sort, _t.maybe(_t.Object), "_sort");

      return null;
    }
  }, {
    key: "transform",
    value: function transform(result) {
      _assert(result, _t.Object, "result");

      return result;
    }
  }]);

  return RestResourceService;
}();

export default RestResourceService;

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _t.stringify(x) + ' supplied to ' + name + ' (expected a ' + _t.getTypeName(type) + ')';
  }

  if (_t.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _t.getTypeName(type)]);

      _t.fail(message());
    }
  } else if (!(x instanceof type)) {
    _t.fail(message());
  }

  return x;
}
//# sourceMappingURL=RestResource.js.map