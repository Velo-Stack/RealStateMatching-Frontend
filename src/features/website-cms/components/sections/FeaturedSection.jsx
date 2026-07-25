import { Plus } from "phosphor-react";
import FormGroup from "../shared/FormGroup";
import FormField from "../shared/FormField";
import ListItemCard from "../shared/ListItemCard";
import ImageUploadField from "../ImageUploadField";
import { inputClasses, emptyFeatured } from "../../constants/websiteCmsConstants";

const FeaturedSection = ({
  featuredForm,
  setFeaturedForm,
  featuredEditingId,
  setFeaturedEditingId,
  saveFeatured,
  featuredOffersQuery,
  featuredMutations,
  uploadMutation,
}) => {
  const handleEdit = (item) => {
    setFeaturedEditingId(item.id);
    setFeaturedForm({
      title: item.title || "",
      subtitle: item.subtitle || "",
      location: item.location || "",
      priceLabel: item.priceLabel || "",
      imageUrl: item.imageUrl || "",
      images: Array.isArray(item.images) ? item.images : [],
      status: item.status || "AVAILABLE",
      beds: item.beds ?? "",
      baths: item.baths ?? "",
      sizeLabel: item.sizeLabel || "",
      badge: item.badge || "",
      offerId: item.offerId ?? "",
      sortOrder: item.sortOrder ?? 0,
      isActive: Boolean(item.isActive),
    });
  };

  const handleCancel = () => {
    setFeaturedEditingId(null);
    setFeaturedForm(emptyFeatured);
  };

  return (
    <div className="space-y-4">
      {/* Featured Form */}
      <FormGroup title={featuredEditingId ? "تعديل عرض مميز" : "إضافة عرض مميز جديد"}>
        <form onSubmit={saveFeatured} className="space-y-3">
          <FormField label="العنوان" required>
            <input
              className={inputClasses}
              placeholder="مثال: فيلا فاخرة"
              value={featuredForm.title}
              onChange={(e) => setFeaturedForm((prev) => ({ ...prev, title: e.target.value }))}
              required
            />
          </FormField>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <FormField label="العنوان الفرعي">
              <input
                className={inputClasses}
                placeholder="مثال: للبيع"
                value={featuredForm.subtitle}
                onChange={(e) => setFeaturedForm((prev) => ({ ...prev, subtitle: e.target.value }))}
              />
            </FormField>

            <FormField label="الموقع">
              <input
                className={inputClasses}
                placeholder="مثال: الرياض، حي النرجس"
                value={featuredForm.location}
                onChange={(e) => setFeaturedForm((prev) => ({ ...prev, location: e.target.value }))}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <FormField label="السعر">
              <input
                className={inputClasses}
                placeholder="مثال: 2,500,000 ريال"
                value={featuredForm.priceLabel}
                onChange={(e) =>
                  setFeaturedForm((prev) => ({ ...prev, priceLabel: e.target.value }))
                }
              />
            </FormField>

            <FormField label="الشارة (Badge)">
              <input
                className={inputClasses}
                placeholder="مثال: جديد، مميز"
                value={featuredForm.badge}
                onChange={(e) => setFeaturedForm((prev) => ({ ...prev, badge: e.target.value }))}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <FormField label="عدد الغرف">
              <input
                type="number"
                className={inputClasses}
                placeholder="4"
                value={featuredForm.beds}
                onChange={(e) => setFeaturedForm((prev) => ({ ...prev, beds: e.target.value }))}
                dir="ltr"
              />
            </FormField>

            <FormField label="عدد الحمامات">
              <input
                type="number"
                className={inputClasses}
                placeholder="3"
                value={featuredForm.baths}
                onChange={(e) => setFeaturedForm((prev) => ({ ...prev, baths: e.target.value }))}
                dir="ltr"
              />
            </FormField>

            <FormField label="المساحة">
              <input
                className={inputClasses}
                placeholder="مثال: 500 م²"
                value={featuredForm.sizeLabel}
                onChange={(e) =>
                  setFeaturedForm((prev) => ({ ...prev, sizeLabel: e.target.value }))
                }
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <FormField label="حالة العرض">
              <select
                className={inputClasses}
                value={featuredForm.status || "AVAILABLE"}
                onChange={(e) => setFeaturedForm((prev) => ({ ...prev, status: e.target.value }))}
              >
                <option value="AVAILABLE">متاح للبيع/للإيجار</option>
                <option value="SOLD">مباع / مؤجر / مغلق</option>
              </select>
            </FormField>

            <FormField label="الترتيب">
              <input
                type="number"
                className={inputClasses}
                placeholder="0"
                value={featuredForm.sortOrder}
                onChange={(e) =>
                  setFeaturedForm((prev) => ({ ...prev, sortOrder: e.target.value }))
                }
                dir="ltr"
              />
            </FormField>

            <FormField label="الحالة">
              <label className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 cursor-pointer hover:bg-white/10 transition-colors">
                <input
                  type="checkbox"
                  checked={featuredForm.isActive}
                  onChange={(e) =>
                    setFeaturedForm((prev) => ({ ...prev, isActive: e.target.checked }))
                  }
                  className="h-4 w-4"
                />
                <span>مفعّل</span>
              </label>
            </FormField>
          </div>

          <ImageUploadField
            label="صورة العقار الرئيسية"
            value={featuredForm.imageUrl}
            onChange={(value) => setFeaturedForm((prev) => ({ ...prev, imageUrl: value }))}
            uploadMutation={uploadMutation}
          />

          <div className="flex gap-2">
            <button
              type="submit"
              className="theme-button-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold shadow-lg shadow-emerald-500/20"
            >
              <Plus size={16} weight="bold" />
              {featuredEditingId ? "تحديث العرض" : "إضافة عرض"}
            </button>

            {featuredEditingId && (
              <button
                type="button"
                className="theme-button-white rounded-lg px-4 py-2 text-sm font-semibold"
                onClick={handleCancel}
              >
                إلغاء
              </button>
            )}
          </div>
        </form>
      </FormGroup>

      {/* Featured Offers List */}
      <FormGroup title={`العروض المميزة الحالية (${featuredOffersQuery.data?.length || 0})`}>
        {featuredOffersQuery.isLoading ? (
          <div className="flex items-center justify-center py-6">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500"></div>
          </div>
        ) : (featuredOffersQuery.data || []).length === 0 ? (
          <div className="text-center py-6 text-sm text-slate-400">
            لا توجد عروض مميزة حالياً. قم بإضافة عرض جديد.
          </div>
        ) : (
          <div className="space-y-2">
            {(featuredOffersQuery.data || []).map((item) => (
              <ListItemCard
                key={item.id}
                item={item}
                onEdit={handleEdit}
                onDelete={(id) => featuredMutations.deleteFeaturedOffer.mutate(id)}
                showImage={true}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                    {item.location && (
                      <p className="mt-0.5 text-xs text-slate-400">{item.location}</p>
                    )}
                    {item.priceLabel && (
                      <p className="mt-0.5 text-xs font-semibold text-emerald-400">
                        {item.priceLabel}
                      </p>
                    )}
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span>الترتيب: #{item.sortOrder}</span>
                      {item.beds && <span>🛏️ {item.beds}</span>}
                      {item.baths && <span>🚿 {item.baths}</span>}
                      <span className={item.status === 'AVAILABLE' ? "text-amber-400" : "text-red-400"}>
                        {item.status === 'AVAILABLE' ? "متاح" : "مباع/مؤجر"}
                      </span>
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

export default FeaturedSection;
