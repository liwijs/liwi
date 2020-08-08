import { Update } from 'liwi-mongo';
import { ServiceResource } from 'liwi-resources-server';
import { Task } from 'modules/tasks/Task';
import { TasksService } from 'modules/tasks/TasksService';
import { tasksStore } from 'server/stores/tasksStores';

export const tasksService: ServiceResource<TasksService> = {
  queries: {
    queryAll: ({ completed, limit, page }) => {
      const securedLimit = Math.min(200, limit);
      return tasksStore.createQueryCollection({
        criteria: completed === null ? {} : { completed },
        sort: { created: 1 },
        limit: securedLimit,
        skip: (page - 1) * securedLimit,
      });
    },

    queryWithoutParams: () => {
      return tasksStore.createQueryCollection({
        sort: { created: 1 },
        limit: 100,
      });
    },
  },
  operations: {
    create: ({ task }) => {
      return tasksStore.insertOne(task);
    },
    patch: async ({ id, patch }) => {
      const task = await tasksStore.findByKey(id);
      if (!task) throw new Error('Invalid task');

      const update: Update<Task>['$set'] = {};
      if ('completed' in patch) update.completed = patch.completed;
      if ('label' in patch) update.label = patch.label;

      return tasksStore.partialUpdateOne(task, { $set: update });
    },
    clearCompleted: () => {
      return tasksStore.deleteMany({ completed: true });
    },
  },
};
