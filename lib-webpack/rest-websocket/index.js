var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

import Logger from 'nightingale-logger';

var logger = new Logger('liwi.rest-websocket');

export default function init(io, restService) {
    io.on('connection', function (socket) {
        socket.on('rest', function (_ref, args, callback) {
            var type = _ref.type;
            var restName = _ref.restName;

            logger.info('rest', { type: type, restName: restName, args: args });
            switch (type) {
                case 'cursor toArray':
                    {
                        var _args = _slicedToArray(args, 1);

                        var options = _args[0];

                        return restService.createCursor(restName, options).then(function (cursor) {
                            return cursor.toArray();
                        }).then(function (results) {
                            return callback(null, results);
                        }).catch(function (err) {
                            return callback(err.message);
                        });
                    }

                case 'insertOne':
                case 'updateOne':
                case 'updateSeveral':
                case 'partialUpdateByKey':
                case 'partialUpdateOne':
                case 'partialUpdateMany':
                case 'deleteByKey':
                case 'deleteOne':
                case 'findOne':
                    return restService.get(type).apply(undefined, [restName].concat(_toConsumableArray(args))).then(function (result) {
                        return callback(null, result);
                    }).catch(function (err) {
                        return callback(err.message || err);
                    });

                default:
                    callback('Unknown command: "' + type + '"');
            }
        });
    });
}
//# sourceMappingURL=index.js.map