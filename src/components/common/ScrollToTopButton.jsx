import { useEffect, useState, useCallback } from "react";
import { ChevronUp } from "lucide-react";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  const handleScroll = useCallback(() => {
    setVisible(window.scrollY > 400);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="ارجع للأعلى"
      className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#9d7857] text-white shadow-[0_8px_30px_rgba(157,120,87,0.4)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#8a6748] hover:shadow-[0_12px_40px_rgba(157,120,87,0.55)] hover:-translate-y-1 hover:scale-105 active:scale-95 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-8 opacity-0"
      }`}
    >
      <ChevronUp size={24} strokeWidth={2.5} />
    </button>
  );
}
