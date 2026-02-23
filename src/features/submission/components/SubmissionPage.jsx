import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "sonner";
import { useSubmission } from "../hooks/useSubmission";
import SubmissionOfferForm from "./SubmissionOfferForm";
import SubmissionRequestForm from "./SubmissionRequestForm";
import SubmissionPageWrapper from "./SubmissionPageWrapper";
import SubmissionLandingView from "./SubmissionLandingView";
import SubmissionSuccessView from "./SubmissionSuccessView";
import SubmissionErrorView from "./SubmissionErrorView";

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
            <SubmissionPageWrapper>
                <SubmissionErrorView
                    title="رابط غير صالح"
                    message="الرابط الذي استخدمته غير صالح أو لا يحتوي على رمز التحقق المطلوب."
                />
            </SubmissionPageWrapper>
        );
    }

    return (
        <SubmissionPageWrapper>
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
                    <SubmissionLandingView
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
                    <SubmissionSuccessView key="success" onReset={resetAndGoBack} />
                )}
            </AnimatePresence>
        </SubmissionPageWrapper>
    );
};

export default SubmissionPage;
