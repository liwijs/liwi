import { ResourcesServerService, ServiceResource } from 'liwi-resources-server';
import { tasksService } from './tasksService';

export const resourcesServerService = new ResourcesServerService({
  serviceResources: new Map<string, ServiceResource<any, any>>([
    ['tasks', tasksService],
  ]),
});
