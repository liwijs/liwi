import Logger from 'nightingale-logger';

const MAX_OPENED_CURSORS = 5;
const logger = new Logger('liwi.rest-websocket');

export default function init(io, restService) {
    io.on('connection', socket => {
        let openCursors = new Map();
        let timeouts = new Map();
        let activeListeners = new Map();

        const closeCursor = (id) => {
            clearTimeout(timeouts[id]);
            timeouts.delete(id);
            openCursors[id].close();
            openCursors.delete(id);
        };

        socket.on('disconnect', () => {
            openCursors.forEach(cursor => cursor.close());
            timeouts.forEach(timeout => clearTimeout(timeout));
            activeListeners.forEach(listener => listener.close());

            openCursors = timeouts = activeListeners = null;
        });

        let nextIdCursor = 1;

        socket.on('rest', ({ type, restName }: { type: string; restName: string }, args: Array, callback: Function) => {
            logger.info('rest', { type, restName, args });
            switch (type) {
                case 'createCursor': {
                    if (openCursors.size > MAX_OPENED_CURSORS) return callback('too many cursors');

                    const id = nextIdCursor++;
                    const [options] = args;
                    const cursor = restService.createCursor(restName, options);
                    if (!cursor) return callback('failed to create cursor');

                    timeouts.set(id, setTimeout(() => {
                        logger.warn('socket closed by timeout', { id, restName });
                        closeCursor(id);
                    }));

                    return callback(null, id);
                }

                case 'cursor toArray': {
                    const [options] = args;
                    return restService.createCursor(restName, options)
                        .then(cursor => cursor.toArray())
                        .then(results => callback(null, results))
                        .catch(err => callback(err.message));
                }

                case 'cursor': {
                    const [{ type: typeCursorAction, id: idCursor }, cursorArgs] = args;

                    const cursor = openCursors.get(idCursor);
                    if (!cursor) return callback(`failed to find cursor "${idCursor}"`);
                    switch (typeCursorAction) {
                        case 'close':
                            closeCursor(idCursor);
                            return callback();

                        case 'advance':
                        case 'next':
                        case 'count':
                            return cursor[type](...cursorArgs)
                                .then(result => callback(null, result))
                                .catch(err => callback(err.message || err));
                            /* cursor.next().then((key) => {
                                if (!key) return callback(null);
                                return cursor.result();
                            }).then(result => {
                                    response(null, restService.transform(data));
                                });
                            }, () => {
                                response(null);
                            }); */

                        default:
                            callback(`Unknown command: "${type}"`);
                    }

                    break;
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
                    return restService[type](restName, ...args)
                        .then(result => callback(null, result))
                        .catch(err => callback(err.message || err));

                default:
                    callback(`Unknown command: "${type}"`);
            }
        });
    });
}
