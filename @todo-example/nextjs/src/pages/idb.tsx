import type { NextPage } from 'next';
import { useContext, useEffect } from 'react';
import {
  useOperation,
  TransportClientReadyContext,
  useResource,
} from 'react-liwi';
import { TodoServicesContext } from 'app/services/TodoServicesProvider';
import { TodoApp } from 'components/TodoApp';

const Home: NextPage = () => {
  const todoServices = useContext(TodoServicesContext);
  const isReady = useContext(TransportClientReadyContext);
  const [createTask, { loading: isTaskCreating, error: hasTaskCreateFailed }] =
    useOperation(todoServices.tasksService.operations.create);
  const tasksResourceResult = useResource(
    todoServices.tasksService.queries.queryAll,
    {
      params: {
        limit: 200,
        page: 1,
      },
      subscribe: true,
    },
    [],
  );
  const [clearCompleted] = useOperation(
    todoServices.tasksService.operations.clearCompleted,
  );
  const [patchTask] = useOperation(todoServices.tasksService.operations.patch);

  useEffect(() => {
    if (hasTaskCreateFailed === undefined) return;
    alert(hasTaskCreateFailed);
  }, [hasTaskCreateFailed]);

  return (
    <TodoApp
      versionName="websocket"
      isReady={isReady}
      isTaskCreating={isTaskCreating}
      createTask={createTask}
      tasksResourceResult={tasksResourceResult}
      clearCompleted={clearCompleted}
      patchTask={patchTask}
    />
  );
};

export default Home;
