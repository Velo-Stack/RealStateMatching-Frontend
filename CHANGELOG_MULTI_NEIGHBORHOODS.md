# إضافة ميزة اختيار أحياء متعددة في الطلبات

## التاريخ: 2026-05-10

## نظرة عامة

تم إضافة ميزة جديدة تسمح للمستخدم باختيار أكثر من حي واحد عند إضافة طلب جديد، بدلاً من حي واحد فقط.

## المشكلة السابقة

- كان المستخدم يستطيع اختيار حي واحد فقط لكل طلب
- إذا أراد المستخدم البحث في عدة أحياء، كان عليه إنشاء طلب منفصل لكل حي

## الحل الجديد

### 1. مكون جديد: MultiNeighborhoodSelect

تم إنشاء مكون جديد `MultiNeighborhoodSelect` يسمح باختيار أحياء متعددة مع الميزات التالية:

#### الميزات:
- ✅ **اختيار متعدد**: يمكن اختيار أكثر من حي
- ✅ **بحث سريع**: حقل بحث للعثور على الأحياء بسرعة
- ✅ **عرض مرئي**: عرض الأحياء المختارة كـ tags قابلة للإزالة
- ✅ **تطبيع البحث**: البحث يدعم الأحرف العربية المختلفة (أ، إ، آ)
- ✅ **علامة الاختيار**: عرض علامة ✓ بجانب الأحياء المختارة
- ✅ **إزالة سريعة**: إمكانية إزالة أي حي بنقرة واحدة

#### الملف:
```
src/components/common/MultiNeighborhoodSelect.jsx
```

### 2. تحديث CityDistrictSelect

تم إضافة خاصية `hideDistrict` لإخفاء حقل الحي المفرد عند استخدام المكون الجديد.

#### التعديلات:
```javascript
// إضافة خاصية جديدة
hideDistrict = false

// استخدام الخاصية
{!hideDistrict && (
  <div>
    {/* حقل الحي */}
  </div>
)}
```

### 3. تحديث نموذج إضافة الطلب

تم استبدال حقل الحي المفرد بالمكون الجديد:

#### قبل:
```jsx
<CityDistrictSelect
  cityValue={formModal.formData.cityId}
  districtValue={formModal.formData.neighborhoodId}
  onCityChange={formModal.handleChange}
  onDistrictChange={formModal.handleChange}
  cityName="cityId"
  districtName="neighborhoodId"
  useCityId
  required
/>
```

#### بعد:
```jsx
<CityDistrictSelect
  cityValue={formModal.formData.cityId}
  districtValue={formModal.formData.neighborhoodId}
  onCityChange={(e) => {
    formModal.handleChange(e);
    // Reset neighborhoods when city changes
    formModal.setValue("neighborhoodIds", []);
  }}
  onDistrictChange={formModal.handleChange}
  cityName="cityId"
  districtName="neighborhoodId"
  useCityId
  required
  hideDistrict
/>

<MultiNeighborhoodSelect
  cityId={formModal.formData.cityId}
  selectedNeighborhoodIds={formModal.formData.neighborhoodIds || []}
  onChange={(neighborhoodIds) => {
    formModal.setValue("neighborhoodIds", neighborhoodIds);
    // Also update single neighborhoodId for backward compatibility
    if (neighborhoodIds.length > 0) {
      formModal.setValue("neighborhoodId", neighborhoodIds[0]);
    }
  }}
  error={errors.neighborhoodIds}
  touched={touched.neighborhoodIds}
  required
/>
```

### 4. تحديث البيانات والـ Validation

#### Constants:
```javascript
// إضافة حقل neighborhoodIds
export const REQUESTS_EMPTY_FORM = {
  // ... الحقول الأخرى
  neighborhoodId: "",
  neighborhoodIds: [], // جديد
  // ...
};
```

#### Validation:
```javascript
// التحقق من وجود حي واحد على الأقل
const hasNeighborhoods = (formData.neighborhoodIds && formData.neighborhoodIds.length > 0) || formData.neighborhoodId;
if (!hasNeighborhoods) {
    errors.neighborhoodIds = "يجب اختيار حي واحد على الأقل";
}
```

