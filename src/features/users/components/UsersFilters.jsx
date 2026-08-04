import { motion } from "framer-motion";
import { FunnelSimple, MagnifyingGlass } from "phosphor-react";
import { roleConfig, statusConfig } from "../constants/usersConstants";

const selectClasses =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition-all duration-300 focus:bg-white/10 focus:border-emerald-500/50 focus:shadow-[0_0_20px_rgba(16,185,129,0.15)] appearance-none cursor-pointer";
const inputClasses = 
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition-all duration-300 focus:bg-white/10 focus:border-emerald-500/50 focus:shadow-[0_0_20px_rgba(16,185,129,0.15)] placeholder-slate-500";

const UsersFilters = ({ filters, onFilterChange }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onFilterChange({ ...filters, [name]: value });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#111827]/60 backdrop-blur-xl rounded-2xl border border-white/5 p-4"
        >
            <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <FunnelSimple size={18} weight="duotone" />
                    <span>تصفية</span>
                </div>

                <div className="flex-1 min-w-[200px] max-w-[300px] relative">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                        <MagnifyingGlass size={18} weight="duotone" />
                    </div>
                    <input
                        type="text"
                        name="search"
                        value={filters.search || ""}
                        onChange={handleChange}
                        placeholder="ابحث بالاسم، الايميل، رقم الهاتف..."
                        className={`${inputClasses} pr-10`}
                    />
                </div>

                <div className="flex-1 min-w-[160px] max-w-[220px]">
                    <select
                        name="role"
                        value={filters.role}
                        onChange={handleChange}
                        className={selectClasses}
                    >
                        <option value="">كل الأدوار</option>
                        {Object.entries(roleConfig).map(([key, config]) => (
                            <option key={key} value={key}>
                                {config.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex-1 min-w-[160px] max-w-[220px]">
                    <select
                        name="status"
                        value={filters.status}
                        onChange={handleChange}
                        className={selectClasses}
                    >
                        <option value="">كل الحالات</option>
                        {Object.entries(statusConfig).map(([key, config]) => (
                            <option key={key} value={key}>
                                {config.label}
                            </option>
                        ))}
                    </select>
                </div>

                {(filters.role || filters.status || filters.search) && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onFilterChange({ role: "", status: "", search: "" })}
                        className="px-3 py-2 rounded-xl text-xs font-medium text-slate-400 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all duration-300"
                    >
                        مسح الفلاتر
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
};

export default UsersFilters;


