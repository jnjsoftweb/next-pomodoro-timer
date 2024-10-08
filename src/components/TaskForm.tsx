import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Task } from '../api/tasks';

interface TaskFormProps {
  onClose: () => void;
  initialTask?: Task;
}

const createTask = async (task: Omit<Task, 'id'>) => {
  const { data } = await axios.post('http://localhost:3001/tasks', task);
  return data;
};

const updateTask = async (task: Task) => {
  const { data } = await axios.put(`http://localhost:3001/tasks/${task.id}`, task);
  return data;
};

const TaskForm: React.FC<TaskFormProps> = ({ onClose, initialTask }) => {
  const [task, setTask] = useState<Omit<Task, 'id'>>({
    title: '',
    description: '',
    category: '',
    tags: [],
    priority: 'Medium',
    recurrence: 'Daily',
    executionTime: '',
    isPomo: true,
    completed: false,
  });

  useEffect(() => {
    if (initialTask) {
      setTask(initialTask);
    }
  }, [initialTask]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: initialTask ? updateTask : createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(task as any);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTask(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">제목</label>
        <input
          type="text"
          id="title"
          name="title"
          value={task.title}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">설명</label>
        <textarea
          id="description"
          name="description"
          value={task.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">카테고리</label>
        <select
          id="category"
          name="category"
          value={task.category}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">선택하세요</option>
          <option value="Work">업무</option>
          <option value="Personal">개인</option>
          <option value="Hobby">취미</option>
        </select>
      </div>
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">태그</label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={task.tags.join(', ')}
          onChange={(e) => setTask(prev => ({ ...prev, tags: e.target.value.split(',').map(tag => tag.trim()) }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">우선순위</label>
        <select
          id="priority"
          name="priority"
          value={task.priority}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="High">높음</option>
          <option value="Medium">중간</option>
          <option value="Low">낮음</option>
        </select>
      </div>
      <div>
        <label htmlFor="recurrence" className="block text-sm font-medium text-gray-700">반복</label>
        <select
          id="recurrence"
          name="recurrence"
          value={task.recurrence}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="Daily">매일</option>
          <option value="Weekly">매주</option>
          <option value="Monthly">매월</option>
        </select>
      </div>
      <div>
        <label htmlFor="executionTime" className="block text-sm font-medium text-gray-700">실행 시간</label>
        <input
          type="text"
          id="executionTime"
          name="executionTime"
          value={task.executionTime}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          placeholder="예: 09:00-10:00"
        />
      </div>
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            name="isPomo"
            checked={task.isPomo}
            onChange={(e) => setTask(prev => ({ ...prev, isPomo: e.target.checked }))}
            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <span className="ml-2 text-sm text-gray-700">포모도로 타이머 사용</span>
        </label>
      </div>
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {initialTask ? '할일 수정' : '할일 추가'}
      </button>
    </form>
  );
};

export default TaskForm;