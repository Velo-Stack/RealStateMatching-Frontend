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
        backdrop-blur-xl rounded-2xl 
        border
        shadow-lg
        ${onRowClick ? 'cursor-pointer active:scale-[0.98]' : ''}
        transition-all duration-300
      `}
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-default)',
        boxShadow: '0 4px 16px var(--button-primary-shadow)',
      }}
    >
      {/* Gradient overlay */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          background: 'linear-gradient(135deg, var(--accent-glow) 0%, transparent 100%)',
        }}
      />
      
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
              <div 
                className="text-[10px] uppercase tracking-widest font-semibold"
                style={{ color: 'var(--text-secondary)' }}
              >
                {col.header}
              </div>
              <div 
                className="text-sm leading-relaxed"
                style={{ color: 'var(--text-primary)' }}
              >
                {value}
              </div>
            </div>
          );
        })}

        {actionButtons && (
          <div 
            className="pt-4 mt-4 border-t flex gap-2 items-center"
            style={{ borderColor: 'var(--border-default)' }}
          >
            {actionButtons}
          </div>
        )}
      </div>

      {/* Bottom accent line */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-0.5"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, var(--accent) 50%, transparent 100%)',
          opacity: 0.5,
        }}
      />
    </motion.div>
  );
};

export default MobileCard;
