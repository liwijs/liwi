import { Task } from 'modules/tasks/Task';
import { createMongoSubscribeStore, createMongoStore } from './MongoStore';

export const tasksStore = createMongoSubscribeStore<Task>(
  createMongoStore('tasks'),
);
