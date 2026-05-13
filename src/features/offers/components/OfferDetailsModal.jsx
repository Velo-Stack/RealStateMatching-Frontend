import React, { useState } from "react";
import { motion } from "framer-motion";
import { Buildings, MapPin, Ruler, Money, Star, User, Phone, Globe, Eye, EyeSlash, FileText, Users, ArrowsOut, Wall, Tree, ChatCircle } from "phosphor-react";
import { useNavigate } from "react-router-dom";
import { toPng } from "html-to-image";
import EntityImageExport from "../../../components/common/EntityImageExport";
import Modal from "../../../components/Modal";
import { getLabelByValue, getColorByValue, PROPERTY_TYPES, USAGE_TYPES, PURPOSE_TYPES, EXCLUSIVITY_TYPES, CONTRACT_TYPES, SUBMITTED_BY_TYPES, getPropertySubTypeLabel, LAND_STATUSES } from "../../../constants/enums";
import { getOfferCode } from "../../../utils/entityCodes";
import { getRelativeTimeText } from "../utils/offersUtils";
import { useAuth } from "../../../context/AuthContext";
import { hasRole, ROLES } from "../../../utils/rbac";

const DetailItem = ({ icon: Icon, label, value, color = "slate", isHideable = false, onChatClick = null, showChatIcon = false }) => {
    const [isHidden, setIsHidden] = useState(!isHideable);
    return (
        <div className="flex items-center justify-between p-3 rounded-xl border flex-1 h-full" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }}>
            <div className="flex items-start gap-3 flex-1">
                <div className={`p-2 rounded-lg bg-${color}-500/10 text-${color}-400 shrink-0`}>
                    <Icon size={20} />
                </div>
                <div className="flex-1">
                    <span className="block text-xs mb-1" style={{ color: "var(--text-color)" }}>{label}</span>
                    <span className="text-sm font-medium" style={{ color: "var(--text-color)" }}>
                        {isHideable && isHidden ? "*******" : (value || "-")}
                    </span>
                </div>
            </div>
            <div className="flex items-center gap-2">
                {showChatIcon && onChatClick && (
                    <button
                        onClick={onChatClick}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                        title="فتح محادثة"
                    >
                        <ChatCircle size={18} weight="fill" />
                    </button>
                )}
                {isHideable && (
                    <button 
                        onClick={() => setIsHidden(!isHidden)} 
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-500/10 transition-colors"
                    >
                        {isHidden ? <EyeSlash size={18} /> : <Eye size={18} />}
                    </button>
                )}
            </div>
        </div>
    );
};

