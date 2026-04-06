# Website CMS Feature

## البنية التنظيمية للكود

تم تنظيم كود Website CMS بشكل احترافي لسهولة الصيانة والتطوير.

### 📁 الهيكل

```
website-cms/
├── components/
│   ├── sections/           # مكونات الأقسام الرئيسية
│   │   ├── SettingsSection.jsx
│   │   ├── HeroSection.jsx
│   │   ├── FeaturedSection.jsx
│   │   ├── HomeSectionsSection.jsx
│   │   ├── SectionAccordionItem.jsx
│   │   └── index.js
│   ├── shared/             # مكونات مشتركة قابلة لإعادة الاستخدام
│   │   ├── FormGroup.jsx
│   │   ├── FormField.jsx
│   │   ├── ListItemCard.jsx
│   │   └── index.js
│   ├── PreviewPanel.jsx    # لوحة المعاينة المباشرة
│   ├── ImageUploadField.jsx
│   └── WebsiteCmsPage.jsx  # الصفحة الرئيسية (Orchestrator)
├── constants/
│   └── websiteCmsConstants.js  # الثوابت والإعدادات
├── hooks/                  # Custom Hooks
├── services/              # API Services
└── README.md
```

### 🎯 المسؤوليات

#### WebsiteCmsPage.jsx (الصفحة الرئيسية)
- إدارة الحالة (State Management)
- التنسيق بين المكونات المختلفة
- معالجة العمليات (Save, Edit, Delete)
- التنقل بين الأقسام

#### Sections Components
كل قسم له مكون خاص به:
- **SettingsSection**: الإعدادات العامة (معلومات الموقع، التواصل، السوشيال ميديا، الشعارات، الخريطة)
- **HeroSection**: شرائح الهيرو (Form + List)
- **FeaturedSection**: العروض المميزة (Form + List)
- **HomeSectionsSection**: أقسام الصفحة الرئيسية (Accordion)

#### Shared Components
مكونات قابلة لإعادة الاستخدام:
- **FormGroup**: مجموعة حقول مع عنوان
- **FormField**: حقل إدخال واحد
- **ListItemCard**: بطاقة عرض عنصر في القائمة

#### PreviewPanel
- معاينة مباشرة للموقع
- أزرار تبديل العرض (Desktop, Tablet, Mobile)
- iframe للصفحة الرئيسية

### 🔧 Constants
جميع الثوابت في ملف واحد:
- `SECTION_KEYS`: مفاتيح أقسام الصفحة الرئيسية
- `emptySettings`, `emptyHero`, `emptyFeatured`: القيم الافتراضية للنماذج
- `inputClasses`, `textAreaClasses`, `cardClasses`: أنماط CSS المشتركة
- `createSectionForm`: دالة إنشاء نموذج قسم جديد

### 📝 ملاحظات
- كل مكون مستقل ويمكن تعديله بدون التأثير على الباقي
- الكود منظم ومقسم بشكل منطقي
- سهل الصيانة والتطوير المستقبلي
- يتبع أفضل الممارسات في React
