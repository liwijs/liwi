import Logger from 'nightingale-logger';

const logger = new Logger('liwi.rest-websocket');

export default function init(io, restService) {
    io.on('connection', socket => {
        socket.on('rest', ({ type, restName }: { type: string, restName: string }, args: Array, callback: Function) => {
            logger.info('rest', { type, restName, args });
            switch (type) {
                case 'cursor toArray': {
                    const [options] = args;
                    return restService.createCursor(restName, options)
                        .then(cursor => cursor.toArray())
                        .then(results => callback(null, results))
                        .catch(err => callback(err.message));
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
                    return restService.get(type)(restName, ...args)
                        .then(result => callback(null, result))
                        .catch(err => callback(err.message || err));

                default:
                    callback(`Unknown command: "${type}"`);
            }
        });
    });
}
