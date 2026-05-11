import { MagnifyingGlass, Barcode, Plus } from "phosphor-react";
import { motion } from "framer-motion";

const OffersHeader = ({ openCreate, searchCode, onSearchCodeChange }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
    <h2 className="text-2xl font-bold text-white">إدارة العروض العقارية</h2>
    
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      {/* Search Box */}
      <div className="relative w-full sm:w-auto sm:min-w-[280px]">
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
          <Barcode size={18} className="text-slate-400" weight="duotone" />
          <span className="text-xs text-slate-500 hidden sm:inline">بحث بالكود</span>
        </div>
        <div className="absolute left-14 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-mono pointer-events-none">
          OFF-
        </div>
        <input
          type="text"
          value={searchCode}
          onChange={(e) => onSearchCodeChange(e.target.value)}
          placeholder="000000"
          className="w-full h-11 pr-24 pl-24 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/8 transition-all font-mono"
          dir="ltr"
        />
        {searchCode && (
          <button
            onClick={() => onSearchCodeChange('')}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors z-10"
          >
            ✕
          </button>
        )}
      </div>

      {/* Add Button */}
      {openCreate && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openCreate}
          className="theme-button-white h-11 px-6 rounded-xl flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <Plus size={20} weight="bold" />
          <span>إضافة عرض جديد</span>
        </motion.button>
      )}
    </div>
  </div>
);

export default OffersHeader;
