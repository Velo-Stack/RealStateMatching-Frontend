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
import { mapTopAreasToChartData } from "../utils/dashboardUtils";
import CustomTooltip from "./CustomTooltip";

const TopAreasChart = ({ topAreas, areasLoading }) => {
  const currentTheme =
    document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
  const themeColors = CHART_THEME_COLORS[currentTheme];

  if (areasLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (topAreas.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500 text-sm">
        لا توجد بيانات للمناطق
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
        <BarChart data={mapTopAreasToChartData(topAreas)}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={themeColors.cyan} stopOpacity={1} />
              <stop offset="100%" stopColor={themeColors.emerald} stopOpacity={0.8} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={themeColors.grid}
            vertical={false}
          />
          <XAxis
            dataKey="city"
            tick={{ fontSize: 11, fill: themeColors.tickPrimary }}
            axisLine={{ stroke: themeColors.axis }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: themeColors.tickSecondary }}
            axisLine={{ stroke: themeColors.axis }}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: themeColors.cursor }}
            content={<CustomTooltip theme={currentTheme} />}
          />
          <Bar
            dataKey="count"
            name="العروض"
            fill="url(#barGradient)"
            radius={[8, 8, 0, 0]}
            barSize={40}
            isAnimationActive
            animationDuration={700}
            animationEasing="ease-out"
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default TopAreasChart;
