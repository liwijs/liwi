import type { TasksService } from "@todo-example/modules";
import { createResourceClientService } from "liwi-resources-client";
import type { ReactNode } from "react";
import { createContext, useState, useContext } from "react";
import { TransportClientContext } from "react-liwi";

const createTasksServiceClient = createResourceClientService<TasksService>(
  "tasks",
  {
    queries: { queryAll: null, queryWithoutParams: null },
    operations: { create: null, patch: null, clearCompleted: null },
  },
);

interface TodoServices {
  tasksService: TasksService;
}

export const TodoServicesContext = createContext<TodoServices>(
  {} as TodoServices,
);

export function TodoServicesProvider({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  const transportClient = useContext(TransportClientContext);
  // eslint-disable-next-line react/hook-use-state
  const [todoServices] = useState(() => ({
    tasksService: createTasksServiceClient(transportClient),
  }));

  return (
    <TodoServicesContext.Provider value={todoServices}>
      {children}
    </TodoServicesContext.Provider>
  );
}
