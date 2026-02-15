import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "phosphor-react";
import Modal from "../../../components/Modal";

const ACTION_OPTIONS = [
    { value: "OFFER", label: "عرض" },
    { value: "REQUEST", label: "طلب" },
];

const inputClasses =
    "w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/40 transition-all";

const labelClasses = "block text-sm font-medium text-slate-300 mb-2";

const SubmissionLinkModal = ({ isOpen, onClose, user, mutation }) => {
    const [expiresInDays, setExpiresInDays] = useState(7);
    const [allowedActions, setAllowedActions] = useState(["OFFER", "REQUEST"]);
    const [generatedLink, setGeneratedLink] = useState(null);
    const [copied, setCopied] = useState(false);

    const handleActionToggle = (action) => {
        setAllowedActions((prev) =>
            prev.includes(action)
                ? prev.filter((a) => a !== action)
                : [...prev, action]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (allowedActions.length === 0) return;

        mutation.mutate(
            {
                userId: user.id,
                expiresInDays: expiresInDays || undefined,
                allowedActions,
            },
            {
                onSuccess: (data) => {
                    const token = data?.data?.token || data?.token || "";
                    const link = token
                        ? `${window.location.origin}/submit?token=${token}`
                        : "";
                    setGeneratedLink(link);
                },
            }
        );
    };

    const handleCopy = async () => {
        if (!generatedLink) return;
        try {
            await navigator.clipboard.writeText(generatedLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // fallback
            const textarea = document.createElement("textarea");
            textarea.value = generatedLink;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleClose = () => {
        setGeneratedLink(null);
        setCopied(false);
        setExpiresInDays(7);
        setAllowedActions(["OFFER", "REQUEST"]);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={`رابط تقديم — ${user?.name || ""}`}
        >
            {generatedLink ? (
                <div className="space-y-4 text-right">
                    <p className="text-sm text-slate-300">
                        تم إنشاء الرابط بنجاح. يمكنك نسخه ومشاركته:
                    </p>

                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-3">
                        <input
                            readOnly
                            value={generatedLink}
                            dir="ltr"
                            className="flex-1 bg-transparent text-sm text-emerald-400 outline-none font-mono"
                        />
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleCopy}
                            className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${copied
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-white/5 text-slate-400 hover:bg-white/10"
                                }`}
                            title="نسخ الرابط"
                        >
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                        </motion.button>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={handleClose}
                        className="w-full rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold py-3 hover:bg-white/10 transition-all duration-300"
                    >
                        إغلاق
                    </motion.button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-5 text-right">
                    <div>
                        <label className={labelClasses}>الإجراءات المسموحة</label>
                        <div className="flex items-center gap-3">
                            {ACTION_OPTIONS.map((opt) => (
                                <label
                                    key={opt.value}
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={allowedActions.includes(opt.value)}
                                        onChange={() => handleActionToggle(opt.value)}
                                        className="w-4 h-4 rounded border-white/20 bg-white/5 text-emerald-500 focus:ring-emerald-500/40 accent-emerald-500"
                                    />
                                    <span className="text-sm text-slate-300">{opt.label}</span>
                                </label>
                            ))}
                        </div>
                        {allowedActions.length === 0 && (
                            <p className="mt-1.5 text-xs text-rose-400">
                                يجب اختيار إجراء واحد على الأقل
                            </p>
                        )}
                    </div>

                    <div>
                        <label className={labelClasses}>
                            مدة الصلاحية (بالأيام)
                            <span className="text-slate-500 text-xs mr-2">(اختياري)</span>
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="365"
                            value={expiresInDays}
                            onChange={(e) => setExpiresInDays(Number(e.target.value))}
                            className={inputClasses}
                            placeholder="7"
                            dir="ltr"
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="submit"
                        disabled={mutation.isPending || allowedActions.length === 0}
                        className="w-full rounded-xl bg-gradient-to-l from-emerald-500 to-cyan-500 text-white text-sm font-bold py-3.5 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {mutation.isPending ? "جاري الإنشاء..." : "إنشاء الرابط"}
                    </motion.button>
                </form>
            )}
        </Modal>
    );
};

export default SubmissionLinkModal;
