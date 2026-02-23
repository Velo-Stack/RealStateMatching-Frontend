import { motion } from "framer-motion";
import { getScoreVisualConfig } from "../utils/matchesUtils";

const MatchDetailsPanel = ({ score, shouldAnimate = true }) => {
  const { color, gradient } = getScoreVisualConfig(score);

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={shouldAnimate ? { width: 0 } : false}
          animate={{ width: `${score}%` }}
          transition={shouldAnimate ? { duration: 0.5, delay: 0.2 } : { duration: 0 }}
          className={`h-full rounded-full ${gradient}`}
        />
      </div>
      <span className={`text-sm font-bold ${color}`}>{score}%</span>
    </div>
  );
};

export default MatchDetailsPanel;
