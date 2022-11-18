export default abstract class AbstractConnection {
    abstract getConnection(): Promise<any>;
    abstract close(): Promise<void>;
}
//# sourceMappingURL=AbstractConnection.d.ts.map