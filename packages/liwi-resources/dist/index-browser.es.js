import _inheritsLoose from '@babel/runtime/helpers/esm/inheritsLoose';
import _wrapNativeSuper from '@babel/runtime/helpers/esm/wrapNativeSuper';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
// export type ToServerSubscribeQueryChangePayload = ToServerQueryPayload;
var ResourcesServerError = /*#__PURE__*/function (_Error) {
  _inheritsLoose(ResourcesServerError, _Error);

  function ResourcesServerError(code, message) {
    var _this = _Error.call(this, message) || this;

    _this.name = 'ResourcesServerError';
    _this.code = code;
    return _this;
  }

  return ResourcesServerError;
}( /*#__PURE__*/_wrapNativeSuper(Error));

export { ResourcesServerError };
//# sourceMappingURL=index-browser.es.js.map
