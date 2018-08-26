export default class RestCursor<R extends any> {
  private restResource: any;

  private connectedUser: any;

  private cursor: any;

  constructor(restResource: R, connectedUser?: any, cursor?: any) {
    this.restResource = restResource;
    this.connectedUser = connectedUser;
    this.cursor = cursor;
  }

  toArray() {
    return this.cursor
      .toArray()
      .then(
        (results?: Array<any>) =>
          results &&
          results.map((result) =>
            this.restResource.transform(result, this.connectedUser),
          ),
      );
  }
}
