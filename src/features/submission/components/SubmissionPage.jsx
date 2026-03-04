import { useSearchParams } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
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
        handleOfferUsageChange,
        handleRequestUsageChange,
        handleOfferPropertySubTypeChange,
        handleRequestPropertySubTypeChange,
        handleOfferPriceChange,
        handleOfferPricePaste,
        handleOfferPriceKeyDown,
        handleOfferPhoneChange,
        handleOfferPhonePaste,
        handleOfferPhoneKeyDown,
        handleOfferAreaChange,
        handleOfferAreaPaste,
        handleOfferAreaKeyDown,
        handleRequestPhoneChange,
        handleRequestPhonePaste,
        handleRequestPhoneKeyDown,
        handleRequestAreaChange,
        handleRequestAreaPaste,
        handleRequestAreaKeyDown,
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
                    <Motion.div
                        key="offer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <SubmissionOfferForm
                            form={offerForm}
                            onChange={handleOfferChange}
                            onUsageChange={handleOfferUsageChange}
                            onPropertySubTypeChange={handleOfferPropertySubTypeChange}
                            onAreaChange={handleOfferAreaChange}
                            onAreaPaste={handleOfferAreaPaste}
                            onAreaKeyDown={handleOfferAreaKeyDown}
                            onPriceChange={handleOfferPriceChange}
                            onPricePaste={handleOfferPricePaste}
                            onPriceKeyDown={handleOfferPriceKeyDown}
                            onPhoneChange={handleOfferPhoneChange}
                            onPhonePaste={handleOfferPhonePaste}
                            onPhoneKeyDown={handleOfferPhoneKeyDown}
                            onSubmit={submitOffer}
                            onBack={resetAndGoBack}
                            isSubmitting={isSubmitting}
                        />
                    </Motion.div>
                )}

                {view === "request" && (
                    <Motion.div
                        key="request"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <SubmissionRequestForm
                            form={requestForm}
                            onChange={handleRequestChange}
                            onUsageChange={handleRequestUsageChange}
                            onPropertySubTypeChange={handleRequestPropertySubTypeChange}
                            onAreaChange={handleRequestAreaChange}
                            onAreaPaste={handleRequestAreaPaste}
                            onAreaKeyDown={handleRequestAreaKeyDown}
                            onPhoneChange={handleRequestPhoneChange}
                            onPhonePaste={handleRequestPhonePaste}
                            onPhoneKeyDown={handleRequestPhoneKeyDown}
                            onSubmit={submitRequest}
                            onBack={resetAndGoBack}
                            isSubmitting={isSubmitting}
                        />
                    </Motion.div>
                )}

                {view === "success" && (
                    <SubmissionSuccessView key="success" onReset={resetAndGoBack} />
                )}
            </AnimatePresence>
        </SubmissionPageWrapper>
    );
};

export default SubmissionPage;