const OfferDetailsModal = ({ isOpen, onClose, offer }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const isAdmin = hasRole(user, [ROLES.ADMIN]);
    const exportRef = React.useRef(null);
    const [isExporting, setIsExporting] = useState(false);
    
    if (!offer) return null;

    const submitterName = offer.createdBy?.name || offer.brokerContactName;
    const submitterType = getLabelByValue(SUBMITTED_BY_TYPES, offer.submittedBy);
    const submitterValue = submitterName 
        ? `${submitterName}${submitterType && submitterType !== submitterName ? ` (${submitterType})` : ''}` 
        : (submitterType || "غير محدد");

    const handleChatClick = () => {
        if (offer.createdBy?.id) {
            navigate(`/app/chat?userId=${offer.createdBy.id}`);
            onClose();
        }
    };

    const formattedArea = offer.areaFrom === offer.areaTo || !offer.areaTo 
        ? `${offer.areaFrom || 0} م²` 
        : `${offer.areaFrom || 0} - ${offer.areaTo} م²`;

    const handleExportImage = async () => {
        if (!exportRef.current) return;
        setIsExporting(true);
        try {
            // Un-hide temporarily for SVG rendering (html-to-image needs valid dimensions)
            const node = exportRef.current;
            node.style.top = "0";
            node.style.left = "0";
            node.style.zIndex = "-1";
            
            const dataUrl = await toPng(node, {
                cacheBust: true,
                pixelRatio: 2,
            });
            
            // Re-hide
            node.style.top = "-9999px";
            node.style.left = "-9999px";

            const link = document.createElement("a");
            link.download = `offer-${getOfferCode(offer)}.png`;
            link.href = dataUrl;
            link.click();
        } catch (error) {
            console.error("Error exporting image", error);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="تفاصيل العرض العقاري">
            <div className="space-y-6">
                {/* Header Info */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                {getPropertySubTypeLabel(offer.usage, offer.propertySubType)}
                            </span>
                            <span className="text-xs" style={{ color: "var(--text-color)" }}>•</span>
                            <span className="text-sm font-bold" style={{ color: "var(--text-color)" }}>
                                {getLabelByValue(USAGE_TYPES, offer.usage)}
                            </span>
                        </div>
                        <div className="mb-1 inline-flex rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 font-mono text-xs font-semibold text-emerald-300">
                            {getOfferCode(offer)}
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
                        icon={FileText}
                        label="كود العرض"
                        value={getOfferCode(offer)}
                        color="emerald"
                    />
                    <DetailItem
                        icon={MapPin}
                        label="الموقع"
                        value={`${offer.cityRel?.name || offer.city || "-"} - ${offer.neighborhoodRel?.name || offer.district || "-"}`}
                        color="slate"
                    />
                    <DetailItem
                        icon={Ruler}
                        label="المساحة"
                        value={formattedArea}
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
                        color="slate"
                    />
                    <DetailItem
                        icon={User}
                        label="مقدم العرض"
                        value={submitterValue}
                        color="blue"
                        isHideable
                        showChatIcon={isAdmin && offer.createdBy?.id}
                        onChatClick={handleChatClick}
                    />
                    <DetailItem
                        icon={Phone}
                        label="رقم التواصل"
                        value={offer.brokerContactPhone}
                        color="rose"
                        isHideable
                    />
                    {offer.contractType && (
                        <DetailItem
                            icon={FileText}
                            label="طبيعة التعاقد"
                            value={getLabelByValue(CONTRACT_TYPES, offer.contractType)}
                            color="indigo"
                        />
                    )}
                    {offer.brokersCount !== undefined && offer.brokersCount !== null && (
                        <DetailItem
                            icon={Users}
                            label="عدد الوسطاء"
                            value={offer.brokersCount}
                            color="teal"
                        />
                    )}
                    {offer.lengths && (
                        <DetailItem
                            icon={ArrowsOut}
                            label="الأطوال"
                            value={offer.lengths}
                            color="emerald"
                        />
                    )}
                    {offer.facades && (
                        <DetailItem
                            icon={Wall}
                            label="الواجهات"
                            value={offer.facades}
                            color="orange"
                        />
                    )}
                    {offer.landStatus && (
                        <DetailItem
                            icon={Tree}
                            label="حالة الأرض"
                            value={getLabelByValue(LAND_STATUSES, offer.landStatus)}
                            color="lime"
                        />
                    )}
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
                <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: "var(--border-color)" }}>
                    {isAdmin && (
                        <button
                            onClick={handleExportImage}
                            disabled={isExporting}
                            className="px-6 py-2 rounded-lg text-sm font-medium transition-colors bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 flex items-center gap-2 disabled:opacity-50"
                        >
                            <FileText size={18} />
                            {isExporting ? "جاري التصدير..." : "تصدير كصورة"}
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-lg text-sm font-medium transition-colors" style={{ backgroundColor: "var(--card-bg)", color: "var(--text-color)", border: "1px solid var(--border-color)" }}
                    >
                        إغلاق
                    </button>
                </div>
            </div>
            
            {/* Hidden Export Component */}
            {isAdmin && <EntityImageExport ref={exportRef} entity={offer} entityType="offer" />}
        </Modal>
    );
};

export default OfferDetailsModal;


