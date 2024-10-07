"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, Check, List, Music, BarChart, Settings, X } from "lucide-react";
import CircularTimer from "../components/CircularTimer";

const Home: React.FC = () => {
  const [time, setTime] = useState(1500);
  const [totalTime, setTotalTime] = useState(1500);
  const [isActive, setIsActive] = useState(false);
  const [timerType, setTimerType] = useState<'pomodoro' | 'rest' | 'long'>('pomodoro');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState("포모도로 타이머");
  const [popupHeight, setPopupHeight] = useState('auto');
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomButtonsRef = useRef<HTMLDivElement>(null);
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [taskDescription, setTaskDescription] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const colors = {
    pomodoro: { path: "#FF6347", background: "#8A2E4B" },
    rest: { path: "#32CD32", background: "#2E5A30" },
    long: { path: "#4169E1", background: "#1A4B7A" },
  };

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
        const topButtonHeight = 56; // 상단 버튼의 대략적인 높이 (py-3 px-4)
        const spacing = bottomButtonsHeight / 4; // 하단 버튼 높이의 1/4로 간격 줄임
        const newHeight = containerHeight - bottomButtonsHeight - topButtonHeight - spacing;
        setPopupHeight(`${newHeight}px`);
      }
    };

    updatePopupHeight();
    window.addEventListener('resize', updatePopupHeight);

    return () => window.removeEventListener('resize', updatePopupHeight);
  }, []);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTaskDescription(e.target.value);
    adjustTextareaHeight(e.target);
  };

  const adjustTextareaHeight = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto';
    element.style.height = (element.scrollHeight) + 'px';
  };

  useEffect(() => {
    if (textareaRef.current) {
      adjustTextareaHeight(textareaRef.current);
    }
  }, [isPopupOpen]); // 팝업이 열릴 때마다 높이 조정

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = useCallback((type: 'pomodoro' | 'rest' | 'long') => {
    console.log('Resetting timer to:', type);
    setIsActive(false);
    setTimerType(type);
    switch (type) {
      case 'pomodoro':
        setTime(1500);
        setTotalTime(1500);
        break;
      case 'rest':
        setTime(300);
        setTotalTime(300);
        break;
      case 'long':
        setTime(900);
        setTotalTime(900);
        break;
    }
  }, []);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const toggleDrawer = (drawerName: string) => {
    if (activeDrawer === drawerName) {
      setActiveDrawer(null);
    } else {
      setActiveDrawer(drawerName);
    }
  };

  const activeColor = "#FF6347"; // 연분홍 계열 색상

  const getButtonStyle = (drawerName: string) => ({
    backgroundColor: '#1a1f25',
    color: activeDrawer === drawerName ? activeColor : '#ffffff',
    boxShadow: activeDrawer === drawerName 
      ? 'inset 2px 2px 5px rgba(0,0,0,0.2), inset -2px -2px 5px rgba(255,255,255,0.1)'
      : '3px 3px 6px #0f1318, -3px -3px 6px #252b32',
    transition: 'all 0.3s ease',
  });

  return (
    <div ref={containerRef} className="bg-[#1a1f25] min-h-screen w-full flex flex-col items-center justify-between p-8 text-gray-300 overflow-hidden">
      <div className="w-full relative flex flex-col items-center flex-grow">
        <button
          onClick={togglePopup}
          className="w-full py-3 px-4 mb-4 bg-[#1a1f25] rounded-lg shadow-dark-neumorphic-button text-center text-xl font-bold transition-all duration-300 hover:shadow-dark-neumorphic-button-active"
        >
          {taskTitle}
        </button>
        
        {/* Task 설정 팝업 */}
        {isPopupOpen && (
          <div className="absolute top-12 left-0 w-full bg-[#1a1f25] bg-opacity-90 rounded-lg shadow-dark-neumorphic-inset p-4 z-20" style={{height: 'calc(100% - 8rem)'}}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Task 설정</h2>
              <button 
                onClick={togglePopup}
                className="p-1 rounded-full shadow-dark-neumorphic-button"
              >
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
              style={{ minHeight: '100px' }}
            />
          </div>
        )}

        <div className="relative w-64 mx-auto">
          <CircularTimer 
            time={time} 
            totalTime={totalTime} 
            pathColor={colors[timerType].path} 
            backgroundColor={colors[timerType].background}
            onResetTimer={(type) => {
              console.log('onResetTimer called from Home component with type:', type);
              resetTimer(type);
            }}
            timerType={timerType}
          />
          <div className="absolute -bottom-20 w-full flex justify-between">
            <button onClick={toggleTimer} className="w-16 h-16 bg-[#1a1f25] rounded-full flex items-center justify-center shadow-dark-neumorphic-button">
              {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
            <button onClick={() => resetTimer(timerType)} className="w-16 h-16 bg-[#1a1f25] rounded-full flex items-center justify-center shadow-dark-neumorphic-button">
              <Check className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* 드로어 */}
        <div 
          className={`absolute left-0 right-0 bg-[#1a1f25] transition-all duration-300 ease-in-out rounded-t-3xl shadow-dark-neumorphic-button ${
            activeDrawer ? 'bottom-0' : 'bottom-[-100%]'
          }`} 
          style={{
            height: activeDrawer ? 'calc(100% - 28rem)' : '0',
            maxHeight: 'calc(100% - 28rem)'
          }}
        >
          <div className="p-6 h-full overflow-y-auto">
            {activeDrawer === 'todo' && (
              <div>
                <h2 className="text-xl font-bold mb-4">할 일 목록</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
              </div>
            )}
            {activeDrawer === 'music' && (
              <div>
                <h2 className="text-xl font-bold mb-4">음악 플레이어</h2>
                <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
              </div>
            )}
            {activeDrawer === 'stats' && (
              <div>
                <h2 className="text-xl font-bold mb-4">생산성 통계</h2>
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
              </div>
            )}
            {activeDrawer === 'settings' && (
              <div>
                <h2 className="text-xl font-bold mb-4">앱 설정</h2>
                <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div ref={bottomButtonsRef} className="w-full mt-8 z-10">
        <div className="flex justify-around">
          <button className="flex flex-col items-center" onClick={() => toggleDrawer('todo')}>
            <div className="p-3 rounded-full" style={getButtonStyle('todo')}>
              <List className="w-6 h-6" style={{ color: activeDrawer === 'todo' ? activeColor : '#808080' }} />
            </div>
            <span className="text-xs mt-2" style={{ color: activeDrawer === 'todo' ? activeColor : '#808080' }}>할일</span>
          </button>
          <button className="flex flex-col items-center" onClick={() => toggleDrawer('music')}>
            <div className="p-3 rounded-full" style={getButtonStyle('music')}>
              <Music className="w-6 h-6" style={{ color: activeDrawer === 'music' ? activeColor : '#808080' }} />
            </div>
            <span className="text-xs mt-2" style={{ color: activeDrawer === 'music' ? activeColor : '#808080' }}>음악</span>
          </button>
          <button className="flex flex-col items-center" onClick={() => toggleDrawer('stats')}>
            <div className="p-3 rounded-full" style={getButtonStyle('stats')}>
              <BarChart className="w-6 h-6" style={{ color: activeDrawer === 'stats' ? activeColor : '#808080' }} />
            </div>
            <span className="text-xs mt-2" style={{ color: activeDrawer === 'stats' ? activeColor : '#808080' }}>통계</span>
          </button>
          <button className="flex flex-col items-center" onClick={() => toggleDrawer('settings')}>
            <div className="p-3 rounded-full" style={getButtonStyle('settings')}>
              <Settings className="w-6 h-6" style={{ color: activeDrawer === 'settings' ? activeColor : '#808080' }} />
            </div>
            <span className="text-xs mt-2" style={{ color: activeDrawer === 'settings' ? activeColor : '#808080' }}>설정</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;