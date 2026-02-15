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

    const handleOfferChange = (e) => {
        const { name, value } = e.target;
        setOfferForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleRequestChange = (e) => {
        const { name, value } = e.target;
        setRequestForm((prev) => ({ ...prev, [name]: value }));
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
        submitOffer,
        submitRequest,
        resetAndGoBack,
        isSubmitting: offerMutation.isPending || requestMutation.isPending,
    };
};
