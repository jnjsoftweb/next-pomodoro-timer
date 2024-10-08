"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Play, Pause, Check, List, Music, BarChart, Settings, X, Plus, Trash, Search } from "lucide-react";
import CircularTimer from "./CircularTimer";
import { Task, getTasks, createTask, updateTask, deleteTask } from "../api/tasks";
import { FaEdit, FaPlus, FaClock } from "react-icons/fa";
import Modal from './Modal';
import TaskForm from './TaskForm';
import PomoForm from './PomoForm';

const queryClient = new QueryClient()

const Home: React.FC = () => {
  const [time, setTime] = useState(1500);
  const [totalTime, setTotalTime] = useState(1500);
  const [isActive, setIsActive] = useState(false);
  const [timerType, setTimerType] = useState<"pomodoro" | "rest" | "long">("pomodoro");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState("포모도로 타이머");
  const [popupHeight, setPopupHeight] = useState("auto");
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomButtonsRef = useRef<HTMLDivElement>(null);
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [taskDescription, setTaskDescription] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState<Omit<Task, "id">>({
    title: "",
    description: "",
    createdAt: new Date().toISOString(),
    category: "",
    tags: [],
    priority: "보통",
    completed: false,
    recurrence: "1회",
    executionTime: "",
  });
  const [searchQuery, setSearchQuery] = useState("");

  const [popupStyle, setPopupStyle] = useState({});

  const colors = {
    pomodoro: { path: "#FF6347", background: "#8A2E4B" },
    rest: { path: "#32CD32", background: "#2E5A30" },
    long: { path: "#4169E1", background: "#1A4B7A" },
  };

  const [categories, setCategories] = useState<{ name: string; label: string }[]>([]);
  const [priorities, setPriorities] = useState<{ name: string; label: string }[]>([]);
  const [recurrences, setRecurrences] = useState<{ name: string; label: string }[]>([]);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isPomoModalOpen, setIsPomoModalOpen] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

  useEffect(() => {
    const updatePopupHeight = () => {
      if (containerRef.current && bottomButtonsRef.current) {
        const containerHeight = containerRef.current.clientHeight;
        const bottomButtonsHeight = bottomButtonsRef.current.clientHeight;
        const topButtonHeight = 56; // 상단 버튼의 대적인 높이 (py-3 px-4)
        const spacing = bottomButtonsHeight / 4; // 하단 버튼 높이의 1/4로 간격 줄임
        const newHeight = containerHeight - bottomButtonsHeight - topButtonHeight - spacing;
        setPopupHeight(`${newHeight}px`);
      }
    };

    updatePopupHeight();
    window.addEventListener("resize", updatePopupHeight);

    return () => window.removeEventListener("resize", updatePopupHeight);
  }, []);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTaskDescription(e.target.value);
    adjustTextareaHeight(e.target);
  };

  const adjustTextareaHeight = (element: HTMLTextAreaElement) => {
    element.style.height = "auto";
    element.style.height = element.scrollHeight + "px";
  };

  useEffect(() => {
    if (textareaRef.current) {
      adjustTextareaHeight(textareaRef.current);
    }
  }, [isPopupOpen]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = useCallback((type: "pomodoro" | "rest" | "long") => {
    console.log("Resetting timer to:", type);
    setIsActive(false);
    setTimerType(type);
    switch (type) {
      case "pomodoro":
        setTime(1500);
        setTotalTime(1500);
        break;
      case "rest":
        setTime(300);
        setTotalTime(300);
        break;
      case "long":
        setTime(900);
        setTotalTime(900);
        break;
    }
  }, []);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const calculatePopupStyle = useCallback(() => {
    if (containerRef.current && bottomButtonsRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const bottomButtonsRect = bottomButtonsRef.current.getBoundingClientRect();
      const topOffset = 56 + 32; // '포모도로 타이머' 버튼의 높이 + 2rem
      const bottomOffset = window.innerHeight - bottomButtonsRect.top;

      return {
        position: "fixed" as const,
        top: `${topOffset}px`,
        left: `${containerRect.left}px`,
        right: `${window.innerWidth - containerRect.right}px`,
        bottom: `${bottomOffset}px`,
        width: 'auto',
        maxWidth: '100%',
        backgroundColor: "#1a1f25",
        zIndex: 1000,
        overflowY: "auto" as const,
        borderRadius: "16px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      };
    }
    return {};
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setPopupStyle(calculatePopupStyle());
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [calculatePopupStyle]);

  const toggleDrawer = (drawerName: string) => {
    if (activeDrawer === drawerName) {
      setActiveDrawer(null);
    } else {
      setActiveDrawer(drawerName);
    }
  };

  const activeColor = "#FF6347";

  const getButtonStyle = (drawerName: string) => ({
    backgroundColor: "#1a1f25",
    color: activeDrawer === drawerName ? activeColor : "#ffffff",
    boxShadow:
      activeDrawer === drawerName
        ? "inset 2px 2px 5px rgba(0,0,0,0.2), inset -2px -2px 5px rgba(255,255,255,0.1)"
        : "3px 3px 6px #0f1318, -3px -3px 6px #252b32",
    transition: "all 0.3s ease",
  });

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:3001/tasks");
      if (!response.ok) {
        throw new Error("서버에서 데이터를 가져오는데 실패했습니다.");
      }
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("할일 목록을 불러오는 데 실패했습니다:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    try {
      const createdTask = await createTask(newTask);
      setTasks([...tasks, createdTask]);
      setIsAddingTask(false);
      setNewTask({
        title: "",
        description: "",
        createdAt: new Date().toISOString(),
        category: "",
        tags: [],
        priority: "보통",
        completed: false,
        recurrence: "1회",
        executionTime: "",
      });
    } catch (error) {
      console.error("할일 추가에 실패했습니다:", error);
    }
  };

  const handleUpdateTask = async (id: number, updatedTask: Partial<Task>) => {
    try {
      await updateTask(id, updatedTask);
      fetchTasks();
    } catch (error) {
      console.error("할일 수정에 실패했습니다:", error);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id);
      fetchTasks();
    } catch (error) {
      console.error("할일 삭제에 실패했습니다:", error);
    }
  };

  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  const handleTaskRowClick = (taskId: number) => {
    setEditingTaskId(editingTaskId === taskId ? null : taskId);
  };

  const handleSaveClick = (taskId: number) => {
    const updatedTask = tasks.find((task) => task.id === taskId);
    if (updatedTask) {
      const title = (document.getElementById(`title-${taskId}`) as HTMLInputElement).value;
      const description = (document.getElementById(`description-${taskId}`) as HTMLInputElement).value;
      const category = (document.getElementById(`category-${taskId}`) as HTMLSelectElement).value;
      const tags = (document.getElementById(`tags-${taskId}`) as HTMLInputElement).value.split(",").map((tag) => tag.trim());
      const priority = (document.getElementById(`priority-${taskId}`) as HTMLSelectElement).value;
      const recurrence = (document.getElementById(`recurrence-${taskId}`) as HTMLSelectElement).value;
      const executionTime = (document.getElementById(`executionTime-${taskId}`) as HTMLInputElement).value;
      const completed = (document.getElementById(`completed-${taskId}`) as HTMLInputElement).checked;

      handleUpdateTask(taskId, {
        title,
        description,
        category,
        tags,
        priority,
        recurrence,
        executionTime,
        completed,
      });
    }
    setEditingTaskId(null);
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch("http://localhost:3001/options");
        const data = await response.json();
        setCategories(data.categories);
        setPriorities(data.priorities);
        setRecurrences(data.recurrences);
      } catch (error) {
        console.error("옵션 데이터를 불러오는 데 실패했습니다:", error);
      }
    };

    fetchOptions();
  }, []);

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find((cat) => cat.name === categoryName);
    return category ? category.color : "black";
  };

  const getCategoryLabel = (categoryName: string) => {
    const category = categories.find((cat) => cat.name === categoryName);
    return category ? category.label : categoryName;
  };

  const filteredTasks = tasks.filter((task) => task.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <QueryClientProvider client={queryClient}>
      <div ref={containerRef} className="bg-[#1a1f25] min-h-screen w-full flex flex-col items-center justify-between p-8 text-gray-300 overflow-hidden">
        <div className="w-full relative flex flex-col items-center flex-grow">
          <button
            onClick={togglePopup}
            className="w-full py-3 px-4 mb-4 bg-[#1a1f25] rounded-lg shadow-dark-neumorphic-button text-center text-xl font-bold transition-all duration-300 hover:shadow-dark-neumorphic-button-active"
          >
            {taskTitle}
          </button>

          {isPopupOpen && (
            <div
              className="absolute top-12 left-0 w-full bg-[#1a1f25] bg-opacity-90 rounded-lg shadow-dark-neumorphic-inset p-4 z-20"
              style={{ height: "calc(100% - 8rem)" }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Task 설정</h2>
                <button onClick={togglePopup} className="p-1 rounded-full shadow-dark-neumorphic-button">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="w-full bg-[#2a2f35] text-white p-2 rounded-md shadow-dark-neumorphic-inset mb-4"
                placeholder="Task 제목 입력"
              />
              <textarea
                ref={textareaRef}
                value={taskDescription}
                onChange={handleTextareaChange}
                onFocus={(e) => adjustTextareaHeight(e.target)}
                className="w-full bg-[#2a2f35] text-white p-2 rounded-md shadow-dark-neumorphic-inset mb-4 resize-none overflow-hidden"
                placeholder="Task 설명 입력"
                style={{ minHeight: "100px" }}
              />
            </div>
          )}

          <div className="relative w-64 mx-auto mb-24">
            <CircularTimer
              time={time}
              totalTime={totalTime}
              pathColor={colors[timerType].path}
              backgroundColor={colors[timerType].background}
              onResetTimer={resetTimer}
              timerType={timerType}
            />
            <div className="absolute -bottom-20 w-full flex justify-between">
              <button onClick={toggleTimer} className="w-16 h-16 bg-[#1a1f25] rounded-full flex items-center justify-center shadow-dark-neumorphic-button">
                {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
              <button
                onClick={() => resetTimer(timerType)}
                className="w-16 h-16 bg-[#1a1f25] rounded-full flex items-center justify-center shadow-dark-neumorphic-button"
              >
                <Check className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {activeDrawer && (
          <div style={popupStyle} className="p-6 bg-[#242930] rounded-lg">
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-4 bg-[#2a3038] p-4 rounded-t-lg">
                <h2 className="text-xl font-bold">
                  {activeDrawer === "todo" && "할 일 목록"}
                  {activeDrawer === "music" && "음악 플레이어"}
                  {activeDrawer === "stats" && "생산성 통계"}
                  {activeDrawer === "settings" && "앱 설정"}
                </h2>
                {activeDrawer === "todo" && (
                  <div className="flex items-center">
                    <button
                      onClick={() => setIsAddingTask(!isAddingTask)}
                      className="w-10 h-10 bg-[#1a1f25] rounded-full shadow-dark-neumorphic-button flex items-center justify-center mr-4"
                    >
                      <Plus className="w-6 h-6" />
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
                )}
                <button onClick={() => setActiveDrawer(null)} className="p-1 rounded-full shadow-dark-neumorphic-button">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            {activeDrawer === "todo" && (
              <div className="bg-[#242930] rounded-b-lg p-4">
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
                      <button onClick={handleAddTask} className="p-2 bg-[#1a1f25] rounded-md shadow-dark-neumorphic-button">
                        저장
                      </button>
                    </div>
                  </div>
                )}
                <table className="w-full">
                  <tbody>
                    {filteredTasks.map((task) => (
                      <React.Fragment key={task.id}>
                        <tr className="border-b border-[#2a2f35] cursor-pointer" onClick={() => handleTaskRowClick(task.id!)}>
                          <td className="p-2" style={{ color: task.completed ? "gray" : getCategoryColor(task.category) }}>
                            {task.title}
                          </td>
                          <td className="p-2">{getCategoryLabel(task.category)}</td>
                          <td className="p-2">
                            <button onClick={() => handleDeleteTask(task.id!)} className="p-1 bg-[#1a1f25] rounded-md shadow-dark-neumorphic-button">
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
                                  <input id={`title-${task.id}`} type="text" defaultValue={task.title} className="flex-grow p-2 bg-[#1a1f25] rounded-md" />
                                </div>
                                <div className="flex items-center mb-2">
                                  <label className="w-24 text-white">설명</label>
                                  <input
                                    id={`description-${task.id}`}
                                    type="text"
                                    defaultValue={task.description}
                                    className="flex-grow p-2 bg-[#1a1f25] rounded-md"
                                  />
                                </div>
                                <div className="flex items-center mb-2">
                                  <label className="w-24 text-white">카테고리</label>
                                  <select id={`category-${task.id}`} defaultValue={task.category} className="flex-grow p-2 bg-[#1a1f25] rounded-md">
                                    {categories &&
                                      categories.map((category) => (
                                        <option key={category.name} value={category.name}>
                                          {category.label}
                                        </option>
                                      ))}
                                  </select>
                                </div>
                                <div className="flex items-center mb-2">
                                  <label className="w-24 text-white">태그</label>
                                  <input
                                    id={`tags-${task.id}`}
                                    type="text"
                                    defaultValue={task.tags.join(", ")}
                                    className="flex-grow p-2 bg-[#1a1f25] rounded-md"
                                  />
                                </div>
                                <div className="flex items-center mb-2">
                                  <label className="w-24 text-white">우선순위</label>
                                  <select id={`priority-${task.id}`} defaultValue={task.priority} className="flex-grow p-2 bg-[#1a1f25] rounded-md">
                                    {priorities &&
                                      priorities.map((priority) => (
                                        <option key={priority.name} value={priority.name}>
                                          {priority.label}
                                        </option>
                                      ))}
                                  </select>
                                </div>
                                <div className="flex items-center mb-2">
                                  <label className="w-24 text-white">반복</label>
                                  <select id={`recurrence-${task.id}`} defaultValue={task.recurrence} className="flex-grow p-2 bg-[#1a1f25] rounded-md">
                                    {recurrences &&
                                      recurrences.map((recurrence) => (
                                        <option key={recurrence.name} value={recurrence.name}>
                                          {recurrence.label}
                                        </option>
                                      ))}
                                  </select>
                                </div>
                                <div className="flex items-center mb-2">
                                  <label className="w-24 text-white">실행 시간</label>
                                  <input
                                    id={`executionTime-${task.id}`}
                                    type="text"
                                    defaultValue={task.executionTime}
                                    className="flex-grow p-2 bg-[#1a1f25] rounded-md"
                                  />
                                </div>
                                <div className="flex items-center mb-2">
                                  <label className="w-24 text-white">완료</label>
                                  <input id={`completed-${task.id}`} type="checkbox" defaultChecked={task.completed} className="p-2 bg-[#1a1f25] rounded-md" />
                                </div>
                                <div className="flex justify-end">
                                  <button onClick={() => handleSaveClick(task.id!)} className="p-2 bg-[#1a1f25] rounded-md shadow-dark-neumorphic-button">
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
            )}
            {activeDrawer === "music" && (
              <div>
                <p>음악 플레이어 내용...</p>
              </div>
            )}
            {activeDrawer === "stats" && (
              <div>
                <p>생산성 통계 내용...</p>
              </div>
            )}
            {activeDrawer === "settings" && (
              <div>
                <p>앱 설정 내용...</p>
              </div>
            )}
          </div>
        )}

        <div ref={bottomButtonsRef} className="w-full mt-8 z-10">
          <div className="flex justify-around">
            <button className="flex flex-col items-center" onClick={() => toggleDrawer("todo")}>
              <div className="p-3 rounded-full" style={getButtonStyle("todo")}>
                <List className="w-6 h-6" style={{ color: activeDrawer === "todo" ? activeColor : "#808080" }} />
              </div>
              <span className="text-xs mt-2" style={{ color: activeDrawer === "todo" ? activeColor : "#808080" }}>
                할일
              </span>
            </button>
            <button className="flex flex-col items-center" onClick={() => toggleDrawer("music")}>
              <div className="p-3 rounded-full" style={getButtonStyle("music")}>
                <Music className="w-6 h-6" style={{ color: activeDrawer === "music" ? activeColor : "#808080" }} />
              </div>
              <span className="text-xs mt-2" style={{ color: activeDrawer === "music" ? activeColor : "#808080" }}>
                음악
              </span>
            </button>
            <button className="flex flex-col items-center" onClick={() => toggleDrawer("stats")}>
              <div className="p-3 rounded-full" style={getButtonStyle("stats")}>
                <BarChart className="w-6 h-6" style={{ color: activeDrawer === "stats" ? activeColor : "#808080" }} />
              </div>
              <span className="text-xs mt-2" style={{ color: activeDrawer === "stats" ? activeColor : "#808080" }}>
                통계
              </span>
            </button>
            <button className="flex flex-col items-center" onClick={() => toggleDrawer("settings")}>
              <div className="p-3 rounded-full" style={getButtonStyle("settings")}>
                <Settings className="w-6 h-6" style={{ color: activeDrawer === "settings" ? activeColor : "#808080" }} />
              </div>
              <span className="text-xs mt-2" style={{ color: activeDrawer === "settings" ? activeColor : "#808080" }}>
                설정
              </span>
            </button>
          </div>
        </div>

        <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)}>
          <TaskForm onClose={() => setIsTaskModalOpen(false)} />
        </Modal>

        <Modal isOpen={isPomoModalOpen} onClose={() => setIsPomoModalOpen(false)}>
          <PomoForm onClose={() => setIsPomoModalOpen(false)} />
        </Modal>
      </div>
    </QueryClientProvider>
  );
};

export default Home;