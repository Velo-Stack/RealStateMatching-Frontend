import { useState, useEffect } from "react";
import { Plus, Trash, Eye, EyeSlash, CaretUp, CaretDown, Gear, FloppyDisk } from "phosphor-react";

const inputClasses = "w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-colors";

const defaultItemsTemplate = [
  { key: 'built_area', label: 'مسطحات البناء', isVisible: true, displayMode: 'CUSTOM', customValue: '4394636', suffix: '' },
  { key: 'developed_lands', label: 'الأراضي المطورة', isVisible: true, displayMode: 'CUSTOM', customValue: '425651', suffix: '' },
  { key: 'residential_units', label: 'الوحدات السكنية', isVisible: true, displayMode: 'CUSTOM', customValue: '1721', suffix: '' },
  { key: 'investment_lands', label: 'الأراضي الاستثمارية', isVisible: true, displayMode: 'CUSTOM', customValue: '273365', suffix: '' },
  { key: 'commercial_showrooms', label: 'المعارض التجارية', isVisible: true, displayMode: 'CUSTOM', customValue: '78', suffix: '' },
  { key: 'commercial_offices', label: 'المكاتب التجارية', isVisible: true, displayMode: 'CUSTOM', customValue: '318', suffix: '' },
  { key: 'projects', label: 'مشاريع رواسخ', isVisible: true, displayMode: 'AUTO', customValue: '73', suffix: '' },
  { key: 'offers', label: 'العروض المتاحة', isVisible: true, displayMode: 'AUTO', customValue: '', suffix: '+' },
  { key: 'requests', label: 'الطلبات العقارية', isVisible: true, displayMode: 'AUTO', customValue: '', suffix: '+' },
  { key: 'matches', label: 'الصفقات الناجحة', isVisible: true, displayMode: 'AUTO', customValue: '', suffix: '+' },
];

const StatsBuilderUI = ({ value, onChange, onSave }) => {
  const [items, setItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!isLoaded) {
      try {
        if (value) {
          const parsed = JSON.parse(value);
          if (parsed.items && Array.isArray(parsed.items) && parsed.items.length > 0) {
            setItems(parsed.items);
          } else {
            setItems(defaultItemsTemplate);
          }
        } else {
          setItems(defaultItemsTemplate);
        }
      } catch (e) {
        setItems(defaultItemsTemplate);
      }
      setIsLoaded(true);
    }
  }, [value, isLoaded]);

  const updateContent = (newItems) => {
    setItems(newItems);
    onChange(JSON.stringify({ items: newItems }, null, 2));
  };

  const handleAddItem = () => {
    const newItem = {
      key: `custom_${Date.now()}`,
      label: "إحصائية جديدة",
      isVisible: true,
      displayMode: "CUSTOM",
      customValue: "0",
      suffix: "",
    };
    updateContent([...items, newItem]);
  };

  const handleUpdateItem = (index, field, val) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: val };
    updateContent(newItems);
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    updateContent(newItems);
  };

  const moveItem = (index, direction) => {
    if (direction === -1 && index === 0) return;
    if (direction === 1 && index === items.length - 1) return;
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[index + direction];
    newItems[index + direction] = temp;
    updateContent(newItems);
  };

  const isSystemKey = (key) => ['projects', 'offers', 'requests', 'matches'].includes(key);

  return (
    <div className="space-y-3 rounded-lg border border-white/5 bg-black/20 p-3 mt-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="flex items-center gap-1.5 text-sm font-semibold text-emerald-400">
          <Gear size={16} />
          إدارة الإحصائيات والأرقام
        </h4>
        <button
          type="button"
          onClick={handleAddItem}
          className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/20 px-2.5 py-1 text-xs font-medium text-emerald-400 hover:bg-emerald-500/30 transition-colors"
        >
          <Plus size={14} />
          إضافة رقم
        </button>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={item.key || index}
            className={`flex flex-col gap-2 rounded-md border border-white/10 p-2.5 transition-colors ${
              item.isVisible ? "bg-white/5" : "bg-white/5 opacity-50 grayscale"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-2">
                <div className="md:col-span-3">
                  <label className="mb-1 block text-[11px] text-slate-400">التسمية / العنوان</label>
                  <input
                    type="text"
                    className={inputClasses}
                    value={item.label}
                    onChange={(e) => handleUpdateItem(index, "label", e.target.value)}
                    placeholder="العنوان..."
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="mb-1 block text-[11px] text-slate-400">نمط العرض</label>
                  <select
                    className={inputClasses}
                    value={item.displayMode}
                    onChange={(e) => handleUpdateItem(index, "displayMode", e.target.value)}
                  >
                    <option value="CUSTOM">مخصص (نص / رقم محدد)</option>
                    {isSystemKey(item.key) && <option value="AUTO">آلي (من النظام)</option>}
                  </select>
                </div>

                {item.displayMode === "CUSTOM" && (
                  <div className="md:col-span-3">
                    <label className="mb-1 block text-[11px] text-slate-400">القيمة المخصصة</label>
                    <input
                      type="text"
                      className={inputClasses}
                      value={item.customValue || ""}
                      onChange={(e) => handleUpdateItem(index, "customValue", e.target.value)}
                      placeholder="+50, أكثر من مليون..."
                      dir="ltr"
                    />
                  </div>
                )}

                <div className="md:col-span-3">
                  <label className="mb-1 block text-[11px] text-slate-400">اللاحقة (اختياري)</label>
                  <input
                    type="text"
                    className={inputClasses}
                    value={item.suffix || ""}
                    onChange={(e) => handleUpdateItem(index, "suffix", e.target.value)}
                    placeholder="+, M, ألف..."
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-col items-center gap-0.5 border-r border-white/10 pr-2">
                <button
                  type="button"
                  onClick={() => moveItem(index, -1)}
                  disabled={index === 0}
                  className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                >
                  <CaretUp size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateItem(index, "isVisible", !item.isVisible)}
                  className={`p-1 rounded-md ${
                    item.isVisible ? "text-emerald-400 hover:bg-emerald-400/10" : "text-slate-400 hover:bg-white/10"
                  }`}
                  title={item.isVisible ? "إخفاء" : "إظهار"}
                >
                  {item.isVisible ? <Eye size={15} /> : <EyeSlash size={15} />}
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className="p-1 text-red-400 hover:bg-red-400/10 rounded-md"
                  title="حذف"
                >
                  <Trash size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(index, 1)}
                  disabled={index === items.length - 1}
                  className="p-1 text-slate-400 hover:text-white disabled:opacity-30 mb-1"
                >
                  <CaretDown size={14} />
                </button>
                
                {onSave && (
                  <button
                    type="button"
                    onClick={onSave}
                    className="mt-0.5 p-1 text-blue-400 bg-blue-400/10 hover:bg-blue-400/20 rounded-md shadow-sm border border-blue-400/20"
                    title="حفظ هذا الصف والتعديلات للموقع"
                  >
                    <FloppyDisk size={15} weight="fill" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-4 text-slate-400 text-xs">
            لا توجد إحصائيات مضافة حالياً.
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsBuilderUI;
