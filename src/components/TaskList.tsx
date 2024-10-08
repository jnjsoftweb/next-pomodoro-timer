import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Task } from '../api/tasks';

const fetchTasks = async (): Promise<Task[]> => {
  const { data } = await axios.get('http://localhost:3001/tasks');
  return data;
};

const TaskList: React.FC = () => {
  const { data: tasks, isLoading, isError } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks
  });

  if (isLoading) return <div className="text-center">로딩 중...</div>;
  if (isError) return <div className="text-center text-red-500">에러가 발생했습니다.</div>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">할일 목록</h2>
      <ul className="space-y-2">
        {tasks && tasks.map((task: Task) => (
          <li key={task.id} className="p-2 bg-gray-100 rounded">{task.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;