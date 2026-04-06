import { Plus } from "phosphor-react";
import FormGroup from "../shared/FormGroup";
import FormField from "../shared/FormField";
import ListItemCard from "../shared/ListItemCard";
import ImageUploadField from "../ImageUploadField";
import { inputClasses, textAreaClasses, emptyHero } from "../../constants/websiteCmsConstants";

const HeroSection = ({
  heroForm,
  setHeroForm,
  heroEditingId,
  setHeroEditingId,
  saveHero,
  heroSlidesQuery,
  heroMutations,
  uploadMutation,
}) => {
  const handleEdit = (item) => {
    setHeroEditingId(item.id);
    setHeroForm({
      title: item.title || "",
      subtitle: item.subtitle || "",
      imageUrl: item.imageUrl || "",
      buttonText: item.buttonText || "",
      buttonUrl: item.buttonUrl || "",
      sortOrder: item.sortOrder ?? 0,
      isActive: Boolean(item.isActive),
    });
  };

  const handleCancel = () => {
    setHeroEditingId(null);
    setHeroForm(emptyHero);
  };

  return (
    <div className="space-y-6">
      {/* Hero Form */}
      <FormGroup title={heroEditingId ? "تعديل شريحة الهيرو" : "إضافة شريحة هيرو جديدة"}>
        <form onSubmit={saveHero} className="space-y-4">
          <FormField label="العنوان" required>
            <input
              className={inputClasses}
              placeholder="أدخل عنوان الشريحة"
              value={heroForm.title}
              onChange={(e) => setHeroForm((prev) => ({ ...prev, title: e.target.value }))}
              required
            />
          </FormField>

          <FormField label="الوصف">
            <textarea
              className={textAreaClasses}
              placeholder="أدخل وصف الشريحة"
              value={heroForm.subtitle}
              onChange={(e) => setHeroForm((prev) => ({ ...prev, subtitle: e.target.value }))}
              rows={3}
            />
          </FormField>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="نص الزر">
              <input
                className={inputClasses}
                placeholder="مثال: اكتشف المزيد"
                value={heroForm.buttonText}
                onChange={(e) => setHeroForm((prev) => ({ ...prev, buttonText: e.target.value }))}
              />
            </FormField>

            <FormField label="رابط الزر">
              <input
                className={inputClasses}
                placeholder="/about"
                value={heroForm.buttonUrl}
                onChange={(e) => setHeroForm((prev) => ({ ...prev, buttonUrl: e.target.value }))}
                dir="ltr"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="الترتيب">
              <input
                type="number"
                className={inputClasses}
                placeholder="0"
                value={heroForm.sortOrder}
                onChange={(e) => setHeroForm((prev) => ({ ...prev, sortOrder: e.target.value }))}
                dir="ltr"
              />
            </FormField>

            <FormField label="الحالة">
              <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 cursor-pointer hover:bg-white/10 transition-colors">
                <input
                  type="checkbox"
                  checked={heroForm.isActive}
                  onChange={(e) => setHeroForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                  className="h-4 w-4"
                />
                <span>مفعّل</span>
              </label>
            </FormField>
          </div>

          <ImageUploadField
            label="صورة الشريحة"
            value={heroForm.imageUrl}
            onChange={(value) => setHeroForm((prev) => ({ ...prev, imageUrl: value }))}
            uploadMutation={uploadMutation}
          />

          <div className="flex gap-3">
            <button
              type="submit"
              className="theme-button-primary inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold shadow-lg shadow-emerald-500/20"
            >
              <Plus size={18} weight="bold" />
              {heroEditingId ? "تحديث الشريحة" : "إضافة شريحة"}
            </button>

            {heroEditingId && (
              <button
                type="button"
                className="theme-button-white rounded-xl px-5 py-3 text-sm font-semibold"
                onClick={handleCancel}
              >
                إلغاء
              </button>
            )}
          </div>
        </form>
      </FormGroup>

      {/* Hero Slides List */}
      <FormGroup title={`الشرائح الحالية (${heroSlidesQuery.data?.length || 0})`}>
        {heroSlidesQuery.isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </div>
        ) : (heroSlidesQuery.data || []).length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            لا توجد شرائح حالياً. قم بإضافة شريحة جديدة.
          </div>
        ) : (
          <div className="space-y-4">
            {(heroSlidesQuery.data || []).map((item) => (
              <ListItemCard
                key={item.id}
                item={item}
                onEdit={handleEdit}
                onDelete={(id) => heroMutations.deleteHeroSlide.mutate(id)}
                onToggle={(item) =>
                  heroMutations.toggleHeroSlideStatus.mutate({
                    id: item.id,
                    isActive: !item.isActive,
                  })
                }
                showImage={true}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{item.title}</h4>
                    {item.subtitle && (
                      <p className="mt-1 text-sm text-slate-400 line-clamp-2">{item.subtitle}</p>
                    )}
                    <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                      <span>الترتيب: #{item.sortOrder}</span>
                      <span className={item.isActive ? "text-emerald-400" : "text-slate-500"}>
                        {item.isActive ? "● مفعّل" : "○ غير مفعّل"}
                      </span>
                    </div>
                  </div>
                </div>
              </ListItemCard>
            ))}
          </div>
        )}
      </FormGroup>
    </div>
  );
};

export default HeroSection;
