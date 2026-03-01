import { useEffect, useState } from "react";
import { Clock, AlertCircle } from "lucide-react";

export function TestTimer({ initialMinutes, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60); // Convert to seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const getTimerColor = () => {
    const totalSeconds = initialMinutes * 60;
    const percentage = (timeLeft / totalSeconds) * 100;
    
    if (percentage > 50) return "text-green-600";
    if (percentage > 20) return "text-orange-600";
    return "text-red-600";
  };

  const getBackgroundColor = () => {
    const totalSeconds = initialMinutes * 60;
    const percentage = (timeLeft / totalSeconds) * 100;
    
    if (percentage > 50) return "bg-green-50";
    if (percentage > 20) return "bg-orange-50";
    return "bg-red-50";
  };

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${getBackgroundColor()}`}>
      {timeLeft <= 60 && (
        <AlertCircle className={`w-5 h-5 ${getTimerColor()} animate-pulse`} />
      )}
      <Clock className={`w-5 h-5 ${getTimerColor()}`} />
      <div className="flex flex-col">
        <span className="text-xs text-gray-600">Time Left</span>
        <span className={`font-semibold ${getTimerColor()}`}>
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
