import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    submitPublicOffer,
    submitPublicRequest,
} from "../services/submissionApi";
import { OFFERS_EMPTY_FORM } from "../../offers/constants/offersConstants";
import { REQUESTS_EMPTY_FORM } from "../../requests/constants/requestsConstants";
import { mapOfferFormToPayload } from "../../offers/utils/offersUtils";
import { mapRequestFormToPayload } from "../../requests/utils/requestsUtils";

export const useSubmission = (token) => {
    const [view, setView] = useState("landing"); // landing | offer | request | success | error
    const [offerForm, setOfferForm] = useState({ ...OFFERS_EMPTY_FORM });
    const [requestForm, setRequestForm] = useState({ ...REQUESTS_EMPTY_FORM });

    const setOfferValue = (name, value) => {
        setOfferForm((prev) => ({ ...prev, [name]: value }));
    };

    const setRequestValue = (name, value) => {
        setRequestForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleOfferChange = (e) => {
        const { name, value } = e.target;
        setOfferValue(name, value);
    };

    const handleRequestChange = (e) => {
        const { name, value } = e.target;
        setRequestValue(name, value);
    };

    const handleOfferUsageChange = (e) => {
        const { value } = e.target;
        e.target.setCustomValidity("");
        setOfferValue("usage", value);
        setOfferValue("propertySubType", "");
    };

    const handleRequestUsageChange = (e) => {
        const { value } = e.target;
        e.target.setCustomValidity("");
        setRequestValue("usage", value);
        setRequestValue("propertySubType", "");
    };

    const handleOfferPropertySubTypeChange = (e) => {
        e.target.setCustomValidity("");
        handleOfferChange(e);
    };

    const handleRequestPropertySubTypeChange = (e) => {
        e.target.setCustomValidity("");
        handleRequestChange(e);
    };

    const handleOfferPriceChange = (e) => {
        e.target.setCustomValidity("");
        const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 15);
        setOfferValue("price", digitsOnly);
    };

    const handleOfferPricePaste = (e) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData("text");
        const digitsOnly = pastedText.replace(/\D/g, "").slice(0, 15);
        setOfferValue("price", digitsOnly);
    };

    const handleOfferPriceKeyDown = (e) => {
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        const allowedControlKeys = [
            "Backspace",
            "Delete",
            "ArrowLeft",
            "ArrowRight",
            "Tab",
            "Home",
            "End",
        ];
        if (allowedControlKeys.includes(e.key)) return;
        if (!/^\d$/.test(e.key)) {
            e.preventDefault();
        }
    };

    const handleOfferPhoneChange = (e) => {
        e.target.setCustomValidity("");
        const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 15);
        setOfferValue("brokerContactPhone", digitsOnly);
    };

    const handleOfferPhonePaste = (e) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData("text");
        const digitsOnly = pastedText.replace(/\D/g, "").slice(0, 15);
        setOfferValue("brokerContactPhone", digitsOnly);
    };

    const handleOfferPhoneKeyDown = (e) => {
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        const allowedControlKeys = [
            "Backspace",
            "Delete",
            "ArrowLeft",
            "ArrowRight",
            "Tab",
            "Home",
            "End",
        ];
        if (allowedControlKeys.includes(e.key)) return;
        if (!/^\d$/.test(e.key)) {
            e.preventDefault();
        }
    };

    const handleOfferAreaChange = (e) => {
        e.target.setCustomValidity("");
        const digitsOnly = e.target.value.replace(/\D/g, "");
        setOfferValue("area", digitsOnly);
    };

    const handleOfferAreaPaste = (e) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData("text");
        const digitsOnly = pastedText.replace(/\D/g, "");
        setOfferValue("area", digitsOnly);
    };

    const handleOfferAreaKeyDown = (e) => {
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        const allowedControlKeys = [
            "Backspace",
            "Delete",
            "ArrowLeft",
            "ArrowRight",
            "Tab",
            "Home",
            "End",
        ];
        if (allowedControlKeys.includes(e.key)) return;
        if (!/^\d$/.test(e.key)) {
            e.preventDefault();
        }
    };

    const handleRequestPhoneChange = (e) => {
        e.target.setCustomValidity("");
        const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 15);
        setRequestValue("brokerContactPhone", digitsOnly);
    };

    const handleRequestPhonePaste = (e) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData("text");
        const digitsOnly = pastedText.replace(/\D/g, "").slice(0, 15);
        setRequestValue("brokerContactPhone", digitsOnly);
    };

    const handleRequestPhoneKeyDown = (e) => {
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        const allowedControlKeys = [
            "Backspace",
            "Delete",
            "ArrowLeft",
            "ArrowRight",
            "Tab",
            "Home",
            "End",
        ];
        if (allowedControlKeys.includes(e.key)) return;
        if (!/^\d$/.test(e.key)) {
            e.preventDefault();
        }
    };

    const handleRequestAreaChange = (e) => {
        e.target.setCustomValidity("");
        const digitsOnly = e.target.value.replace(/\D/g, "");
        setRequestValue("area", digitsOnly);
    };

    const handleRequestAreaPaste = (e) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData("text");
        const digitsOnly = pastedText.replace(/\D/g, "");
        setRequestValue("area", digitsOnly);
    };

    const handleRequestAreaKeyDown = (e) => {
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        const allowedControlKeys = [
            "Backspace",
            "Delete",
            "ArrowLeft",
            "ArrowRight",
            "Tab",
            "Home",
            "End",
        ];
        if (allowedControlKeys.includes(e.key)) return;
        if (!/^\d$/.test(e.key)) {
            e.preventDefault();
        }
    };

    const offerMutation = useMutation({
        mutationFn: (payload) => submitPublicOffer(token, payload),
        onSuccess: () => {
            toast.success("تم إرسال العرض بنجاح!");
            setView("success");
        },
        onError: (err) => {
            const msg = err?.response?.data?.message || "حدث خطأ أثناء إرسال العرض";
            toast.error(msg);
        },
    });

    const requestMutation = useMutation({
        mutationFn: (payload) => submitPublicRequest(token, payload),
        onSuccess: () => {
            toast.success("تم إرسال الطلب بنجاح!");
            setView("success");
        },
        onError: (err) => {
            const msg = err?.response?.data?.message || "حدث خطأ أثناء إرسال الطلب";
            toast.error(msg);
        },
    });

    const submitOffer = () => {
        const payload = mapOfferFormToPayload(offerForm);
        offerMutation.mutate(payload);
    };

    const submitRequest = () => {
        const payload = mapRequestFormToPayload(requestForm);
        requestMutation.mutate(payload);
    };

    const resetAndGoBack = () => {
        setOfferForm({ ...OFFERS_EMPTY_FORM });
        setRequestForm({ ...REQUESTS_EMPTY_FORM });
        setView("landing");
    };

    return {
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
        isSubmitting: offerMutation.isPending || requestMutation.isPending,
    };
};
