export default abstract class AbstractConnection {
  abstract getConnection(): Promise<any>;

  abstract close(): Promise<void>;
}
