import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Task, getTasks, deleteTask, updateTask } from '../api/tasks';
import { Trash, Search } from "lucide-react";
import TaskForm from './TaskForm';

interface TaskListProps {
  tasks: Task[];
  onDeleteTask: (id: number) => void;
  onEditTask: (id: number) => void;
  editingTaskId: number | null;
  onSaveTask: (id: number, task: Partial<Task>) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onDeleteTask, onEditTask, editingTaskId, onSaveTask }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const queryClient = useQueryClient();

  const { data: tasksData, isLoading, isError } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const handleDeleteTask = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleTaskRowClick = (taskId: number) => {
    onEditTask(taskId);
  };

  const handleSaveClick = (taskId: number, updatedTask: Partial<Task>) => {
    onSaveTask(taskId, updatedTask);
  };

  const filteredTasks = tasksData?.filter((task) => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (isLoading) return <div className="text-center">로딩 중...</div>;
  if (isError) return <div className="text-center text-red-500">에러가 발생했습니다.</div>;

  return (
    <div className="bg-[#242930] rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">할 일 목록</h2>
        <div className="flex items-center">
          <button
            onClick={() => setIsAddingTask(!isAddingTask)}
            className="w-10 h-10 bg-[#1a1f25] rounded-full shadow-dark-neumorphic-button flex items-center justify-center mr-4"
          >
            +
          </button>
          <div className="flex items-center bg-[#1a1f25] rounded-md shadow-dark-neumorphic-inset">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="검색"
              className="p-2 bg-transparent text-white"
            />
            <button className="p-2">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      {isAddingTask && (
        <TaskForm onClose={() => setIsAddingTask(false)} />
      )}
      <table className="w-full">
        <tbody>
          {filteredTasks.map((task) => (
            <React.Fragment key={task.id}>
              <tr className="border-b border-[#2a2f35] cursor-pointer" onClick={() => handleTaskRowClick(task.id)}>
                <td className="p-2" style={{ color: task.completed ? "gray" : "white" }}>
                  {task.title}
                </td>
                <td className="p-2">{task.category}</td>
                <td className="p-2">
                  <button onClick={() => handleDeleteTask(task.id)} className="p-1 bg-[#1a1f25] rounded-md shadow-dark-neumorphic-button">
                    <Trash className="w-4 h-4" />
                  </button>
                </td>
              </tr>
              {editingTaskId === task.id && (
                <tr>
                  <td colSpan={3} className="p-4 bg-[#2a3038]">
                    <TaskForm initialTask={task} onClose={() => setEditingTaskId(null)} onSave={handleSaveClick} />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;