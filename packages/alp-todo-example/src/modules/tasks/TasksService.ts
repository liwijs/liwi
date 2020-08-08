import {
  ServiceQuery,
  createResourceClientService,
} from 'liwi-resources-client';
import { DraftTask, Task } from './Task';

interface QueryAllParams {
  completed: boolean | null;
  limit: number;
  page: number;
}

interface CreateParams {
  task: DraftTask;
}

interface PatchParams {
  id: Task['_id'];
  patch: Partial<Pick<Task, 'completed' | 'label'>>;
}

export interface TasksService {
  queries: {
    queryAll: ServiceQuery<Task[], QueryAllParams>;
  };
  operations: {
    create: (params: CreateParams) => Promise<Task>;
    patch: (params: PatchParams) => Promise<Task>;
    clearCompleted: () => Promise<void>;
  };
}

export const createTasksServiceClient = createResourceClientService<
  TasksService
>('tasks', {
  queries: { queryAll: null },
  operations: { create: null, patch: null, clearCompleted: null },
});
