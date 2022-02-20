import type { Task } from '@todo-example/modules/tasks/Task';
import {
  createMongoSubscribeStore,
  createMongoStore,
} from './createMongoStore';

export const tasksStore = createMongoSubscribeStore<Task>(
  createMongoStore('tasks'),
);
