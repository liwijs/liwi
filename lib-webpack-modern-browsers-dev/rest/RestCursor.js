export default class RestCursor {
  constructor(restResource, connectedUser, cursor) {
    this._restResource = restResource;
    this._connectedUser = connectedUser;
    this._cursor = cursor;
  }

  toArray() {
    var _this = this;

    return this._cursor.toArray().then(function (results) {
      return results && results.map(function (result) {
        return _this._restResource.transform(result, _this._connectedUser);
      });
    });
  }
}
//# sourceMappingURL=RestCursor.js.map