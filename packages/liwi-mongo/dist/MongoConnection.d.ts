import { MongoClient } from 'mongodb';
import { AbstractConnection } from 'liwi-store';
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