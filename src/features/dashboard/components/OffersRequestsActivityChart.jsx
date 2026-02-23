import { useEffect, useMemo, useRef, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_THEME_COLORS } from "../constants/dashboardConstants";
import { buildActivitySeries, getPeakDay } from "../utils/dashboardUtils";
import CustomTooltip from "./CustomTooltip";

const CHART_HEIGHT = 256;

const OffersRequestsActivityChart = ({ offers, requests, loading }) => {
  const chartContainerRef = useRef(null);
  const [chartSize, setChartSize] = useState({ width: -1, height: -1 });
  const hasChartSize = chartSize.width > 0 && chartSize.height > 0;
  const currentTheme =
    document.documentElement.getAttribute("data-theme") === "light"
      ? "light"
      : "dark";
  const themeColors = CHART_THEME_COLORS[currentTheme];

  const series = useMemo(
    () => buildActivitySeries(offers, requests),
    [offers, requests],
  );

  const offersPeak = useMemo(() => getPeakDay(series, "offers"), [series]);
  const requestsPeak = useMemo(() => getPeakDay(series, "requests"), [series]);

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
  }, [loading, series.length]);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="w-8 h-8 border-amber-500/30 border-t-amber-500 border-2 rounded-full animate-spin" />
      </div>
    );
  }

  if (!series.length) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500 text-sm">
        لا توجد بيانات كافية لعرض النشاط
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4 text-xs text-slate-500">
        <span className="px-2 py-1 rounded-lg bg-white/5 border border-white/10">
          أكثر يوم نشاطًا للعروض: {offersPeak.label}
        </span>
        <span className="px-2 py-1 rounded-lg bg-white/5 border border-white/10">
          أكثر يوم نشاطًا للطلبات: {requestsPeak.label}
        </span>
      </div>
      <div ref={chartContainerRef} className="h-64 min-h-[16rem] w-full min-w-0">
        {hasChartSize ? (
          <LineChart width={chartSize.width} height={CHART_HEIGHT} data={series}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={themeColors.grid}
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: themeColors.tickPrimary }}
                axisLine={{ stroke: themeColors.axis }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: themeColors.tickSecondary }}
                axisLine={{ stroke: themeColors.axis }}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ fill: themeColors.cursor }}
                content={<CustomTooltip theme={currentTheme} />}
              />
              <Line
                type="monotone"
                dataKey="offers"
                name="العروض"
                stroke={themeColors.emerald}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="requests"
                name="الطلبات"
                stroke={themeColors.cyan}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
          </LineChart>
        ) : (
          <div className="h-full w-full" aria-hidden="true" />
        )}
      </div>
    </div>
  );
};

export default OffersRequestsActivityChart;
