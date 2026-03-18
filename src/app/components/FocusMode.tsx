import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Play, Pause, RotateCcw, Home, Volume2, VolumeX } from 'lucide-react';

type Mode = 'Ready' | 'Study' | 'Break' | 'Finished';
type Sound = 'Rain' | 'Forest' | 'Waves' | 'Cafe' | 'None';

export function FocusMode() {
  const navigate = useNavigate();
  const [studyMinutes, setStudyMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [totalDurationMinutes, setTotalDurationMinutes] = useState(60);
  const [selectedSound, setSelectedSound] = useState<Sound>('Rain');
  
  const [timerRunning, setTimerRunning] = useState(false);
  const [currentSeconds, setCurrentSeconds] = useState(0);
  const [cyclesLeft, setCyclesLeft] = useState(0);
  const [mode, setMode] = useState<Mode>('Ready');
  const [isPaused, setIsPaused] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const startFocusSession = () => {
    if (timerRunning) return;

    if (studyMinutes <= 0 || breakMinutes <= 0 || totalDurationMinutes <= 0) {
      alert('Please enter values greater than 0');
      return;
    }

    setCyclesLeft(totalDurationMinutes);
    setTimerRunning(true);
    setIsPaused(false);
    startStudySession();
    playSound();
  };

  const startStudySession = () => {
    const studyTime = Math.min(studyMinutes, cyclesLeft || totalDurationMinutes);
    setMode('Study');
    setCurrentSeconds(studyTime * 60);
    startCountdown();
  };

  const startBreakSession = () => {
    setMode('Break');
    setCurrentSeconds(breakMinutes * 60);
    startCountdown();
  };

  const startCountdown = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setCurrentSeconds((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          handleSessionEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSessionEnd = () => {
    if (mode === 'Study') {
      const newCyclesLeft = cyclesLeft - studyMinutes;
      setCyclesLeft(newCyclesLeft);

      if (newCyclesLeft <= 0) {
        finishFocusMode();
      } else {
        startBreakSession();
      }
    } else if (mode === 'Break') {
      if (cyclesLeft > 0) {
        startStudySession();
      } else {
        finishFocusMode();
      }
    }
  };

  const finishFocusMode = () => {
    setTimerRunning(false);
    setMode('Finished');
    setCurrentSeconds(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    stopSound();
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setIsPaused(false);
    setCurrentSeconds(0);
    setCyclesLeft(0);
    setMode('Ready');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    stopSound();
  };

  const togglePause = () => {
    if (isPaused) {
      setIsPaused(false);
      startCountdown();
    } else {
      setIsPaused(true);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const playSound = () => {
    if (selectedSound === 'None') return;
    
    // In a real app, you would have actual audio files
    // For now, we'll create a simple frequency for demonstration
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    
    // Note: In production, you'd use actual ambient sound files
    // audioRef.current.src = `/sounds/${selectedSound.toLowerCase()}.mp3`;
    // audioRef.current.loop = true;
    // audioRef.current.play();
  };

  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const minutes = Math.floor(currentSeconds / 60);
  const seconds = currentSeconds % 60;

  return (
    <div className="min-h-screen bg-[#fff5f5]">
      <div className="max-w-3xl mx-auto px-4 py-6 md:py-8">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-[#b4a0a8] text-center mb-3" style={{ fontFamily: 'Georgia, serif' }}>
            Focus Mode
          </h1>
          <p className="text-center text-[#a89099]">
            Set your study timer, break timer, total study duration, and ambient sound.
          </p>
        </div>

        {/* Settings Form */}
        <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 mb-6">
          <div className="bg-[#e8d4d9] rounded-2xl p-6 mb-6">
            <div className="space-y-5">
              <div>
                <label className="block text-[#7d6b73] font-bold mb-2">
                  Study Session Length (minutes)
                </label>
                <input
                  type="number"
                  value={studyMinutes}
                  onChange={(e) => setStudyMinutes(Number(e.target.value))}
                  disabled={timerRunning}
                  className="w-full text-center py-2 px-4 rounded-xl border-2 border-[#b4a0a8]/20 focus:border-[#b4a0a8] outline-none disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-[#7d6b73] font-bold mb-2">
                  Break Length (minutes)
                </label>
                <input
                  type="number"
                  value={breakMinutes}
                  onChange={(e) => setBreakMinutes(Number(e.target.value))}
                  disabled={timerRunning}
                  className="w-full text-center py-2 px-4 rounded-xl border-2 border-[#b4a0a8]/20 focus:border-[#b4a0a8] outline-none disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-[#7d6b73] font-bold mb-2">
                  Total Study Duration (minutes)
                </label>
                <input
                  type="number"
                  value={totalDurationMinutes}
                  onChange={(e) => setTotalDurationMinutes(Number(e.target.value))}
                  disabled={timerRunning}
                  className="w-full text-center py-2 px-4 rounded-xl border-2 border-[#b4a0a8]/20 focus:border-[#b4a0a8] outline-none disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          {/* Ambient Sound Selection */}
          <div className="bg-[#f5e6ea] rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-bold text-[#7d6b73] mb-4 text-center">
              Choose Ambient Sound
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(['Rain', 'Forest', 'Waves', 'Cafe', 'None'] as Sound[]).map((sound) => (
                <button
                  key={sound}
                  onClick={() => setSelectedSound(sound)}
                  className={`py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                    selectedSound === sound
                      ? 'bg-[#b4a0a8] text-white'
                      : 'bg-white text-[#7d6b73] hover:bg-[#e8d4d9]'
                  }`}
                >
                  {sound === 'None' ? (
                    <span className="flex items-center justify-center gap-2">
                      <VolumeX className="w-4 h-4" />
                      None
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Volume2 className="w-4 h-4" />
                      {sound}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Timer Display */}
          <div className="bg-[#e8d4d9] rounded-2xl p-8 mb-6">
            <h3 className="text-xl font-bold text-[#7d6b73] text-center mb-3">Timer Status</h3>
            <p className="text-center text-[#9d8a92] font-bold mb-4">Mode: {mode}</p>
            <div className="text-6xl font-bold text-[#b4a0a8] text-center mb-4">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <p className="text-center text-[#a89099]">
              {mode === 'Ready' && 'Enter your settings and press Start'}
              {mode === 'Study' && `Remaining total study time: ${Math.max(cyclesLeft, 0)} min`}
              {mode === 'Break' && 'Take a break!'}
              {mode === 'Finished' && 'Focus session complete!'}
            </p>
          </div>

          {/* Control Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            {!timerRunning && mode !== 'Finished' && (
              <button
                onClick={startFocusSession}
                className="bg-[#b4a0a8] hover:bg-[#9d8a92] text-white font-bold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Start Focus Session
              </button>
            )}

            {timerRunning && (
              <button
                onClick={togglePause}
                className="bg-[#e8d4d9] hover:bg-[#d4bfc4] text-[#7d6b73] font-bold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center gap-2"
              >
                {isPaused ? (
                  <>
                    <Play className="w-5 h-5" />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause className="w-5 h-5" />
                    Pause
                  </>
                )}
              </button>
            )}

            <button
              onClick={resetTimer}
              className="bg-[#f5e6ea] hover:bg-[#e8d4d9] text-[#7d6b73] font-bold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Reset Timer
            </button>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="w-full bg-white hover:bg-[#f5e6ea] text-[#b4a0a8] font-bold py-4 px-6 rounded-2xl shadow-sm transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <Home className="w-5 h-5" />
          Back to Main Page
        </button>
      </div>
    </div>
  );
}