import StatCard from "./StatCard";

const StatsSection = ({ items, className }) => (
  <div className={className}>
    {items.map((item) => (
      <StatCard key={item.label} {...item} />
    ))}
  </div>
);

export default StatsSection;
