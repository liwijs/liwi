import type { Task } from '@todo-example/modules';
import {
  createMongoSubscribeStore,
  createMongoStore,
} from './createMongoStore';

export const tasksStore = createMongoSubscribeStore<Task>(
  createMongoStore('tasks'),
);
