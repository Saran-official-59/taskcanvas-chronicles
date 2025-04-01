
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

// Define task types
export type TaskLabel = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple';

export type Task = {
  id: string;
  title: string;
  description: string;
  labels: TaskLabel[];
  createdAt: string;
  columnId: string;
};

export type Column = {
  id: string;
  title: string;
  taskIds: string[];
};

export type Board = {
  columns: Column[];
  tasks: Record<string, Task>;
};

type TaskContextType = {
  board: Board;
  addTask: (columnId: string, title: string, description: string, labels: TaskLabel[]) => void;
  updateTask: (taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  deleteTask: (taskId: string) => void;
  moveTask: (taskId: string, sourceColumnId: string, destinationColumnId: string, newIndex: number) => void;
};

// Create initial mock data
const initialColumns: Column[] = [
  { id: 'column-1', title: 'To Do', taskIds: ['task-1', 'task-2'] },
  { id: 'column-2', title: 'In Progress', taskIds: ['task-3'] },
  { id: 'column-3', title: 'Done', taskIds: ['task-4'] },
];

const initialTasks: Record<string, Task> = {
  'task-1': {
    id: 'task-1',
    title: 'Create project plan',
    description: 'Define project scope, timeline, and resources',
    labels: ['blue'],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    columnId: 'column-1',
  },
  'task-2': {
    id: 'task-2',
    title: 'Research competitors',
    description: 'Analyze competitor features and pricing',
    labels: ['green', 'yellow'],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    columnId: 'column-1',
  },
  'task-3': {
    id: 'task-3',
    title: 'Design UI mockups',
    description: 'Create wireframes and design mockups for key screens',
    labels: ['purple'],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    columnId: 'column-2',
  },
  'task-4': {
    id: 'task-4',
    title: 'Set up development environment',
    description: 'Install and configure necessary tools and dependencies',
    labels: ['orange', 'red'],
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    columnId: 'column-3',
  },
};

const initialBoard: Board = {
  columns: initialColumns,
  tasks: initialTasks,
};

// Create the task context
const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [board, setBoard] = useState<Board>(() => {
    // Try to load from localStorage
    const savedBoard = localStorage.getItem('taskBoard');
    return savedBoard ? JSON.parse(savedBoard) : initialBoard;
  });

  // Save to localStorage whenever board changes
  useEffect(() => {
    localStorage.setItem('taskBoard', JSON.stringify(board));
  }, [board]);

  // Add a new task
  const addTask = (columnId: string, title: string, description: string, labels: TaskLabel[]) => {
    const newTaskId = `task-${uuidv4()}`;
    const newTask: Task = {
      id: newTaskId,
      title,
      description,
      labels,
      createdAt: new Date().toISOString(),
      columnId,
    };

    setBoard(prev => {
      // Create updated column
      const updatedColumns = prev.columns.map(column => {
        if (column.id === columnId) {
          return {
            ...column,
            taskIds: [...column.taskIds, newTaskId],
          };
        }
        return column;
      });

      // Create updated tasks
      const updatedTasks = {
        ...prev.tasks,
        [newTaskId]: newTask,
      };

      return {
        columns: updatedColumns,
        tasks: updatedTasks,
      };
    });

    toast.success('Task added successfully');
  };

  // Update a task
  const updateTask = (taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    setBoard(prev => {
      const task = prev.tasks[taskId];
      if (!task) return prev;

      const updatedTask = {
        ...task,
        ...updates,
      };

      return {
        ...prev,
        tasks: {
          ...prev.tasks,
          [taskId]: updatedTask,
        },
      };
    });

    toast.success('Task updated successfully');
  };

  // Delete a task
  const deleteTask = (taskId: string) => {
    setBoard(prev => {
      const task = prev.tasks[taskId];
      if (!task) return prev;

      // Create a copy of tasks without the deleted task
      const { [taskId]: deletedTask, ...remainingTasks } = prev.tasks;

      // Update column to remove taskId
      const updatedColumns = prev.columns.map(column => {
        if (column.taskIds.includes(taskId)) {
          return {
            ...column,
            taskIds: column.taskIds.filter(id => id !== taskId),
          };
        }
        return column;
      });

      return {
        columns: updatedColumns,
        tasks: remainingTasks,
      };
    });

    toast.success('Task deleted successfully');
  };

  // Move a task between columns or reorder within a column
  const moveTask = (taskId: string, sourceColumnId: string, destinationColumnId: string, newIndex: number) => {
    setBoard(prev => {
      // Find the source and destination columns
      const sourceColumn = prev.columns.find(col => col.id === sourceColumnId);
      const destinationColumn = prev.columns.find(col => col.id === destinationColumnId);
      
      if (!sourceColumn || !destinationColumn) return prev;

      // Create new columns array removing the task from source
      const updatedColumns = prev.columns.map(column => {
        if (column.id === sourceColumnId) {
          return {
            ...column,
            taskIds: column.taskIds.filter(id => id !== taskId),
          };
        }
        return column;
      });

      // Add the task to the destination column at the specified index
      const finalColumns = updatedColumns.map(column => {
        if (column.id === destinationColumnId) {
          const newTaskIds = [...column.taskIds];
          newTaskIds.splice(newIndex, 0, taskId);
          return {
            ...column,
            taskIds: newTaskIds,
          };
        }
        return column;
      });

      // Update the task's columnId if it has changed
      const updatedTasks = {
        ...prev.tasks,
        [taskId]: {
          ...prev.tasks[taskId],
          columnId: destinationColumnId,
        },
      };

      return {
        columns: finalColumns,
        tasks: updatedTasks,
      };
    });
  };

  return (
    <TaskContext.Provider value={{ board, addTask, updateTask, deleteTask, moveTask }}>
      {children}
    </TaskContext.Provider>
  );
};

// Custom hook to use the task context
export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};
