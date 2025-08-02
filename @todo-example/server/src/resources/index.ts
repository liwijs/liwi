import type { ServiceResource } from "liwi-resources-server";
import { ResourcesServerService } from "liwi-resources-server";
import { tasksService } from "./tasksService.ts";

export const resourcesServerService = new ResourcesServerService({
  serviceResources: new Map<string, ServiceResource<any, any>>([
    ["tasks", tasksService],
  ]),
});
