import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Timer, createTimer, updateTimer } from '../api/timers';

interface TimerFormProps {
  onClose: () => void;
  initialTimer?: Timer;
  onSave?: (id: number, timer: Partial<Timer>) => void;
}

const TimerForm: React.FC<TimerFormProps> = ({ onClose, initialTimer, onSave }) => {
  const [timer, setTimer] = useState<Omit<Timer, 'id'>>({
    taskId: 0,
    startTime: '',
    endTime: '',
    state: 'standby',
    remainingTime: 25 * 60,
    sn: 1,
  });

  useEffect(() => {
    if (initialTimer) {
      setTimer(initialTimer);
    }
  }, [initialTimer]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: initialTimer ? 
      (updatedTimer: Partial<Timer>) => updateTimer(initialTimer.id, updatedTimer) : 
      createTimer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timers'] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (initialTimer && onSave) {
      onSave(initialTimer.id, timer);
    } else {
      mutation.mutate(timer);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTimer(prev => ({ ...prev, [name]: name === 'taskId' || name === 'remainingTime' ? parseInt(value) : value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="taskId" className="block text-sm font-medium text-gray-700">Task ID</label>
        <input
          type="number"
          id="taskId"
          name="taskId"
          value={timer.taskId}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
      </div>
      <div>
        <label htmlFor="remainingTime" className="block text-sm font-medium text-gray-700">Remaining Time (seconds)</label>
        <input
          type="number"
          id="remainingTime"
          name="remainingTime"
          value={timer.remainingTime}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
      </div>
      <div>
        <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
        <select
          id="state"
          name="state"
          value={timer.state}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        >
          <option value="standby">Standby</option>
          <option value="running">Running</option>
          <option value="paused">Paused</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {initialTimer ? '포모도로 수정' : '포모도로 추가'}
      </button>
    </form>
  );
};

export default TimerForm;