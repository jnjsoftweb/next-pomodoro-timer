import React, { useState } from 'react';
import { Task } from '../api/tasks';
import { Trash } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  onDeleteTask: (id: number) => void;
  onEditTask: (id: number) => void;
  editingTaskId: number | null;
  onSaveTask: (id: number, task: Partial<Task>) => void;
  isAddingTask: boolean;
  setIsAddingTask: React.Dispatch<React.SetStateAction<boolean>>;
  newTask: Omit<Task, 'id'>;
  setNewTask: React.Dispatch<React.SetStateAction<Omit<Task, 'id'>>>;
  onAddTask: () => void;
  categories: { name: string; label: string }[];
  priorities: { name: string; label: string }[];
  recurrences: { name: string; label: string }[];
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onDeleteTask,
  onEditTask,
  editingTaskId,
  onSaveTask,
  isAddingTask,
  setIsAddingTask,
  newTask,
  setNewTask,
  onAddTask,
  categories,
  priorities,
  recurrences
}) => {
  const [editedTask, setEditedTask] = useState<Partial<Task>>({});

  if (!newTask) {
    return null;
  }

  const getCategoryLabel = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.label : categoryName;
  };

  const handleEditChange = (taskId: number, field: string, value: string | boolean) => {
    setEditedTask(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveClick = (taskId: number) => {
    onSaveTask(taskId, editedTask);
    setEditedTask({});
  };

  return (
    <div className="bg-[#242930] rounded-lg p-4">
      {isAddingTask && (
        <div className="mb-4 p-4 bg-[#2a3038] rounded-md shadow-dark-neumorphic-inset">
          <div className="flex items-center mb-2">
            <label className="w-24 text-white">제목</label>
            <input
              type="text"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="flex-grow p-2 bg-[#1a1f25] rounded-md"
            />
          </div>
          <div className="flex items-center mb-2">
            <label className="w-24 text-white">설명</label>
            <input
              type="text"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="flex-grow p-2 bg-[#1a1f25] rounded-md"
            />
          </div>
          <div className="flex items-center mb-2">
            <label className="w-24 text-white">카테고리</label>
            <select
              value={newTask.category}
              onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
              className="flex-grow p-2 bg-[#1a1f25] rounded-md"
            >
              {categories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center mb-2">
            <label className="w-24 text-white">태그</label>
            <input
              type="text"
              value={newTask.tags.join(", ")}
              onChange={(e) => setNewTask({ ...newTask, tags: e.target.value.split(",").map((tag) => tag.trim()) })}
              className="flex-grow p-2 bg-[#1a1f25] rounded-md"
            />
          </div>
          <div className="flex items-center mb-2">
            <label className="w-24 text-white">우선순위</label>
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              className="flex-grow p-2 bg-[#1a1f25] rounded-md"
            >
              {priorities.map((priority) => (
                <option key={priority.name} value={priority.name}>
                  {priority.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center mb-2">
            <label className="w-24 text-white">반복</label>
            <select
              value={newTask.recurrence}
              onChange={(e) => setNewTask({ ...newTask, recurrence: e.target.value })}
              className="flex-grow p-2 bg-[#1a1f25] rounded-md"
            >
              {recurrences.map((recurrence) => (
                <option key={recurrence.name} value={recurrence.name}>
                  {recurrence.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center mb-2">
            <label className="w-24 text-white">실행 시간</label>
            <input
              type="text"
              value={newTask.executionTime}
              onChange={(e) => setNewTask({ ...newTask, executionTime: e.target.value })}
              className="flex-grow p-2 bg-[#1a1f25] rounded-md"
            />
          </div>
          <div className="flex justify-end">
            <button onClick={() => setIsAddingTask(false)} className="p-2 bg-[#1a1f25] rounded-md shadow-dark-neumorphic-button mr-2">
              취소
            </button>
            <button onClick={onAddTask} className="p-2 bg-[#1a1f25] rounded-md shadow-dark-neumorphic-button">
              저장
            </button>
          </div>
        </div>
      )}
      <table className="w-full">
        <tbody>
          {tasks.map((task) => (
            <React.Fragment key={task.id}>
              <tr className="border-b border-[#2a2f35] cursor-pointer" onClick={() => onEditTask(task.id)}>
                <td className="p-2" style={{ color: task.completed ? "gray" : "white" }}>
                  {task.title}
                </td>
                <td className="p-2">{getCategoryLabel(task.category)}</td>
                <td className="p-2">
                  <button onClick={() => onDeleteTask(task.id)} className="p-1 bg-[#1a1f25] rounded-md shadow-dark-neumorphic-button">
                    <Trash className="w-4 h-4" />
                  </button>
                </td>
              </tr>
              {editingTaskId === task.id && (
                <tr>
                  <td colSpan={3} className="p-4 bg-[#2a3038]">
                    <div className="mb-4 p-4 bg-[#2a3038] rounded-md shadow-dark-neumorphic-inset">
                      <div className="flex items-center mb-2">
                        <label className="w-24 text-white">제목</label>
                        <input
                          type="text"
                          defaultValue={task.title}
                          onChange={(e) => handleEditChange(task.id, 'title', e.target.value)}
                          className="flex-grow p-2 bg-[#1a1f25] rounded-md"
                        />
                      </div>
                      <div className="flex items-center mb-2">
                        <label className="w-24 text-white">설명</label>
                        <input
                          type="text"
                          defaultValue={task.description}
                          onChange={(e) => handleEditChange(task.id, 'description', e.target.value)}
                          className="flex-grow p-2 bg-[#1a1f25] rounded-md"
                        />
                      </div>
                      <div className="flex items-center mb-2">
                        <label className="w-24 text-white">카테고리</label>
                        <select
                          defaultValue={task.category}
                          onChange={(e) => handleEditChange(task.id, 'category', e.target.value)}
                          className="flex-grow p-2 bg-[#1a1f25] rounded-md"
                        >
                          {categories.map((category) => (
                            <option key={category.name} value={category.name}>
                              {category.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center mb-2">
                        <label className="w-24 text-white">태그</label>
                        <input
                          type="text"
                          defaultValue={task.tags.join(", ")}
                          onChange={(e) => handleEditChange(task.id, 'tags', e.target.value.split(",").map(tag => tag.trim()))}
                          className="flex-grow p-2 bg-[#1a1f25] rounded-md"
                        />
                      </div>
                      <div className="flex items-center mb-2">
                        <label className="w-24 text-white">우선순위</label>
                        <select
                          defaultValue={task.priority}
                          onChange={(e) => handleEditChange(task.id, 'priority', e.target.value)}
                          className="flex-grow p-2 bg-[#1a1f25] rounded-md"
                        >
                          {priorities.map((priority) => (
                            <option key={priority.name} value={priority.name}>
                              {priority.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center mb-2">
                        <label className="w-24 text-white">반복</label>
                        <select
                          defaultValue={task.recurrence}
                          onChange={(e) => handleEditChange(task.id, 'recurrence', e.target.value)}
                          className="flex-grow p-2 bg-[#1a1f25] rounded-md"
                        >
                          {recurrences.map((recurrence) => (
                            <option key={recurrence.name} value={recurrence.name}>
                              {recurrence.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center mb-2">
                        <label className="w-24 text-white">실행 시간</label>
                        <input
                          type="text"
                          defaultValue={task.executionTime}
                          onChange={(e) => handleEditChange(task.id, 'executionTime', e.target.value)}
                          className="flex-grow p-2 bg-[#1a1f25] rounded-md"
                        />
                      </div>
                      <div className="flex items-center mb-2">
                        <label className="w-24 text-white">완료</label>
                        <input
                          type="checkbox"
                          defaultChecked={task.completed}
                          onChange={(e) => handleEditChange(task.id, 'completed', e.target.checked)}
                          className="p-2 bg-[#1a1f25] rounded-md"
                        />
                      </div>
                      <div className="flex justify-end">
                        <button onClick={() => handleSaveClick(task.id)} className="p-2 bg-[#1a1f25] rounded-md shadow-dark-neumorphic-button">
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

export default TaskList;