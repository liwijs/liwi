import _regeneratorRuntime from '@babel/runtime/regenerator';

var ResourceServerCursor =
/*#__PURE__*/
function () {
  function ResourceServerCursor(resource, cursor, connectedUser) {
    this.resource = resource;
    this.connectedUser = connectedUser;
    this.cursor = cursor;
  }

  var _proto = ResourceServerCursor.prototype;

  _proto.toArray = function toArray() {
    var _this = this;

    return this.cursor.toArray().then(function (results) {
      return results.map(function (result) {
        return _this.resource.transform(result, _this.connectedUser);
      });
    });
  };

  return ResourceServerCursor;
}();

var ResourcesServerService =
/*#__PURE__*/
function () {
  function ResourcesServerService(_ref) {
    var _ref$serviceResources = _ref.serviceResources,
        serviceResources = _ref$serviceResources === void 0 ? new Map() : _ref$serviceResources,
        _ref$cursorResources = _ref.cursorResources,
        cursorResources = _ref$cursorResources === void 0 ? new Map() : _ref$cursorResources;
    this.serviceResources = serviceResources;
    this.cursorResources = cursorResources;
  }

  var _proto = ResourcesServerService.prototype;

  _proto.addResource = function addResource(key, resource) {
    this.serviceResources.set(key, resource);
  };

  _proto.addCursorResource = function addCursorResource(key, cursorResource) {
    this.cursorResources.set(key, cursorResource);
  };

  _proto.getServiceResource = function getServiceResource(key) {
    var resource = this.serviceResources.get(key);
    if (!resource) throw new Error("Invalid service resource: \"" + key + "\"");
    return resource;
  };

  _proto.getCursorResource = function getCursorResource(key) {
    var resource = this.cursorResources.get(key);
    if (!resource) throw new Error("Invalid cursor resource: \"" + key + "\"");
    return resource;
  };

  _proto.createCursor = function createCursor(resource, connectedUser, _ref2) {
    var criteria, sort, limit, cursor;
    return _regeneratorRuntime.async(function createCursor$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            criteria = _ref2.criteria, sort = _ref2.sort, limit = _ref2.limit;
            // TODO: resource.query(connectedUser, criteria || {}, sort).cursor()
            criteria = resource.criteria(connectedUser, criteria || {});
            sort = resource.sort(connectedUser, sort);
            _context.next = 5;
            return _regeneratorRuntime.awrap(resource.store.cursor(criteria, sort));

          case 5:
            cursor = _context.sent;
            limit = resource.limit(limit);
            if (limit) cursor.limit(connectedUser, limit);
            return _context.abrupt("return", new ResourceServerCursor(resource, cursor, connectedUser));

          case 9:
          case "end":
            return _context.stop();
        }
      }
    });
  };

  return ResourcesServerService;
}();

export { ResourcesServerService };
//# sourceMappingURL=index-browser-dev.es.js.map
