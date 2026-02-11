import { CHART_THEME_COLORS } from "../constants/dashboardConstants";

const CustomTooltip = ({ active, payload, label, theme = "dark" }) => {
  const themeColors = CHART_THEME_COLORS[theme] || CHART_THEME_COLORS.dark;

  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-xl px-4 py-3 shadow-xl backdrop-blur-xl"
        style={{
          backgroundColor: themeColors.tooltipBg,
          border: `1px solid ${themeColors.tooltipBorder}`,
        }}
      >
        <p className="text-xs mb-1" style={{ color: themeColors.tooltipLabel }}>
          {label}
        </p>
        {payload.map((entry, index) => (
          <p
            key={index}
            className="text-sm font-bold"
            style={{ color: entry.color || themeColors.tooltipText }}
          >
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
