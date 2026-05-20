import React, { forwardRef } from 'react';
import { getLabelByValue, USAGE_TYPES, PURPOSE_TYPES, getPropertySubTypeLabel } from "../../constants/enums";
import { getOfferCode } from "../../utils/entityCodes";
import { getRequestCode } from "../../utils/entityCodes"; // Assuming this exists or using generic code logic

// Function to format price/area gracefully
const formatRange = (from, to, suffix) => {
    if (!from && !to) return "-";
    if (from && !to) return `${from.toLocaleString()} ${suffix}`;
    if (!from && to) return `${to.toLocaleString()} ${suffix}`;
    if (from === to) return `${from.toLocaleString()} ${suffix}`;
    return `${from.toLocaleString()} - ${to.toLocaleString()} ${suffix}`;
};

const EntityImageExport = forwardRef(({ entity, entityType }, ref) => {
    if (!entity) return null;

    const isOffer = entityType === 'offer';
    const code = isOffer ? getOfferCode(entity) : (entity.id ? `RE-${entity.id}` : "-"); // Adjust getRequestCode as needed
    const typeLabel = getPropertySubTypeLabel(entity.usage, entity.propertySubType);
    const usageLabel = getLabelByValue(USAGE_TYPES, entity.usage);
    
    // Dynamically set SALE label based on entity type
    let purposeLabel = getLabelByValue(PURPOSE_TYPES, entity.purpose);
    if (entity.purpose === 'SALE') {
        purposeLabel = isOffer ? 'بيع' : 'شراء';
    }
    
    const location = `${entity.cityRel?.name || entity.city || "-"} - ${entity.neighborhoodRel?.name || entity.district || "-"}`;
    const area = formatRange(entity.areaFrom, entity.areaTo, "م²");
    const priceOrBudget = isOffer 
        ? formatRange(entity.priceFrom, entity.priceTo, "ر.س")
        : formatRange(entity.budgetFrom, entity.budgetTo, "ر.س");

    return (
        <div 
            ref={ref} 
            className="w-[600px] bg-white p-8 font-sans" 
            style={{ 
                direction: 'rtl',
                background: 'linear-gradient(to bottom right, #ffffff, #f0fdf4)',
                position: 'fixed',
                top: '-9999px',
                left: '-9999px',
                zIndex: -1
            }}
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-emerald-100">
                <div className="flex items-center gap-3">
                    <img src="/logo-black.png" alt="رواسخ" className="h-12 object-contain" onError={(e) => e.target.style.display = 'none'} />
                    <div>
                        <h2 className="text-2xl font-bold text-emerald-900 m-0 p-0 leading-tight">
                            {isOffer ? 'عرض عقاري' : 'طلب عقاري'}
                        </h2>
                        <span className="text-emerald-600 text-sm font-semibold">{code}</span>
                    </div>
                </div>
                <div className="text-left bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 shadow-sm">
                    <div className="text-xs text-emerald-600 font-bold mb-1">
                        {isOffer ? 'السعر' : 'الميزانية'}
                    </div>
                    <div className="text-lg font-bold text-emerald-700">
                        {priceOrBudget}
                    </div>
                </div>
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-white p-3 rounded-xl border border-emerald-50 flex items-center shadow-sm">
                    <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600 ml-3">📍</div>
                    <div>
                        <div className="text-[10px] text-gray-500 font-semibold">الموقع</div>
                        <div className="text-sm font-bold text-gray-800">{location}</div>
                    </div>
                </div>
                
                <div className="bg-white p-3 rounded-xl border border-emerald-50 flex items-center shadow-sm">
                    <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600 ml-3">📏</div>
                    <div>
                        <div className="text-[10px] text-gray-500 font-semibold">المساحة</div>
                        <div className="text-sm font-bold text-gray-800">{area}</div>
                    </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-emerald-50 flex items-center shadow-sm">
                    <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600 ml-3">🏢</div>
                    <div>
                        <div className="text-[10px] text-gray-500 font-semibold">التصنيف</div>
                        <div className="text-sm font-bold text-gray-800">{typeLabel} ({usageLabel})</div>
                    </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-emerald-50 flex items-center shadow-sm">
                    <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600 ml-3">🎯</div>
                    <div>
                        <div className="text-[10px] text-gray-500 font-semibold">الغرض</div>
                        <div className="text-sm font-bold text-gray-800">{purposeLabel}</div>
                    </div>
                </div>
            </div>

            {/* Description */}
            {entity.description && (
                <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm mb-6">
                    <div className="text-xs text-emerald-600 font-bold mb-2">التفاصيل:</div>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap m-0">
                        {entity.description}
                    </p>
                </div>
            )}

            {/* Footer */}
            <div className="text-center pt-4 border-t border-emerald-100/50">
                <p className="text-emerald-700 font-bold text-sm">رواسخ العقارية - خيارك الأول </p>
                <p className="text-emerald-500/70 text-xs mt-1">تطبيق رواسخ للمطابقة العقارية الذكية</p>
            </div>
        </div>
    );
});

export default EntityImageExport;
