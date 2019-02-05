import { Server } from 'socket.io';
import { ResourcesServerService } from 'liwi-resources-server';
declare module 'socket.io' {
    interface Socket {
        user?: any;
    }
}
export default function init(io: Server, resourcesService: ResourcesServerService): void;
//# sourceMappingURL=index.d.ts.map