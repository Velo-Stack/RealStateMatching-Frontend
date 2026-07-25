import { motion } from 'framer-motion';
import { Plus } from 'phosphor-react';
import { primaryButtonClasses, dangerButtonClasses } from '../../constants/styles';

/**
 * PageHeader - رأس الصفحة الموحد
 * يحتوي على: العنوان الرئيسي + العنوان الفرعي + أزرار الإجراءات
 * 
 * @param {string} title - العنوان الرئيسي
 * @param {string} subtitle - الوصف الفرعي
 * @param {function} onAdd - دالة الإضافة
 * @param {string} addLabel - نص زر الإضافة
 * @param {array} actions - أزرار إضافية [{label, icon, onClick, variant}]
 */
const PageHeader = ({
    title,
    subtitle,
    onAdd,
    addLabel = 'إضافة جديد',
    actions = [],
    addButtonClassName = '',
    subtitleClassName = '',
    titleClassName = '',
}) => {
    return (
        <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-0">
                {title && (
                    <h1 className={`text-xl sm:text-2xl font-bold text-white mb-1 ${titleClassName}`}>
                        {title}
                    </h1>
                )}
                {subtitle && <p className={`text-slate-400 text-sm ${subtitleClassName}`}>{subtitle}</p>}
            </div>
            <div className="flex items-center gap-3">
                {/* أزرار إضافية */}
                {actions.map((action, index) => {
                    const Icon = action.icon;
                    const buttonClass = action.variant === 'danger'
                        ? dangerButtonClasses
                        : primaryButtonClasses;
                    const actionKey = action.key || action.id || action.label || `action-${index}`;

                    return (
                        <motion.button
                            key={actionKey}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={action.onClick}
                            className={`${buttonClass} ${action.className || ''}`}
                        >
                            {Icon && <Icon size={20} weight="bold" />}
                            {action.label}
                        </motion.button>
                    );
                })}

                {/* زر الإضافة الرئيسي */}
                {onAdd && (
                    <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={onAdd}
                        className={`${primaryButtonClasses} ${addButtonClassName}`}
                    >
                        <Plus size={20} weight="bold" />
                        {addLabel}
                    </motion.button>
                )}
            </div>
        </div>
    );
};

export default PageHeader;
