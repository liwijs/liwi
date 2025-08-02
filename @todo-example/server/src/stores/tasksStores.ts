import type { Task } from "@todo-example/modules";
import {
  createMongoStore,
  createMongoSubscribeStore,
} from "./createMongoStore.ts";

export const tasksStore = createMongoSubscribeStore<Task>(
  createMongoStore("tasks"),
);
