import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface PomoFormProps {
  onClose: () => void;
}

interface Pomo {
  taskId: number;
  startTime: string;
  endTime: string;
  state: string;
  remainingTime: number;
  sn: number;
}

const createPomo = async (pomo: Pomo) => {
  const { data } = await axios.post('http://localhost:3001/pomos', pomo);
  return data;
};

const PomoForm: React.FC<PomoFormProps> = ({ onClose }) => {
  const [taskId, setTaskId] = useState('');
  const [remainingTime, setRemainingTime] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation<unknown, Error, Pomo>({
    mutationFn: createPomo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pomos'] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      taskId: parseInt(taskId),
      startTime: '',
      endTime: '',
      state: 'standby',
      remainingTime: parseInt(remainingTime),
      sn: 1,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="taskId" className="block text-sm font-medium text-gray-700">
          Task ID
        </label>
        <input
          type="number"
          id="taskId"
          value={taskId}
          onChange={(e) => setTaskId(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
      </div>
      <div>
        <label htmlFor="remainingTime" className="block text-sm font-medium text-gray-700">
          Remaining Time (minutes)
        </label>
        <input
          type="number"
          id="remainingTime"
          value={remainingTime}
          onChange={(e) => setRemainingTime(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        포모도로 추가
      </button>
    </form>
  );
};

export default PomoForm;