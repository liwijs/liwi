import type { ReactElement, ReactNode } from 'react';
import React, { createContext, useState, useContext } from 'react';
import { TransportClientContext } from 'react-liwi';
import type { TasksService } from 'modules/tasks/TasksService';
import { createTasksServiceClient } from 'modules/tasks/TasksService';

interface TodoServices {
  tasksService: TasksService;
}

export const TodoServicesContext = createContext<TodoServices>(
  {} as TodoServices,
);

export default function TodoServicesProvider({
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
