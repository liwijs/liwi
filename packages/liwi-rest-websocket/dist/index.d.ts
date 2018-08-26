import { Server } from 'socket.io';
import { RestService } from 'liwi-rest';
declare module 'socket.io' {
    interface Socket {
        user: any;
    }
}
export default function init(io: Server, restService: RestService): void;
//# sourceMappingURL=index.d.ts.map