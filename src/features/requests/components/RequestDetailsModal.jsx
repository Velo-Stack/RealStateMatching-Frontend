import { motion } from "framer-motion";
import { Buildings, MapPin, Ruler, Money, Star, User, Phone, Globe, TextAlignLeft, WarningCircle } from "phosphor-react";
import Modal from "../../../components/Modal";
import { getLabelByValue, getColorByValue, PROPERTY_TYPES, USAGE_TYPES, PURPOSE_TYPES, PRIORITY_TYPES, SUBMITTED_BY_TYPES } from "../../../constants/enums";
import { getRelativeTimeText } from "../utils/requestsUtils";

const DetailItem = ({ icon: Icon, label, value, color = "slate" }) => (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
        <div className={`p-2 rounded-lg bg-${color}-500/10 text-${color}-400`}>
            <Icon size={20} />
        </div>
        <div>
            <span className="block text-xs text-slate-400 mb-1">{label}</span>
            <span className="text-sm text-white font-medium">{value || "-"}</span>
        </div>
    </div>
);

const RequestDetailsModal = ({ isOpen, onClose, request }) => {
    if (!request) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="تفاصيل الطلب العقاري">
            <div className="space-y-6 text-right">
                {/* Header Info */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded text-xs font-bold bg-violet-500/20 text-violet-400 border border-violet-500/30">
                                {getLabelByValue(PROPERTY_TYPES, request.type)}
                            </span>
                            <span className="text-slate-400 text-xs">•</span>
                            <span className="text-sm text-white font-bold">
                                {getLabelByValue(USAGE_TYPES, request.usage)}
                            </span>
                        </div>
                        <div className="text-xs text-slate-400">
                            تم الإنشاء: {getRelativeTimeText(request.createdAt)}
                        </div>
                    </div>
                    <div className="text-left">
                        <div className="text-lg font-bold text-violet-400">
                            {Number(request.budgetFrom || 0).toLocaleString()} - {Number(request.budgetTo || 0).toLocaleString()} ر.س
                        </div>
                        <span className="text-xs text-slate-500">الميزانية</span>
                    </div>
                </div>

                {/* Main Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <DetailItem
                        icon={MapPin}
                        label="الموقع"
                        value={`${request.city || "-"} - ${request.district || "-"}`}
                        color="cyan"
                    />
                    <DetailItem
                        icon={Ruler}
                        label="المساحة المطلوبة"
                        value={`${request.areaFrom} - ${request.areaTo} م²`}
                        color="emerald"
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
                        value={getLabelByValue(SUBMITTED_BY_TYPES, request.submittedBy)}
                        color="blue"
                    />
                    <DetailItem
                        icon={Phone}
                        label="رقم التواصل"
                        value={request.brokerContactPhone}
                        color="rose"
                    />
                </div>

                {/* Description */}
                {request.description && (
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <h4 className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                            <TextAlignLeft size={18} />
                            الوصف
                        </h4>
                        <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-wrap">
                            {request.description}
                        </p>
                    </div>
                )}

                {/* Footer Actions */}
                <div className="flex justify-end pt-4 border-t border-white/5">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors"
                    >
                        إغلاق
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default RequestDetailsModal;
