"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
class RestCursor {
  constructor(restResource, connectedUser, cursor) {
    this._restResource = restResource;
    this._connectedUser = connectedUser;
    this._cursor = cursor;
  }

  toArray() {
    return this._cursor.toArray().then(results => {
      return results && results.map(result => {
        return this._restResource.transform(result, this._connectedUser);
      });
    });
  }
}
exports.default = RestCursor;
//# sourceMappingURL=RestCursor.js.map