#### Payload Mapping:
```javascript
// إرسال neighborhoodIds بدلاً من neighborhoodId
const neighborhoodIds = formData.neighborhoodIds && formData.neighborhoodIds.length > 0
  ? formData.neighborhoodIds
  : formData.neighborhoodId
  ? [toNonNegativeNumberOrNull(formData.neighborhoodId)]
  : [];

return {
  // ...
  neighborhoodIds: neighborhoodIds.filter(id => id !== null),
  // ...
};
```

### 5. تحديث عرض البيانات

#### في الجدول (RequestItem):
```javascript
{request.neighborhoods && request.neighborhoods.length > 0 ? (
  <span className="mr-1">
    ({request.neighborhoods.length} {request.neighborhoods.length === 1 ? "حي" : "أحياء"})
  </span>
) : (
  <span> - {request.neighborhoodRel?.name || request.district || "-"}</span>
)}

{/* عرض قائمة الأحياء */}
{request.neighborhoods && request.neighborhoods.length > 0 && (
  <div className="mt-1 text-xs">
    {request.neighborhoods.map((n, i) => (
      <span key={n.id}>
        {n.name}
        {i < request.neighborhoods.length - 1 ? "، " : ""}
      </span>
    ))}
  </div>
)}
```

#### في صفحة التفاصيل (RequestDetailsModal):
```javascript
value={
  request.neighborhoods && request.neighborhoods.length > 0
    ? `${request.cityRel?.name || request.city || "-"} - ${request.neighborhoods.map(n => n.name).join("، ")}`
    : `${request.cityRel?.name || request.city || "-"} - ${request.neighborhoodRel?.name || request.district || "-"}`
}
```

## الملفات المعدلة

### ملفات جديدة:
1. `src/components/common/MultiNeighborhoodSelect.jsx` - المكون الجديد

### ملفات معدلة:
2. `src/components/common/index.js` - إضافة export للمكون الجديد
3. `src/components/common/CityDistrictSelect.jsx` - إضافة خاصية hideDistrict
4. `src/features/requests/components/RequestFormSection.jsx` - استخدام المكون الجديد
5. `src/features/requests/components/RequestItem.jsx` - عرض الأحياء المتعددة
6. `src/features/requests/components/RequestDetailsModal.jsx` - عرض الأحياء في التفاصيل
7. `src/features/requests/constants/requestsConstants.js` - إضافة neighborhoodIds
8. `src/features/requests/utils/requestsUtils.js` - تحديث mapping
9. `src/features/requests/utils/requestValidation.js` - تحديث validation

## التوافق مع Backend

حسب response من Backend:
```json
{
  "neighborhoodId": 132,
  "requestNeighborhoods": [
    {
      "requestId": 3,
      "neighborhoodId": 132,
      "neighborhood": {
        "id": 132,
        "name": "أحد",
        "cityId": 1
      }
    }
  ],
  "neighborhoodIds": [132],
  "neighborhoods": [
    {
      "id": 132,
      "name": "أحد",
      "cityId": 1
    }
  ]
}
```

الكود الجديد يرسل `neighborhoodIds` كمصفوفة ويستقبل `neighborhoods` من Backend.

## التوافق مع البيانات القديمة

الكود يدعم البيانات القديمة التي تحتوي على `neighborhoodId` واحد فقط:

```javascript
// عند القراءة
neighborhoodIds: request.neighborhoodIds || []

// عند الإرسال
const neighborhoodIds = formData.neighborhoodIds && formData.neighborhoodIds.length > 0
  ? formData.neighborhoodIds
  : formData.neighborhoodId
  ? [toNonNegativeNumberOrNull(formData.neighborhoodId)]
  : [];
```

## تجربة المستخدم

### قبل:
1. اختيار المدينة
2. اختيار حي واحد فقط
3. إذا أراد أحياء متعددة، يجب إنشاء طلبات منفصلة

### بعد:
1. اختيار المدينة
2. اختيار أحياء متعددة من قائمة منسدلة
3. البحث السريع عن الأحياء
4. عرض الأحياء المختارة كـ tags
5. إزالة أي حي بنقرة واحدة

## الاختبار

تم بناء المشروع بنجاح:
```bash
npm run build
✓ 4279 modules transformed.
✓ built in 9.39s
```

## ملاحظات

- ✅ المكون الجديد يستخدم نفس أسلوب التصميم الموجود
- ✅ يدعم الوضع الداكن والفاتح
- ✅ متوافق مع البيانات القديمة
- ✅ validation شامل
- ✅ تجربة مستخدم محسنة
