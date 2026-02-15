import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Buildings,
    MagnifyingGlass,
    CheckCircle,
    WarningCircle,
    ArrowCounterClockwise,
} from "phosphor-react";
import { Toaster } from "sonner";
import { useSubmission } from "../hooks/useSubmission";
import SubmissionOfferForm from "./SubmissionOfferForm";
import SubmissionRequestForm from "./SubmissionRequestForm";

const SubmissionPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const {
        view,
        setView,
        offerForm,
        requestForm,
        handleOfferChange,
        handleRequestChange,
        submitOffer,
        submitRequest,
        resetAndGoBack,
        isSubmitting,
    } = useSubmission(token);

    // لو مفيش token
    if (!token) {
        return (
            <PageWrapper>
                <ErrorView
                    title="رابط غير صالح"
                    message="الرابط الذي استخدمته غير صالح أو لا يحتوي على رمز التحقق المطلوب."
                />
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <Toaster
                position="top-center"
                toastOptions={{
                    style: {
                        background: "#1e293b",
                        color: "#fff",
                        border: "1px solid rgba(255,255,255,0.1)",
                    },
                }}
            />

            <AnimatePresence mode="wait">
                {view === "landing" && (
                    <LandingView
                        key="landing"
                        onSelectOffer={() => setView("offer")}
                        onSelectRequest={() => setView("request")}
                    />
                )}

                {view === "offer" && (
                    <motion.div
                        key="offer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <SubmissionOfferForm
                            form={offerForm}
                            onChange={handleOfferChange}
                            onSubmit={submitOffer}
                            onBack={resetAndGoBack}
                            isSubmitting={isSubmitting}
                        />
                    </motion.div>
                )}

                {view === "request" && (
                    <motion.div
                        key="request"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <SubmissionRequestForm
                            form={requestForm}
                            onChange={handleRequestChange}
                            onSubmit={submitRequest}
                            onBack={resetAndGoBack}
                            isSubmitting={isSubmitting}
                        />
                    </motion.div>
                )}

                {view === "success" && (
                    <SuccessView key="success" onReset={resetAndGoBack} />
                )}
            </AnimatePresence>
        </PageWrapper>
    );
};

// ─── Page Wrapper ───
const PageWrapper = ({ children }) => (
    <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{
            background:
                "linear-gradient(135deg, #0a0f1c 0%, #111827 40%, #0d1526 100%)",
        }}
        dir="rtl"
    >
        <div className="w-full max-w-2xl">
            <div className="bg-[#111827]/80 backdrop-blur-xl rounded-3xl border border-white/5 p-6 sm:p-8 shadow-2xl">
                {children}
            </div>
        </div>
    </div>
);

// ─── Landing View ───
const LandingView = ({ onSelectOffer, onSelectRequest }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="text-center space-y-8"
    >
        {/* Logo */}
        <div className="space-y-3">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <Buildings size={32} weight="duotone" className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">نظام إدارة العقارات</h1>
            <p className="text-slate-400 text-sm">
                استخدم هذه الصفحة لإضافة عرض عقاري أو طلب جديد
            </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={onSelectOffer}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 text-right transition-all duration-300 hover:border-emerald-500/30 hover:bg-emerald-500/5"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-l from-emerald-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                    <Buildings
                        size={24}
                        weight="duotone"
                        className="text-emerald-400"
                    />
                </div>
                <h3 className="font-bold text-white mb-1">إضافة عرض</h3>
                <p className="text-xs text-slate-400">
                    أضف عرض عقاري جديد للنظام
                </p>
            </motion.button>

            <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={onSelectRequest}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 text-right transition-all duration-300 hover:border-violet-500/30 hover:bg-violet-500/5"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-l from-violet-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-4">
                    <MagnifyingGlass
                        size={24}
                        weight="duotone"
                        className="text-violet-400"
                    />
                </div>
                <h3 className="font-bold text-white mb-1">إضافة طلب</h3>
                <p className="text-xs text-slate-400">
                    أضف طلب عقاري جديد للنظام
                </p>
            </motion.button>
        </div>
    </motion.div>
);

// ─── Success View ───
const SuccessView = ({ onReset }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center space-y-6 py-8"
    >
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6, delay: 0.1 }}
        >
            <CheckCircle
                size={80}
                weight="duotone"
                className="text-emerald-400 mx-auto"
            />
        </motion.div>
        <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">تم الإرسال بنجاح!</h2>
            <p className="text-slate-400 text-sm">
                تم إرسال البيانات بنجاح وسيتم مراجعتها في أقرب وقت
            </p>
        </div>
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-6 py-3 text-sm font-medium text-white hover:bg-white/10 transition-all"
        >
            <ArrowCounterClockwise size={18} />
            إضافة بيانات جديدة
        </motion.button>
    </motion.div>
);

// ─── Error View ───
const ErrorView = ({ title, message }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-4 py-8"
    >
        <WarningCircle
            size={64}
            weight="duotone"
            className="text-red-400 mx-auto"
        />
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <p className="text-slate-400 text-sm">{message}</p>
    </motion.div>
);

export default SubmissionPage;
