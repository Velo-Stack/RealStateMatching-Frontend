import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_THEME_COLORS } from "../constants/dashboardConstants";
import CustomTooltip from "./CustomTooltip";

const TopBrokersChart = ({ topBrokers, brokersLoading }) => {
  const currentTheme =
    document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
  const themeColors = CHART_THEME_COLORS[currentTheme];

  if (brokersLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (topBrokers.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500 text-sm">
        لا توجد بيانات للسماسرة
      </div>
    );
  }

  return (
    <motion.div
      className="h-64"
      initial={{ opacity: 0, y: 8, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35 }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={topBrokers} layout="vertical">
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={themeColors.grid}
            horizontal={false}
          />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: themeColors.tickSecondary }}
            axisLine={{ stroke: themeColors.axis }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 11, fill: themeColors.tickPrimary }}
            axisLine={{ stroke: themeColors.axis }}
            tickLine={false}
            width={80}
          />
          <Tooltip
            cursor={{ fill: themeColors.cursor }}
            content={<CustomTooltip theme={currentTheme} />}
          />
          <Bar
            dataKey="count"
            name="الصفقات"
            fill={themeColors.emerald}
            radius={[0, 8, 8, 0]}
            barSize={20}
            isAnimationActive
            animationDuration={700}
            animationEasing="ease-out"
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default TopBrokersChart;
