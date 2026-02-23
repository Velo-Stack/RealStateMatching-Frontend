import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_THEME_COLORS } from "../constants/dashboardConstants";
import { mapTopAreasToChartData } from "../utils/dashboardUtils";
import CustomTooltip from "./CustomTooltip";

const CHART_HEIGHT = 256;

const TopAreasChart = ({ topAreas, areasLoading }) => {
  const chartContainerRef = useRef(null);
  const [chartSize, setChartSize] = useState({ width: -1, height: -1 });
  const hasChartSize = chartSize.width > 0 && chartSize.height > 0;
  const currentTheme =
    document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
  const themeColors = CHART_THEME_COLORS[currentTheme];

  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return undefined;

    const updateChartSizeState = () => {
      const { width, height } = container.getBoundingClientRect();
      const nextWidth = Math.round(width);
      const nextHeight = Math.round(height);
      setChartSize((prev) =>
        prev.width === nextWidth && prev.height === nextHeight
          ? prev
          : { width: nextWidth, height: nextHeight },
      );
    };

    updateChartSizeState();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateChartSizeState);
      return () => {
        window.removeEventListener("resize", updateChartSizeState);
      };
    }

    const resizeObserver = new ResizeObserver(updateChartSizeState);
    resizeObserver.observe(container);
    window.addEventListener("resize", updateChartSizeState);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateChartSizeState);
    };
  }, [areasLoading, topAreas.length]);

  if (areasLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="w-8 h-8 border-amber-500/30 border-t-amber-500 border-2 rounded-full animate-spin" />
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
      ref={chartContainerRef}
      className="h-64 min-h-[16rem] w-full min-w-0"
      initial={{ opacity: 0, y: 8, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35 }}
    >
      {hasChartSize ? (
        <BarChart
          width={chartSize.width}
          height={CHART_HEIGHT}
          data={mapTopAreasToChartData(topAreas)}
        >
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
      ) : (
        <div className="h-full w-full" aria-hidden="true" />
      )}
    </motion.div>
  );
};

export default TopAreasChart;
