import type { ReactElement, FormEventHandler } from 'react';
import { useState, useContext, useEffect } from 'react';
import { useOperation, TransportClientReadyContext } from 'react-liwi';
import { TodoServicesContext } from 'app/services/TodoServicesProvider';

export function NewTaskForm(): ReactElement {
  const [newTaskInput, setNewTaskInput] = useState('');
  const todoServices = useContext(TodoServicesContext);
  const isReady = useContext(TransportClientReadyContext);
  const [createTask, { loading: taskCreating, error: taskCreateFailed }] =
    useOperation(todoServices.tasksService.operations.create);

  useEffect(() => {
    if (taskCreateFailed === undefined) return;
    alert(taskCreateFailed);
  }, [taskCreateFailed]);

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    if (!isReady) return;
    if (newTaskInput) {
      createTask({
        task: {
          label: newTaskInput,
          completed: false,
        },
      }).then(
        ([err]) => {
          if (!err) {
            setNewTaskInput('');
          }
        },
        (error) => {},
      );
    }
    return false;
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="new-todo"
        className="new-todo"
        placeholder="What needs to be done?"
        disabled={!isReady || taskCreating}
        value={newTaskInput}
        onChange={(e): void => {
          setNewTaskInput(e.target.value);
        }}
      />
    </form>
  );
}
