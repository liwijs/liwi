'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _inheritsLoose = require('../../../node_modules/@babel/runtime/helpers/esm/inheritsLoose.js');
var _wrapNativeSuper = require('../../../node_modules/@babel/runtime/helpers/esm/wrapNativeSuper.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e['default'] : e; }

var _inheritsLoose__default = /*#__PURE__*/_interopDefaultLegacy(_inheritsLoose);
var _wrapNativeSuper__default = /*#__PURE__*/_interopDefaultLegacy(_wrapNativeSuper);

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
// export type ToServerSubscribeQueryChangePayload = ToServerQueryPayload;
var ResourcesServerError = /*#__PURE__*/function (_Error) {
  _inheritsLoose__default(ResourcesServerError, _Error);

  function ResourcesServerError(code, message) {
    var _this = _Error.call(this, message) || this;

    _this.name = 'ResourcesServerError';
    _this.code = code;
    return _this;
  }

  return ResourcesServerError;
}( /*#__PURE__*/_wrapNativeSuper__default(Error));

exports.ResourcesServerError = ResourcesServerError;
//# sourceMappingURL=index-browser-dev.cjs.js.map
