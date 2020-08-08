import { AbstractConnection } from 'liwi-store';
import { MongoClient } from 'mongodb';
export default class MongoConnection extends AbstractConnection {
    _connection?: MongoClient;
    _connecting?: Promise<MongoClient>;
    connectionFailed?: boolean;
    constructor(config: Map<string, string | number>);
    connect(connectionString: string): void;
    getConnection(): Promise<MongoClient>;
    close(): Promise<void>;
}
//# sourceMappingURL=MongoConnection.d.ts.map