import type { TasksService } from '@todo-example/modules';
import type { ReactElement, FormEventHandler } from 'react';
import { useState } from 'react';
import type { OperationCallWrapper } from 'react-liwi';

export interface NewTaskFormProps {
  isReady: boolean;
  isTaskCreating: boolean;
  createTask: OperationCallWrapper<TasksService['operations']['create']>;
}

export function NewTaskForm({
  isReady,
  isTaskCreating,
  createTask,
}: NewTaskFormProps): ReactElement {
  const [newTaskInput, setNewTaskInput] = useState('');

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
        (err) => {},
      );
    }
    return false;
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        disabled={!isReady || isTaskCreating}
        value={newTaskInput}
        onChange={(e): void => {
          setNewTaskInput(e.target.value);
        }}
      />
    </form>
  );
}
