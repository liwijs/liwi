import type { ServiceQuery } from 'liwi-resources-client';
import { createResourceClientService } from 'liwi-resources-client';
import type { DraftTask, Task } from './Task';

export interface TaskQueryAllParams {
  completed?: boolean;
  limit: number;
  page: number;
}

export interface TaskCreateParams {
  task: DraftTask;
}

interface TaskPatchParams {
  id: Task['_id'];
  patch: Partial<Pick<Task, 'completed' | 'label'>>;
}

export interface TasksService {
  queries: {
    queryAll: ServiceQuery<Task[], TaskQueryAllParams>;
    queryWithoutParams: ServiceQuery<Task[], Record<string, never>>;
  };
  operations: {
    create: (params: TaskCreateParams) => Promise<Task>;
    patch: (params: TaskPatchParams) => Promise<Task>;
    clearCompleted: () => Promise<void>;
  };
}

export const createTasksServiceClient =
  createResourceClientService<TasksService>('tasks', {
    queries: { queryAll: null, queryWithoutParams: null },
    operations: { create: null, patch: null, clearCompleted: null },
  });
