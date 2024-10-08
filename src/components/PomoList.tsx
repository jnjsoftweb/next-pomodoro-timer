import React from 'react';
import { Pomo } from '../api/pomos';
import { Trash } from "lucide-react";  // X 대신 Trash 아이콘을 import합니다.

interface PomoListProps {
  pomos: Pomo[];
  isAddingPomo: boolean;
  newPomo: Omit<Pomo, 'id'>;
  setNewPomo: React.Dispatch<React.SetStateAction<Omit<Pomo, 'id'>>>;
  onAddPomo: () => void;
  onCancelAddPomo: () => void;
  editingPomoId: number | null;
  onEditPomo: (id: number) => void;
  onSavePomo: (id: number, pomo: Partial<Pomo>) => void;
  onDeletePomo: (id: number) => void;  // 삭제 함수를 추가합니다.
}

const PomoList: React.FC<PomoListProps> = ({
  pomos,
  isAddingPomo,
  newPomo,
  setNewPomo,
  onAddPomo,
  onCancelAddPomo,
  editingPomoId,
  onEditPomo,
  onSavePomo,
  onDeletePomo  // 삭제 함수를 props로 받습니다.
}) => {
  return (
    <div className="bg-[#242930] rounded-lg p-4">
      {isAddingPomo && (
        <div className="mb-4 p-4 bg-[#2a3038] rounded-md shadow-dark-neumorphic-inset">
          <div className="flex items-center mb-2">
            <label className="w-24 text-white">Task ID</label>
            <input
              type="number"
              value={newPomo.taskId}
              onChange={(e) => setNewPomo({ ...newPomo, taskId: parseInt(e.target.value) })}
              className="flex-grow p-2 bg-[#1a1f25] rounded-md"
            />
          </div>
          <div className="flex items-center mb-2">
            <label className="w-24 text-white">남은 시간 (초)</label>
            <input
              type="number"
              value={newPomo.remainingTime}
              onChange={(e) => setNewPomo({ ...newPomo, remainingTime: parseInt(e.target.value) })}
              className="flex-grow p-2 bg-[#1a1f25] rounded-md"
            />
          </div>
          <div className="flex justify-end">
            <button onClick={onCancelAddPomo} className="p-2 bg-[#1a1f25] rounded-md shadow-dark-neumorphic-button mr-2">
              취소
            </button>
            <button onClick={onAddPomo} className="p-2 bg-[#1a1f25] rounded-md shadow-dark-neumorphic-button">
              저장
            </button>
          </div>
        </div>
      )}
      <table className="w-full">
        <tbody>
          {pomos.map((pomo) => (
            <React.Fragment key={pomo.id}>
              <tr className="border-b border-[#2a2f35] cursor-pointer" onClick={() => onEditPomo(pomo.id)}>
                <td className="p-2">Task ID: {pomo.taskId}</td>
                <td className="p-2">상태: {pomo.state}</td>
                <td className="p-2">남은 시간: {Math.floor(pomo.remainingTime / 60)}:{(pomo.remainingTime % 60).toString().padStart(2, '0')}</td>
                <td className="p-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();  // 이벤트 버블링 방지
                      onDeletePomo(pomo.id);
                    }} 
                    className="p-1 bg-[#1a1f25] rounded-md shadow-dark-neumorphic-button"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </td>
              </tr>
              {editingPomoId === pomo.id && (
                <tr>
                  <td colSpan={4} className="p-4 bg-[#2a3038]">
                    <div className="mb-4 p-4 bg-[#2a3038] rounded-md shadow-dark-neumorphic-inset">
                      <div className="flex items-center mb-2">
                        <label className="w-24 text-white">Task ID</label>
                        <input
                          type="number"
                          value={pomo.taskId}
                          onChange={(e) => onSavePomo(pomo.id, { ...pomo, taskId: parseInt(e.target.value) })}
                          className="flex-grow p-2 bg-[#1a1f25] rounded-md"
                        />
                      </div>
                      <div className="flex items-center mb-2">
                        <label className="w-24 text-white">상태</label>
                        <select
                          value={pomo.state}
                          onChange={(e) => onSavePomo(pomo.id, { ...pomo, state: e.target.value })}
                          className="flex-grow p-2 bg-[#1a1f25] rounded-md"
                        >
                          <option value="standby">대기</option>
                          <option value="running">실행 중</option>
                          <option value="paused">일시 정지</option>
                          <option value="completed">완료</option>
                        </select>
                      </div>
                      <div className="flex items-center mb-2">
                        <label className="w-24 text-white">남은 시간 (초)</label>
                        <input
                          type="number"
                          value={pomo.remainingTime}
                          onChange={(e) => onSavePomo(pomo.id, { ...pomo, remainingTime: parseInt(e.target.value) })}
                          className="flex-grow p-2 bg-[#1a1f25] rounded-md"
                        />
                      </div>
                      <div className="flex justify-end">
                        <button onClick={() => onEditPomo(pomo.id)} className="p-2 bg-[#1a1f25] rounded-md shadow-dark-neumorphic-button">
                          변경 저장
                        </button>
                      </div>
                    </div>
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