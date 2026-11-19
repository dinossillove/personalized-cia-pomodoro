import React, { useState, useEffect } from 'react';

export default function PomodoroTimer({ topTask, onCompleteTask }) {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 menit
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('Work'); // 'Work' atau 'Break'
  const [currentSet, setCurrentSet] = useState(1);
  const maxSets = 3;

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((time) => time - 1), 1000);
    } else if (isActive && timeLeft === 0) {
      if (mode === 'Work') {
        if (currentSet < maxSets) {
          setMode('Break');
          setTimeLeft(5 * 60); // Istirahat 5 menit
          alert('Waktunya istirahat 5 menit! 🥤');
        } else {
          setIsActive(false);
          alert('Wah hebat! 3 Set Pomodoro selesai untuk tugas ini! 🌸💖');
        }
      } else {
        setMode('Work');
        setTimeLeft(25 * 60);
        setCurrentSet((set) => set + 1);
        alert('Ayo fokus lagi, set berikutnya dimulai! 💪');
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, currentSet]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setMode('Work');
    setCurrentSet(1);
    setTimeLeft(25 * 60);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="w-full max-w-xl text-center relative z-10">
      <div className="washi-tape"></div>
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-3xl shadow-sm border-2 border-pink-100 relative min-w-0">
        
        <h2 className="font-caveat text-3xl sm:text-4xl text-pink-600 mb-2 font-bold">Target Sekarang:</h2>
        <div className="bg-pink-100 text-pink-800 text-base sm:text-xl md:text-2xl font-bold py-3 px-4 sm:px-6 rounded-2xl inline-block mb-6 transform sm:-rotate-1 max-w-full break-words">
          {topTask ? topTask.title : 'Belum ada tugas dipilih — pilih dari My Task List'}
        </div>

        {topTask && (
          <>
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3].map((set) => (
                <div 
                  key={set} 
                  className={`h-3 sm:h-4 w-10 sm:w-12 rounded-full transition-all ${
                    set < currentSet ? 'bg-green-400' : set === currentSet ? 'bg-pink-500 animate-pulse' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <p className="text-pink-400 font-bold mb-4">Set {currentSet} dari {maxSets} • Sesi {mode}</p>

            <div className="w-full max-w-md bg-gray-900 border-4 sm:border-8 border-pink-300 rounded-3xl p-4 sm:p-6 inline-block mb-6 shadow-inner">
              <span className={`block text-[clamp(2.75rem,16vw,4.5rem)] md:text-7xl font-mono tracking-normal sm:tracking-wider leading-none ${mode === 'Work' ? 'text-green-400' : 'text-blue-400'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <button 
                onClick={toggleTimer}
                className="w-full sm:w-auto bg-pink-400 hover:bg-pink-500 text-white font-bold py-3 px-6 rounded-full shadow-[0_4px_0_#be185d] active:shadow-none active:translate-y-1 transition-all"
              >
                {isActive ? 'Pause ⏸️' : 'Start ▶️'}
              </button>
              <button 
                onClick={resetTimer}
                className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-5 rounded-full shadow-[0_4px_0_#9ca3af] active:shadow-none active:translate-y-1 transition-all"
              >
                Reset 🔄
              </button>
            </div>

            <div className="mt-6">
              <button 
                onClick={() => { onCompleteTask(topTask.id); resetTimer(); }}
                className="text-pink-500 hover:text-pink-700 font-caveat text-xl sm:text-2xl border-b-2 border-pink-400 border-dashed pb-1"
              >
                + Tandai Tugas Ini Selesai ✔️
              </button>
            </div>
          </>
        )}
      </div>
      
      <div className="absolute -bottom-10 -right-10 text-7xl opacity-30 rotate-12 pointer-events-none">🧸</div>
      <div className="absolute -top-6 -left-6 text-6xl opacity-30 -rotate-12 pointer-events-none">🎀</div>
    </div>
  );
}
