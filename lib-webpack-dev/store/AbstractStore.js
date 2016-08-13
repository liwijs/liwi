var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import assert from 'assert';

var AbstractStore = function () {
    /**
     * @param {AbstractConnection} connection
     */
    function AbstractStore(connection) {
        _classCallCheck(this, AbstractStore);

        assert(connection);
        this._connection = connection;
    }

    _createClass(AbstractStore, [{
        key: 'connection',
        get: function get() {
            return this._connection;
        }
    }]);

    return AbstractStore;
}();

export default AbstractStore;
//# sourceMappingURL=AbstractStore.js.map