import React, { useState } from "react";
import { motion } from "framer-motion";
import { Buildings, MapPin, Ruler, Money, Star, User, Phone, Globe, TextAlignLeft, WarningCircle, Eye, EyeSlash, Tree, FileText } from "phosphor-react";
import Modal from "../../../components/Modal";
import { getLabelByValue, getColorByValue, PROPERTY_TYPES, USAGE_TYPES, PURPOSE_TYPES, PRIORITY_TYPES, SUBMITTED_BY_TYPES, getPropertySubTypeLabel, LAND_STATUSES } from "../../../constants/enums";
import { getRequestCode } from "../../../utils/entityCodes";
import { getRelativeTimeText } from "../utils/requestsUtils";

const DetailItem = ({ icon: Icon, label, value, color = "slate", isHideable = false }) => {
    const [isHidden, setIsHidden] = useState(!isHideable);
    return (
        <div className="flex items-center justify-between p-3 rounded-xl border flex-1 h-full" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }}>
            <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-${color}-500/10 text-${color}-400 shrink-0`}>
                    <Icon size={20} />
                </div>
                <div>
                    <span className="block text-xs mb-1" style={{ color: "var(--text-color)" }}>{label}</span>
                    <span className="text-sm font-medium" style={{ color: "var(--text-color)" }}>
                        {isHideable && isHidden ? "*******" : (value || "-")}
                    </span>
                </div>
            </div>
            {isHideable && (
                <button 
                    onClick={() => setIsHidden(!isHidden)} 
                    className="p-1.5 rounded-lg text-slate-400 hover:text-violet-400 hover:bg-slate-500/10 transition-colors"
                >
                    {isHidden ? <EyeSlash size={18} /> : <Eye size={18} />}
                </button>
            )}
        </div>
    );
};

const RequestDetailsModal = ({ isOpen, onClose, request }) => {
    if (!request) return null;

    const submitterName = request.createdBy?.name || request.brokerContactName;
    const submitterType = getLabelByValue(SUBMITTED_BY_TYPES, request.submittedBy);
    const submitterValue = submitterName 
        ? `${submitterName}${submitterType && submitterType !== submitterName ? ` (${submitterType})` : ''}` 
        : (submitterType || "غير محدد");

    const formattedArea = request.areaFrom === request.areaTo || !request.areaTo 
        ? `${request.areaFrom || 0} م²` 
        : `${request.areaFrom || 0} - ${request.areaTo} م²`;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="تفاصيل الطلب العقاري">
            <div className="space-y-6 text-right">
                {/* Header Info */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded text-xs font-bold bg-violet-500/20 text-violet-400 border border-violet-500/30">
                                {getPropertySubTypeLabel(request.usage, request.propertySubType)}
                            </span>
                            <span className="text-xs" style={{ color: "var(--text-color)" }}>•</span>
                            <span className="text-sm font-bold" style={{ color: "var(--text-color)" }}>
                                {getLabelByValue(USAGE_TYPES, request.usage)}
                            </span>
                        </div>
                        <div className="mb-1 inline-flex rounded-lg border border-violet-500/25 bg-violet-500/10 px-2 py-0.5 font-mono text-xs font-semibold text-violet-300">
                            {getRequestCode(request)}
                        </div>
                        <div className="text-xs" style={{ color: "var(--text-color)" }}>
                            تم الإنشاء: {getRelativeTimeText(request.createdAt)}
                        </div>
                    </div>
                    <div className="text-left">
                        <div className="text-lg font-bold text-violet-400">
                            {Number(request.budgetFrom || 0).toLocaleString()} - {Number(request.budgetTo || 0).toLocaleString()} ر.س
                        </div>
                        <span className="text-xs" style={{ color: "var(--text-color)" }}>الميزانية</span>
                    </div>
                </div>

                {/* Main Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <DetailItem
                        icon={FileText}
                        label="كود الطلب"
                        value={getRequestCode(request)}
                        color="violet"
                    />
                    <DetailItem
                        icon={MapPin}
                        label="الموقع"
                        value={
                          request.neighborhoods && request.neighborhoods.length > 0
                            ? `${request.cityRel?.name || request.city || "-"} - ${request.neighborhoods.map(n => n.name).join("، ")}`
                            : `${request.cityRel?.name || request.city || "-"} - ${request.neighborhoodRel?.name || request.district || "-"}`
                        }
                        color="slate"
                    />
                    <DetailItem
                        icon={Ruler}
                        label="المساحة المطلوبة"
                        value={formattedArea}
                        color="slate"
                    />
                    <DetailItem
                        icon={WarningCircle}
                        label="الأولوية"
                        value={getLabelByValue(PRIORITY_TYPES, request.priority)}
                        color={getColorByValue(PRIORITY_TYPES, request.priority)}
                    />
                    <DetailItem
                        icon={Money}
                        label="الغرض"
                        value={getLabelByValue(PURPOSE_TYPES, request.purpose)}
                        color="amber"
                    />
                    <DetailItem
                        icon={User}
                        label="مقدم الطلب"
                        value={submitterValue}
                        color="blue"
                        isHideable
                    />
                    <DetailItem
                        icon={Phone}
                        label="رقم التواصل"
                        value={request.brokerContactPhone}
                        color="rose"
                        isHideable
                    />
                    {request.landStatus && (
                        <DetailItem
                            icon={Tree}
                            label="حالة الأرض"
                            value={getLabelByValue(LAND_STATUSES, request.landStatus)}
                            color="lime"
                        />
                    )}
                </div>

                {/* Description */}
                {request.description && (
                    <div className="p-4 rounded-xl border"
                        style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }}>
                        <h4 className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: "var(--text-color)" }}>
                            <TextAlignLeft size={18} />
                            الوصف
                        </h4>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--text-color)" }}>
                            {request.description}
                        </p>
                    </div>
                )}

                {/* Footer Actions */}
                <div className="flex justify-end pt-4 border-t" style={{ borderColor: "var(--border-color)" }}>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                        style={{
                            backgroundColor: "var(--card-bg)",
                            color: "var(--text-color)",
                            border: "1px solid var(--border-color)",
                        }}
                    >
                        إغلاق
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default RequestDetailsModal;
