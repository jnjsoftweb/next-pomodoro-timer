import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

type TimerType = "pomodoro" | "rest" | "long";

interface CircularTimerProps {
  time: number;
  totalTime: number;
  pathColor: string;
  backgroundColor: string;
  onResetTimer: (type: TimerType) => void;
  timerType: TimerType;
}

const CircularTimer: React.FC<CircularTimerProps> = ({ time, totalTime, pathColor, backgroundColor, onResetTimer, timerType }) => {
  const percentage = ((totalTime - time) / totalTime) * 100;

  const handleButtonClick = (type: TimerType, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onResetTimer(type);
  };

  const getButtonStyle = (type: TimerType) => ({
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "#1a1f25",
    color: timerType === type ? pathColor : "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: timerType === type ? "bold" : "normal",
    cursor: "pointer",
    border: "none",
    outline: "none",
    zIndex: 10,
    boxShadow:
      timerType === type ? "inset 2px 2px 5px rgba(0,0,0,0.2), inset -2px -2px 5px rgba(255,255,255,0.1)" : "3px 3px 6px #0f1318, -3px -3px 6px #252b32",
    transition: "all 0.3s ease",
    textShadow: timerType === type ? `0 0 10px ${pathColor}, 0 0 20px ${pathColor}, 0 0 30px ${pathColor}` : "none",
  });

  return (
    <div className="relative w-64 h-64">
      <div className="absolute inset-0 rounded-full shadow-dark-neumorphic-inset"></div>
      <CircularProgressbar
        value={percentage}
        text=""
        styles={buildStyles({
          pathTransitionDuration: 0.5,
          pathColor: pathColor,
          trailColor: "#2a2f35",
          backgroundColor: backgroundColor,
          rotation: 0,
          strokeLinecap: "butt",
          pathTransition: "none",
        })}
        strokeWidth={8}
      />
      <div className="absolute inset-0 flex items-center justify-center mb-12">
        <span className="text-6xl font-bold" style={{ color: pathColor }}>
          {`${Math.floor(time / 60)}:${(time % 60).toString().padStart(2, "0")}`}
        </span>
      </div>
      <div className="absolute bottom-16 left-0 right-0 flex justify-between px-14">
        <button onClick={(e) => handleButtonClick("pomodoro", e)} style={getButtonStyle("pomodoro")}>
          P
        </button>
        <button onClick={(e) => handleButtonClick("rest", e)} style={getButtonStyle("rest")}>
          R
        </button>
        <button onClick={(e) => handleButtonClick("long", e)} style={getButtonStyle("long")}>
          L
        </button>
      </div>
    </div>
  );
};

export default CircularTimer;