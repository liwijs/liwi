import type { Task } from "@todo-example/modules";
import {
  createMongoStore,
  createMongoSubscribeStore,
} from "./createMongoStore";

export const tasksStore = createMongoSubscribeStore<Task>(
  createMongoStore("tasks"),
);
