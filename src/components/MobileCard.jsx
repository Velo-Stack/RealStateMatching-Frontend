import { motion } from 'framer-motion';

const MobileCard = ({ columns, row, actions, onRowClick, index }) => {
  const hasActions = typeof actions === 'function';
  const actionButtons = hasActions ? actions(row) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.3), duration: 0.3 }}
      onClick={() => onRowClick && onRowClick(row)}
      className={`
        relative overflow-hidden
        bg-gradient-to-br from-[#1e293b]/90 to-[#0f172a]/90 
        backdrop-blur-xl rounded-2xl 
        border border-white/10 
        shadow-lg shadow-black/20
        ${onRowClick ? 'cursor-pointer active:scale-[0.98]' : ''}
        hover:border-emerald-500/30 hover:shadow-emerald-500/10
        transition-all duration-300
      `}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className="relative p-5 space-y-3.5">
        {columns.map((col, colIndex) => {
          const value = col.render ? col.render(row) : row[col.key];
          
          // Skip empty values
          if (!value && value !== 0) return null;

          return (
            <div 
              key={col.key || col.header || `cell-${colIndex}`} 
              className="flex flex-col space-y-1.5"
            >
              <div className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
                {col.header}
              </div>
              <div className="text-sm text-slate-100 leading-relaxed">
                {value}
              </div>
            </div>
          );
        })}

        {actionButtons && (
          <div className="pt-4 mt-4 border-t border-white/10 flex gap-2 items-center">
            {actionButtons}
          </div>
        )}
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
    </motion.div>
  );
};

export default MobileCard;
