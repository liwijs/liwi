/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
import type { Task, TasksService } from '@todo-example/modules';
import classNames from 'classnames';
import type { ReactElement, MouseEventHandler } from 'react';
import { useState, useRef, useEffect } from 'react';
import type { OperationCallWrapper } from 'react-liwi';

export interface TaskItemProps {
  task: Task;
  onChangeCompleted: (completed: boolean) => Promise<boolean>;
  onChangeLabel: (newText: string) => Promise<boolean>;
}

function TaskItem({
  task,
  onChangeCompleted,
  onChangeLabel,
}: TaskItemProps): ReactElement {
  const [optimisticUpdatedTask, setOptimisticUpdatedTask] = useState(task);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(task.label);
  const inputEditRef = useRef<HTMLInputElement>(null);

  const handleDoubleClick: MouseEventHandler<HTMLLIElement> = (e): void => {
    e.preventDefault();
    e.stopPropagation();
    setEditing(true);
  };

  const handleSaveEditText = (): void => {
    onChangeLabel(editText).then(
      (success) => {
        if (!success) {
          setOptimisticUpdatedTask({
            ...optimisticUpdatedTask,
            label: task.label,
          });
        }
      },
      () => {
        setOptimisticUpdatedTask({
          ...optimisticUpdatedTask,
          label: task.label,
        });
      },
    );
    setOptimisticUpdatedTask({ ...optimisticUpdatedTask, label: editText });
    setEditing(false);
  };

  const handleCompletedChange = (): void => {
    onChangeCompleted(!optimisticUpdatedTask.completed).then(
      (success) => {
        if (!success) {
          setOptimisticUpdatedTask({
            ...optimisticUpdatedTask,
            completed: task.completed,
          });
        }
      },
      () => {
        setOptimisticUpdatedTask({
          ...optimisticUpdatedTask,
          completed: task.completed,
        });
      },
    );
    setOptimisticUpdatedTask({
      ...optimisticUpdatedTask,
      completed: !optimisticUpdatedTask.completed,
    });
    setEditing(false);
  };

  useEffect(() => {
    if (editing && inputEditRef.current) {
      inputEditRef.current.focus();
    }
  }, [editing]);

  useEffect(() => {
    setOptimisticUpdatedTask(task);
    setEditText(task.label);
  }, [task]);

  return (
    <li
      className={classNames(
        optimisticUpdatedTask.completed && 'completed',
        editing && 'editing',
      )}
      onDoubleClick={handleDoubleClick}
    >
      <div className="view">
        <input
          checked={optimisticUpdatedTask.completed}
          className="toggle"
          type="checkbox"
          onChange={handleCompletedChange}
        />
        <label>{optimisticUpdatedTask.label}</label>
        <button type="button" className="destroy" />
      </div>
      <input
        ref={inputEditRef}
        className="edit"
        value={editText}
        onChange={(e) => {
          setEditText(e.target.value);
        }}
        onBlur={handleSaveEditText}
      />
    </li>
  );
}

export interface TodoListProps {
  tasks: Task[];
  patchTask: OperationCallWrapper<TasksService['operations']['patch']>;
}

export function TodoList({ tasks, patchTask }: TodoListProps): ReactElement {
  return (
    <ul className="todo-list">
      {/* List items should get the class `editing` when editing and `completed` when marked as completed */}
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onChangeLabel={(newLabel): Promise<boolean> => {
            return patchTask({ id: task._id, patch: { label: newLabel } }).then(
              ([err]) => !err,
            );
          }}
          onChangeCompleted={(completed): Promise<boolean> => {
            return patchTask({ id: task._id, patch: { completed } }).then(
              ([err]) => !err,
            );
          }}
        />
      ))}
    </ul>
  );
}
