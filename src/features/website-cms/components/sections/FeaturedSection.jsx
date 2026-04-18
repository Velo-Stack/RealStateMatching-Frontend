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
    <div className="space-y-6">
      {/* Featured Form */}
      <FormGroup title={featuredEditingId ? "تعديل عرض مميز" : "إضافة عرض مميز جديد"}>
        <form onSubmit={saveFeatured} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="العنوان" required>
              <input
                className={inputClasses}
                placeholder="مثال: فيلا فاخرة"
                value={featuredForm.title}
                onChange={(e) => setFeaturedForm((prev) => ({ ...prev, title: e.target.value }))}
                required
              />
            </FormField>

            <FormField label="معرّف العرض (اختياري)">
              <input
                className={inputClasses}
                placeholder="123"
                value={featuredForm.offerId}
                onChange={(e) => setFeaturedForm((prev) => ({ ...prev, offerId: e.target.value }))}
                dir="ltr"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
              <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 cursor-pointer hover:bg-white/10 transition-colors">
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

          <div className="space-y-4 rounded-3xl border border-white/5 bg-white/[0.02] p-5">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-slate-300">الصور الإضافية للعقار</h4>
              <button
                type="button"
                onClick={() => setFeaturedForm((prev) => ({ ...prev, images: [...(prev.images || []), ""] }))}
                className="text-sm text-emerald-400 font-semibold hover:text-emerald-300 transition-colors py-1 px-3 bg-emerald-500/10 rounded-lg"
              >
                + إضافة صورة
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(featuredForm.images || []).map((img, idx) => (
                <div key={idx} className="relative p-4 border border-white/10 rounded-2xl bg-slate-900/50">
                  <button
                    type="button"
                    onClick={() => {
                        const newImages = [...(featuredForm.images || [])];
                        newImages.splice(idx, 1);
                        setFeaturedForm((prev) => ({ ...prev, images: newImages }));
                    }}
                    className="absolute top-2 left-2 z-10 px-2 py-1 bg-red-500/20 text-red-500 hover:bg-red-500/30 text-xs rounded-md font-semibold transition-colors"
                  >
                    إزالة
                  </button>
                  <ImageUploadField
                    label={`صورة إضافية ${idx + 1}`}
                    value={img}
                    onChange={(value) => {
                        const newImages = [...(featuredForm.images || [])];
                        newImages[idx] = value;
                        setFeaturedForm((prev) => ({ ...prev, images: newImages }));
                    }}
                    uploadMutation={uploadMutation}
                  />
                </div>
              ))}
              {(featuredForm.images || []).length === 0 && (
                 <div className="col-span-full text-center py-6 text-sm text-slate-500 border border-dashed border-white/10 rounded-2xl">
                   لا توجد صور إضافية. أضف صوراً لعرض أفضل على الموقع.
                 </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="theme-button-primary inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold shadow-lg shadow-emerald-500/20"
            >
              <Plus size={18} weight="bold" />
              {featuredEditingId ? "تحديث العرض" : "إضافة عرض"}
            </button>

            {featuredEditingId && (
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

      {/* Featured Offers List */}
      <FormGroup title={`العروض المميزة الحالية (${featuredOffersQuery.data?.length || 0})`}>
        {featuredOffersQuery.isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </div>
        ) : (featuredOffersQuery.data || []).length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            لا توجد عروض مميزة حالياً. قم بإضافة عرض جديد.
          </div>
        ) : (
          <div className="space-y-4">
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
                    <h4 className="font-semibold text-white">{item.title}</h4>
                    {item.location && (
                      <p className="mt-1 text-sm text-slate-400">{item.location}</p>
                    )}
                    {item.priceLabel && (
                      <p className="mt-1 text-sm font-semibold text-emerald-400">
                        {item.priceLabel}
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
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
