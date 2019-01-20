import { Server } from 'socket.io';
import { ResourcesService } from 'liwi-resources';
declare module 'socket.io' {
    interface Socket {
        user?: any;
    }
}
export default function init(io: Server, resourcesService: ResourcesService): void;
//# sourceMappingURL=index.d.ts.map