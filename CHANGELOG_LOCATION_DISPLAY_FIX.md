# إصلاح عرض الموقع (المدينة والحي) في جداول العروض والطلبات

## التاريخ: 2026-05-10

## المشكلة

في صفحة العروض وصفحة الطلبات، كان عمود "الموقع" في الجدول لا يظهر اسم المدينة والحي بشكل صحيح.

### السبب الجذري:
- الكود كان يحاول الوصول إلى `offer.city` و `offer.district` (أو `request.city` و `request.district`)
- لكن البيانات القادمة من API تحتوي على:
  - `cityId` و `neighborhoodId` (معرفات رقمية)
  - `cityRel` و `neighborhoodRel` (كائنات العلاقات التي تحتوي على الأسماء)
- الحقول `city` و `district` قد تكون فارغة أو غير موجودة في بعض الحالات

## الحل المطبق

تم تحديث مكونات عرض العناصر لاستخدام نفس النمط المستخدم في صفحات التفاصيل:

### الملفات المعدلة:

#### 1. `src/features/offers/components/OfferItem.jsx`

**قبل:**
```javascript
<span>
  {offer.city} - {offer.district}
</span>
```

**بعد:**
```javascript
<span>
  {offer.cityRel?.name || offer.city || "-"} - {offer.neighborhoodRel?.name || offer.district || "-"}
</span>
```

#### 2. `src/features/requests/components/RequestItem.jsx`

**قبل:**
```javascript
<span>
  {request.city} - {request.district}
</span>
```

**بعد:**
```javascript
<span>
  {request.cityRel?.name || request.city || "-"} - {request.neighborhoodRel?.name || request.district || "-"}
</span>
```

## آلية العمل

الكود الجديد يستخدم سلسلة من القيم الاحتياطية (fallback chain):

1. **الأولوية الأولى**: `cityRel?.name` - اسم المدينة من كائن العلاقة
2. **الأولوية الثانية**: `city` - اسم المدينة المخزن مباشرة (للبيانات القديمة)
3. **الأولوية الثالثة**: `"-"` - شرطة إذا لم تتوفر أي بيانات

نفس المنطق ينطبق على الحي (`neighborhoodRel?.name` → `district` → `"-"`)

## التوافق مع API

حسب توثيق Backend (`docs/backend-api-reference-ar.md`):

```
Response:
- تشمل علاقات:
  - createdBy (id/name/role)
  - cityRel
  - neighborhoodRel
  - team
```

هذا يؤكد أن API يرسل `cityRel` و `neighborhoodRel` مع البيانات، مما يجعل الحل متوافق تماماً.

## النتيجة المتوقعة

### قبل الإصلاح:
- عمود الموقع قد يظهر فارغاً أو يعرض قيم غير صحيحة
- قد يظهر `undefined - undefined`

### بعد الإصلاح:
- ✅ عرض اسم المدينة والحي بشكل صحيح من `cityRel` و `neighborhoodRel`
- ✅ دعم البيانات القديمة التي تحتوي على `city` و `district` مباشرة
- ✅ عرض "-" في حالة عدم توفر أي بيانات (بدلاً من undefined)

## الاختبار

تم بناء المشروع بنجاح بدون أخطاء:
```bash
npm run build
✓ 4278 modules transformed.
✓ built in 9.62s
```

## ملاحظات إضافية

- التغييرات متوافقة مع الكود الموجود في `OfferDetailsModal` و `RequestDetailsModal`
- لا توجد تغييرات كبيرة (breaking changes)
- الحل يدعم البيانات القديمة والجديدة
- تم استخدام Optional Chaining (`?.`) لتجنب أخطاء null/undefined

## الملفات ذات الصلة

الملفات التي تستخدم نفس النمط (للمرجعية):
- `src/features/offers/components/OfferDetailsModal.jsx`
- `src/features/requests/components/RequestDetailsModal.jsx`
- `src/features/matches/components/MatchDetailsModal.jsx`
