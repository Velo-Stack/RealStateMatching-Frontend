import { motion } from "framer-motion";
import { Funnel, ArrowsClockwise } from "phosphor-react";
import {
  actionFilterOptions,
  resourceFilterOptions,
} from "../constants/auditLogsConfig";
import { inputClasses, labelClasses } from "../constants/auditLogsStyles";

const AuditLogsFilters = ({
  filters,
  users,
  hasActiveFilters,
  handleChange,
  clearFilters,
}) => (
  <div className="bg-[#111827]/60 backdrop-blur-xl rounded-2xl border border-white/5 p-5">
    <div className="flex items-center gap-2 mb-4">
      <Funnel size={16} className="text-slate-500" />
      <span className="text-sm text-slate-400">تصفية النتائج</span>
      {hasActiveFilters && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={clearFilters}
          className="mr-auto text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
        >
          <ArrowsClockwise size={14} />
          مسح الفلاتر
        </motion.button>
      )}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-right">
      <div>
        <label className={labelClasses}>المورد</label>
        <select
          name="resource"
          className={inputClasses}
          value={filters.resource}
          onChange={handleChange}
        >
          <option value="">الكل</option>
          {resourceFilterOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelClasses}>الإجراء</label>
        <select
          name="action"
          className={inputClasses}
          value={filters.action}
          onChange={handleChange}
        >
          <option value="">الكل</option>
          {actionFilterOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelClasses}>المستخدم</label>
        <select
          name="userId"
          className={inputClasses}
          value={filters.userId}
          onChange={handleChange}
        >
          <option value="">الكل</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelClasses}>من تاريخ</label>
        <input
          name="startDate"
          type="date"
          className={inputClasses}
          value={filters.startDate}
          onChange={handleChange}
        />
      </div>
      <div>
        <label className={labelClasses}>إلى تاريخ</label>
        <input
          name="endDate"
          type="date"
          className={inputClasses}
          value={filters.endDate}
          onChange={handleChange}
        />
      </div>
    </div>
  </div>
);

export default AuditLogsFilters;
