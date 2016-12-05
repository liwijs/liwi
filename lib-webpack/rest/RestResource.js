var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RestResourceService = function () {
  function RestResourceService(store) {
    _classCallCheck(this, RestResourceService);

    this.store = store;
  }

  _createClass(RestResourceService, [{
    key: "limit",
    value: function limit(connectedUser, _limit) {
      return _limit;
    }
  }, {
    key: "criteria",
    value: function criteria() {
      return {};
    }
  }, {
    key: "sort",
    value: function sort() {
      return null;
    }
  }, {
    key: "transform",
    value: function transform(result) {
      return result;
    }
  }]);

  return RestResourceService;
}();

export default RestResourceService;
//# sourceMappingURL=RestResource.js.map