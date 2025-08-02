import { AbstractConnection } from "liwi-store";
import mongodb from "mongodb";
export interface MongoConfig {
    host?: string;
    port?: number | string;
    database: string;
    user?: string;
    password?: string;
}
export default class MongoConnection extends AbstractConnection {
    _connection?: mongodb.MongoClient;
    _connecting?: Promise<mongodb.MongoClient>;
    connectionFailed?: boolean;
    constructor({ host, port, database, user, password, }: MongoConfig);
    connect(connectionString: string, connectionStringRedacted: string): void;
    getConnection(): Promise<mongodb.MongoClient>;
    close(): Promise<void>;
}
//# sourceMappingURL=MongoConnection.d.ts.map