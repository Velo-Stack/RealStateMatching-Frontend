import { motion } from "framer-motion";
import { getScoreVisualConfig } from "../utils/matchesUtils";

const MatchDetailsPanel = ({ score }) => {
  const { color, gradient } = getScoreVisualConfig(score);

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`h-full rounded-full ${gradient}`}
        />
      </div>
      <span className={`text-sm font-bold ${color}`}>{score}%</span>
    </div>
  );
};

export default MatchDetailsPanel;
