import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Pomo, getPomos, updatePomo, deletePomo } from '../api/pomos';
import { Plus, X } from "lucide-react";
import PomoForm from './PomoForm';

const PomoList: React.FC = () => {
  const [isAddingPomo, setIsAddingPomo] = useState(false);
  const [editingPomoId, setEditingPomoId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data: pomos, isLoading, isError } = useQuery({
    queryKey: ['pomos'],
    queryFn: getPomos
  });

  const updateMutation = useMutation({
    mutationFn: updatePomo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pomos'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePomo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pomos'] });
    },
  });

  const handlePomoRowClick = (pomoId: number) => {
    setEditingPomoId(editingPomoId === pomoId ? null : pomoId);
  };

  const handleSavePomo = (pomoId: number, updatedPomo: Partial<Pomo>) => {
    updateMutation.mutate({ id: pomoId, ...updatedPomo });
    setEditingPomoId(null);
  };

  const handleDeletePomo = (pomoId: number) => {
    deleteMutation.mutate(pomoId);
  };

  if (isLoading) return <div className="text-center">로딩 중...</div>;
  if (isError) return <div className="text-center text-red-500">에러가 발생했습니다.</div>;

  return (
    <div className="bg-[#242930] rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">포모도로 목록</h2>
        <button
          onClick={() => setIsAddingPomo(!isAddingPomo)}
          className="w-10 h-10 bg-[#1a1f25] rounded-full shadow-dark-neumorphic-button flex items-center justify-center"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
      {isAddingPomo && (
        <PomoForm onClose={() => setIsAddingPomo(false)} />
      )}
      <table className="w-full">
        <tbody>
          {pomos?.map((pomo) => (
            <React.Fragment key={pomo.id}>
              <tr className="border-b border-[#2a2f35] cursor-pointer" onClick={() => handlePomoRowClick(pomo.id)}>
                <td className="p-2">Task ID: {pomo.taskId}</td>
                <td className="p-2">상태: {pomo.state}</td>
                <td className="p-2">남은 시간: {Math.floor(pomo.remainingTime / 60)}:{(pomo.remainingTime % 60).toString().padStart(2, '0')}</td>
                <td className="p-2">
                  <button onClick={() => handleDeletePomo(pomo.id)} className="p-1 bg-[#1a1f25] rounded-md shadow-dark-neumorphic-button">
                    <X className="w-4 h-4" />
                  </button>
                </td>
              </tr>
              {editingPomoId === pomo.id && (
                <tr>
                  <td colSpan={4} className="p-4 bg-[#2a3038]">
                    <PomoForm initialPomo={pomo} onClose={() => setEditingPomoId(null)} onSave={handleSavePomo} />
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

export default PomoList;