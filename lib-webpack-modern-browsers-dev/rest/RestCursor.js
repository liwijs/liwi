export default class RestCursor {
  constructor(restResource, connectedUser, cursor) {
    this._restResource = restResource;
    this._connectedUser = connectedUser;
    this._cursor = cursor;
  }

  toArray() {
    return this._cursor.toArray().then(results => results && results.map(result => this._restResource.transform(result, this._connectedUser)));
  }
}
//# sourceMappingURL=RestCursor.js.map