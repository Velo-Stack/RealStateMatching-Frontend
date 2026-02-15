import { motion } from "framer-motion";
import { Buildings, MapPin, Ruler, Money, Star, User, Phone, Globe } from "phosphor-react";
import Modal from "../../../components/Modal";
import { getLabelByValue, getColorByValue, PROPERTY_TYPES, USAGE_TYPES, PURPOSE_TYPES, EXCLUSIVITY_TYPES, CONTRACT_TYPES, SUBMITTED_BY_TYPES } from "../../../constants/enums";
import { getRelativeTimeText } from "../utils/offersUtils";

const DetailItem = ({ icon: Icon, label, value, color = "slate" }) => (
    <div className="flex items-start gap-3 p-3 rounded-xl border" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }}>
        <div className={`p-2 rounded-lg bg-${color}-500/10 text-${color}-400`}>
            <Icon size={20} />
        </div>
        <div>
            <span className="block text-xs mb-1" style={{ color: "var(--text-color)" }}>{label}</span>
            <span className="text-sm font-medium" style={{ color: "var(--text-color)" }}>{value || "-"}</span>
        </div>
    </div>
);

const OfferDetailsModal = ({ isOpen, onClose, offer }) => {
    if (!offer) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="تفاصيل العرض العقاري">
            <div className="space-y-6">
                {/* Header Info */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                {getLabelByValue(PROPERTY_TYPES, offer.type)}
                            </span>
                            <span className="text-xs" style={{ color: "var(--text-color)" }}>•</span>
                            <span className="text-sm font-bold" style={{ color: "var(--text-color)" }}>
                                {getLabelByValue(USAGE_TYPES, offer.usage)}
                            </span>
                        </div>
                        <div className="text-xs" style={{ color: "var(--text-color)" }}>
                            تم الإنشاء: {getRelativeTimeText(offer.createdAt)}
                        </div>
                    </div>
                    <div className="text-left">
                        <div className="text-lg font-bold text-emerald-400">
                            {Number(offer.priceFrom || offer.priceTo || 0).toLocaleString()} ر.س
                        </div>
                        <span className="text-xs" style={{ color: "var(--text-color)" }}>السعر المطلوب</span>
                    </div>
                </div>

                {/* Main Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <DetailItem
                        icon={MapPin}
                        label="الموقع"
                        value={`${offer.city || "-"} - ${offer.district || "-"}`}
                        color="cyan"
                    />
                    <DetailItem
                        icon={Ruler}
                        label="المساحة"
                        value={`${offer.areaFrom} - ${offer.areaTo} م²`}
                        color="violet"
                    />
                    <DetailItem
                        icon={Star}
                        label="الحصرية"
                        value={getLabelByValue(EXCLUSIVITY_TYPES, offer.exclusivity)}
                        color="amber"
                    />
                    <DetailItem
                        icon={Money}
                        label="الغرض"
                        value={getLabelByValue(PURPOSE_TYPES, offer.purpose)}
                        color="emerald"
                    />
                    <DetailItem
                        icon={User}
                        label="مقدم العرض"
                        value={getLabelByValue(SUBMITTED_BY_TYPES, offer.submittedBy)}
                        color="blue"
                    />
                    <DetailItem
                        icon={Phone}
                        label="رقم التواصل"
                        value={offer.brokerContactPhone}
                        color="rose"
                    />
                </div>

                {/* Description */}
                {offer.description && (
                    <div className="p-4 rounded-xl border" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }}>
                        <h4 className="text-sm font-medium mb-2" style={{ color: "var(--text-color)" }}>الوصف</h4>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--text-color)" }}>
                            {offer.description}
                        </p>
                    </div>
                )}

                {/* Map Link */}
                {offer.coordinates && (
                    <a
                        href={offer.coordinates}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-colors"
                    >
                        <Globe size={20} />
                        <span className="text-sm font-medium">عرض الموقع على الخريطة (Google Maps)</span>
                    </a>
                )}

                {/* Footer Actions */}
                <div className="flex justify-end pt-4 border-t" style={{ borderColor: "var(--border-color)" }}>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-lg text-sm font-medium transition-colors" style={{ backgroundColor: "var(--card-bg)", color: "var(--text-color)", border: "1px solid var(--border-color)" }}
                    >
                        إغلاق
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default OfferDetailsModal;
