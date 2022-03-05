import type { TasksService } from '@todo-example/modules';
import { createTasksServiceClient } from '@todo-example/modules';
import type { ReactElement, ReactNode } from 'react';
import { createContext, useState, useContext } from 'react';
import { TransportClientContext } from 'react-liwi';

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
}): ReactElement {
  const transportClient = useContext(TransportClientContext);
  const [todoServices] = useState(() => ({
    tasksService: createTasksServiceClient(transportClient),
  }));

  return (
    <TodoServicesContext.Provider value={todoServices}>
      {children}
    </TodoServicesContext.Provider>
  );
}
