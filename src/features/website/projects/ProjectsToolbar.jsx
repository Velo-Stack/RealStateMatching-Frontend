import { LayoutGrid, List } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const getProjectsCountLabel = (count) => {
  if (count === 0) return "لا يوجد مشاريع حالياً";
  if (count === 1) return "يوجد مشروع واحد";
  if (count === 2) return "يوجد مشروعان";
  if (count >= 3 && count <= 10) return `يوجد ${count} مشاريع`;
  return `يوجد ${count} مشروعاً`;
};

const ViewButton = ({ active, onClick, icon: Icon, label }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={`relative z-10 inline-flex items-center gap-2 rounded-md px-3.5 py-2 text-sm font-semibold transition-colors ${
      active ? "text-white" : "text-gray-700 hover:text-[#9d7857]"
    }`}
  >
    {active && (
      <motion.span
        layoutId="projects-view-pill"
        className="absolute inset-0 -z-10 rounded-md bg-[#9d7857] shadow-sm"
        transition={{ type: "spring", stiffness: 420, damping: 32 }}
      />
    )}
    <Icon className="h-4 w-4" strokeWidth={2.2} />
    {label}
  </button>
);

const ProjectsToolbar = ({
  viewMode = "list",
  onViewModeChange,
  projectsCount = 0,
  isLoading = false,
}) => {
  return (
    <div
      className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.06)] sm:flex-row sm:items-center sm:justify-between sm:px-5"
      dir="rtl"
    >
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="inline-flex items-center gap-1 rounded-lg border border-[#9d7857]/25 bg-[#9d7857]/[0.04] p-1">
          <ViewButton
            active={viewMode === "grid"}
            onClick={() => onViewModeChange?.("grid")}
            icon={LayoutGrid}
            label="شبكة"
          />
          <ViewButton
            active={viewMode === "list"}
            onClick={() => onViewModeChange?.("list")}
            icon={List}
            label="قائمة"
          />
        </div>

        <div className="mx-1 hidden h-6 w-px bg-gray-200 sm:block" />

        <AnimatePresence mode="wait">
          <motion.p
            key={isLoading ? "loading" : projectsCount}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
            className="text-sm font-medium text-gray-600"
          >
            {isLoading
              ? "جاري تحميل المشاريع..."
              : getProjectsCountLabel(projectsCount)}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProjectsToolbar;
