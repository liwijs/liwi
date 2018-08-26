import { Db } from 'mongodb';
import { AbstractConnection } from 'liwi-store';
export default class MongoConnection extends AbstractConnection {
    _connection?: Db;
    _connecting?: Promise<Db>;
    connectionFailed?: boolean;
    constructor(config: Map<string, string | number>);
    connect(connectionString: string): void;
    getConnection(): Promise<Db>;
    close(): Promise<void>;
}
//# sourceMappingURL=MongoConnection.d.ts.map