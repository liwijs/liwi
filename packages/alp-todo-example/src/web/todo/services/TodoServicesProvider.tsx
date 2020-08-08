import React, {
  createContext,
  ReactElement,
  useState,
  useContext,
  ReactNode,
} from 'react';
import { TransportClientContext } from 'react-liwi';
import {
  TasksService,
  createTasksServiceClient,
} from 'modules/tasks/TasksService';

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
