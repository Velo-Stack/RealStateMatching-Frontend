import { motion } from "framer-motion";
import { PencilSimple, Trash } from "phosphor-react";
import { resolveUploadUrl } from "../../../../utils/uploads";

const ListItemCard = ({
  item,
  onEdit,
  onDelete,
  onToggle,
  showImage = true,
  children,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-white/10 bg-slate-900/40 p-3 hover:border-emerald-500/30 transition-colors"
    >
      {showImage && item.imageUrl && (
        <img
          src={resolveUploadUrl(item.imageUrl)}
          alt={item.title}
          className="mb-2 h-20 w-full rounded-md object-cover"
        />
      )}

      {children}

      <div className="mt-2 flex flex-wrap gap-1.5">
        <button
          type="button"
          className="theme-button-white inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold"
          onClick={() => {
            onEdit(item);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <PencilSimple size={14} />
          تعديل
        </button>

        {onToggle && (
          <button
            type="button"
            className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/10 transition-colors"
            onClick={() => onToggle(item)}
          >
            {item.isActive ? "إخفاء" : "تفعيل"}
          </button>
        )}

        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-md border border-red-500/20 bg-red-500/10 px-2.5 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/20 transition-colors"
          onClick={() => {
            if (confirm("هل أنت متأكد من الحذف؟")) {
              onDelete(item.id);
            }
          }}
        >
          <Trash size={14} />
          حذف
        </button>
      </div>
    </motion.div>
  );
};

export default ListItemCard;
