import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Pomo {
  id: number;
  taskId: number;
  startTime: string;
  endTime: string;
  state: string;
  remainingTime: number;
  sn: number;
}

const fetchPomos = async (): Promise<Pomo[]> => {
  const { data } = await axios.get('http://localhost:3001/pomos');
  return data;
};

const PomoList: React.FC = () => {
  const { data: pomos, isLoading, isError } = useQuery({
    queryKey: ['pomos'],
    queryFn: fetchPomos
  });

  if (isLoading) return <div className="text-center">로딩 중...</div>;
  if (isError) return <div className="text-center text-red-500">에러가 발생했습니다.</div>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">포모도로 목록</h2>
      <ul className="space-y-2">
        {pomos && pomos.map((pomo: Pomo) => (
          <li key={pomo.id} className="p-2 bg-gray-100 rounded">
            Task ID: {pomo.taskId}, State: {pomo.state}, Remaining Time: {pomo.remainingTime}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PomoList;