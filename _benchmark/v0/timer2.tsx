import { Play, Pause, Square, RotateCcw, Globe, Clock, Bed, Stopwatch } from "lucide-react";
import

export default function DarkNeumorphicTimerUI() {
  return (
    <div className="bg-[#1a1f25] min-h-screen w-full flex flex-col items-center justify-between p-8 text-gray-300">
      <div className="w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Timer</h1>
        <div className="relative w-64 h-64 mx-auto">
          <div className="absolute inset-0 rounded-full shadow-dark-neumorphic-inset"></div>
          <div className="absolute top-0 left-0 w-64 h-64">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="48"
                fill="none"
                stroke="#00e5ff"
                strokeWidth="4"
                strokeDasharray="301.59"
                strokeDashoffset="226.19"
                transform="rotate(-90 50 50)"
              />
            </svg>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold mb-2">28:16</span>
            <span className="text-xs text-gray-500">10:11</span>
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="flex justify-between items-center mb-8">
          <span className="text-sm text-gray-500">When Timer Ends</span>
          <span className="text-sm text-gray-500 flex items-center">
            Radar
            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>

        <div className="flex justify-around mb-12">
          <button className="w-16 h-16 bg-[#1a1f25] rounded-full flex items-center justify-center shadow-dark-neumorphic-button">
            <Square className="w-6 h-6" />
          </button>
          <button className="w-16 h-16 bg-[#1a1f25] rounded-full flex items-center justify-center shadow-dark-neumorphic-button">
            <Pause className="w-6 h-6" />
          </button>
          <button className="w-16 h-16 bg-[#1a1f25] rounded-full flex items-center justify-center shadow-dark-neumorphic-button">
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>

        <div className="flex justify-around">
          <button className="flex flex-col items-center">
            <div className="p-3 rounded-full shadow-dark-neumorphic-button">
              <Globe className="w-6 h-6 text-gray-500" />
            </div>
            <span className="text-xs text-gray-500 mt-2">World Clock</span>
          </button>
          <button className="flex flex-col items-center">
            <div className="p-3 rounded-full shadow-dark-neumorphic-button">
              <Clock className="w-6 h-6 text-gray-500" />
            </div>
            <span className="text-xs text-gray-500 mt-2">Alarm</span>
          </button>
          <button className="flex flex-col items-center">
            <div className="p-3 rounded-full shadow-dark-neumorphic-button">
              <Bed className="w-6 h-6 text-gray-500" />
            </div>
            <span className="text-xs text-gray-500 mt-2">Bedtime</span>
          </button>
          <button className="flex flex-col items-center">
            <div className="p-3 rounded-full shadow-dark-neumorphic-button">
              <Stopwatch className="w-6 h-6 text-gray-500" />
            </div>
            <span className="text-xs text-gray-500 mt-2">Stopwatch</span>
          </button>
          <button className="flex flex-col items-center">
            <div className="p-3 rounded-full shadow-dark-neumorphic-button-active">
              <Clock className="w-6 h-6 text-[#00e5ff]" />
            </div>
            <span className="text-xs text-[#00e5ff] mt-2">Timer</span>
          </button>
        </div>
      </div>
    </div>
  );
}