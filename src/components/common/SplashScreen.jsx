import { useEffect, useState } from "react";

const SplashScreen = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Fast at start, slow near end
        const increment = p < 60 ? 8 : p < 85 ? 4 : 1;
        return Math.min(p + increment, 100);
      });
    }, 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white font-cairo">
      {/* Logo */}
      <div
        className="flex flex-col items-center gap-4"
        style={{ animation: "splashFadeIn 0.6s ease both" }}
      >
        <img
          src="/images/logo.png"
          alt="رواسخ"
          className="h-20 w-auto object-contain select-none"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        <h1
          className="text-3xl font-bold tracking-wider select-none"
          style={{ color: "#9d7857" }}
        >
          رواسخ
        </h1>
        <p className="text-sm text-gray-400 tracking-widest select-none">
          للتطوير العقاري
        </p>
      </div>

      {/* Progress Bar */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100"
        style={{ animation: "splashFadeIn 0.8s ease 0.2s both" }}
      >
        <div
          className="h-full transition-all duration-75 ease-out rounded-r-full"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg, #c4a77d, #9d7857)",
          }}
        />
      </div>

      {/* Pulse dots */}
      <div
        className="flex gap-2 mt-10"
        style={{ animation: "splashFadeIn 1s ease 0.4s both" }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: "#9d7857",
              opacity: 0.4,
              animation: `splashPulse 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes splashFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes splashPulse {
          0%, 100% { opacity: 0.3; transform: scale(0.9); }
          50%       { opacity: 1;   transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
