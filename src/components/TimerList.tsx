import React from 'react';
import { Timer } from '../api/timers';
import { Trash } from "lucide-react";  // X 대신 Trash 아이콘을 import합니다.

interface TimerListProps {
  timers: Timer[];
  isAddingTimer: boolean;
  newTimer: Omit<Timer, 'id'>;
  setNewTimer: React.Dispatch<React.SetStateAction<Omit<Timer, 'id'>>>;
  onAddTimer: () => void;
  onCancelAddTimer: () => void;
  editingTimerId: number | null;
  onEditTimer: (id: number) => void;
  onSaveTimer: (id: number, timer: Partial<Timer>) => void;
  onDeleteTimer: (id: number) => void;  // 삭제 함수를 추가합니다.
}

const TimerList: React.FC<TimerListProps> = ({
  timers,
  isAddingTimer,
  newTimer,
  setNewTimer,
  onAddTimer,
  onCancelAddTimer,
  editingTimerId,
  onEditTimer,
  onSaveTimer,
  onDeleteTimer  // 삭제 함수를 props로 받습니다.
}) => {
  return (
    <div className="bg-[#242930] rounded-lg p-4">
      {isAddingTimer && (
        <div className="mb-4 p-4 bg-[#2a3038] rounded-md shadow-dark-neumorphic-inset">
          <div className="flex items-center mb-2">
            <label className="w-24 text-white">Task ID</label>
            <input
              type="number"
              value={newTimer.taskId}
              onChange={(e) => setNewTimer({ ...newTimer, taskId: parseInt(e.target.value) })}
              className="flex-grow p-2 bg-[#1a1f25] rounded-md"
            />
          </div>
          <div className="flex items-center mb-2">
            <label className="w-24 text-white">남은 시간 (초)</label>
            <input
              type="number"
              value={newTimer.remainingTime}
              onChange={(e) => setNewTimer({ ...newTimer, remainingTime: parseInt(e.target.value) })}
              className="flex-grow p-2 bg-[#1a1f25] rounded-md"
            />
          </div>
          <div className="flex justify-end">
            <button onClick={onCancelAddTimer} className="p-2 bg-[#1a1f25] rounded-md shadow-dark-neumorphic-button mr-2">
              취소
            </button>
            <button onClick={onAddTimer} className="p-2 bg-[#1a1f25] rounded-md shadow-dark-neumorphic-button">
              저장
            </button>
          </div>
        </div>
      )}
      <table className="w-full">
        <tbody>
          {timers.map((timer) => (
            <React.Fragment key={timer.id}>
              <tr className="border-b border-[#2a2f35] cursor-pointer" onClick={() => onEditTimer(timer.id)}>
                <td className="p-2">Task ID: {timer.taskId}</td>
                <td className="p-2">상태: {timer.state}</td>
                <td className="p-2">남은 시간: {Math.floor(timer.remainingTime / 60)}:{(timer.remainingTime % 60).toString().padStart(2, '0')}</td>
                <td className="p-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();  // 이벤트 버블링 방지
                      onDeleteTimer(timer.id);
                    }} 
                    className="p-1 bg-[#1a1f25] rounded-md shadow-dark-neumorphic-button"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </td>
              </tr>
              {editingTimerId === timer.id && (
                <tr>
                  <td colSpan={4} className="p-4 bg-[#2a3038]">
                    <div className="mb-4 p-4 bg-[#2a3038] rounded-md shadow-dark-neumorphic-inset">
                      <div className="flex items-center mb-2">
                        <label className="w-24 text-white">Task ID</label>
                        <input
                          type="number"
                          value={timer.taskId}
                          onChange={(e) => onSaveTimer(timer.id, { ...timer, taskId: parseInt(e.target.value) })}
                          className="flex-grow p-2 bg-[#1a1f25] rounded-md"
                        />
                      </div>
                      <div className="flex items-center mb-2">
                        <label className="w-24 text-white">상태</label>
                        <select
                          value={timer.state}
                          onChange={(e) => onSaveTimer(timer.id, { ...timer, state: e.target.value })}
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
                          value={timer.remainingTime}
                          onChange={(e) => onSaveTimer(timer.id, { ...timer, remainingTime: parseInt(e.target.value) })}
                          className="flex-grow p-2 bg-[#1a1f25] rounded-md"
                        />
                      </div>
                      <div className="flex justify-end">
                        <button onClick={() => onEditTimer(timer.id)} className="p-2 bg-[#1a1f25] rounded-md shadow-dark-neumorphic-button">
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

export default TimerList;