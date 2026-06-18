import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { hasPermission } from "../../../utils/rbac";
import { useOffersPage } from "./useOffersPage";
import { formatNumberWithCommas } from "../../../utils/numberFormatting";
import { shouldShowOfferLengths } from "../utils/offersUtils";

export const useOffersPageModel = () => {
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    user,
    offers,
    isLoading,
    status,
    isFetching,
    error,
    isSubmitting,
    formModal,
    handleSubmit,
    confirmDelete,
    filters,
    handleChange,
    clearFilters,
    hasActiveFilters,
    currentPage,
    setCurrentPage,
    pagination,
    searchCode,
    setSearchCode,
  } = useOffersPage();

  useEffect(() => {
    setCurrentPage(1);
  }, [searchCode, setCurrentPage]);

  useEffect(() => {
    const offerId = searchParams.get("offerId");
    if (!offerId || offers.length === 0) return;

    const offer = offers.find((item) => item.id === parseInt(offerId, 10));
    if (offer) {
      setSelectedOffer(offer);
      searchParams.delete("offerId");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, offers, setSearchParams]);

  const canCreate = hasPermission(user, "offers.create");
  const canRead = hasPermission(user, "offers.read");

  const handleUsageChange = (e) => {
    const { value } = e.target;
    e.target.setCustomValidity("");
    formModal.setValue("usage", value);
    formModal.setValue("propertySubType", "");
  };

  const handlePropertySubTypeChange = (e) => {
    const { value } = e.target;
    e.target.setCustomValidity("");
    formModal.setValue("propertySubType", value);
    if (!shouldShowOfferLengths(value)) {
      formModal.setValue("lengths", "");
    }
  };

  const handlePriceChange = (e) => {
    e.target.setCustomValidity("");
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 15);
    const formatted = formatNumberWithCommas(digitsOnly);
    formModal.setValue("price", formatted);
  };

  const handlePricePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const digitsOnly = pastedText.replace(/\D/g, "").slice(0, 15);
    const formatted = formatNumberWithCommas(digitsOnly);
    formModal.setValue("price", formatted);
  };

  const handlePriceKeyDown = (e) => {
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

  const handlePhoneChange = (e) => {
    e.target?.setCustomValidity?.("");
    formModal.setValue("brokerContactPhone", e.target.value);
  };

  const handlePhonePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const digitsOnly = pastedText.replace(/\D/g, "").slice(0, 9);
    formModal.setValue("brokerContactPhone", digitsOnly);
  };

  const handlePhoneKeyDown = (e) => {
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

  const handleAreaChange = (e) => {
    e.target.setCustomValidity("");
    const digitsOnly = e.target.value.replace(/\D/g, "");
    const formatted = formatNumberWithCommas(digitsOnly);
    formModal.setValue("area", formatted);
  };

  const handleAreaPaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const digitsOnly = pastedText.replace(/\D/g, "");
    const formatted = formatNumberWithCommas(digitsOnly);
    formModal.setValue("area", formatted);
  };

  const handleAreaKeyDown = (e) => {
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

  return {
    user,
    offers,
    isLoading,
    status,
    isFetching,
    error,
    isSubmitting,
    formModal,
    handleSubmit,
    confirmDelete,
    filters,
    handleChange,
    clearFilters,
    hasActiveFilters,
    currentPage,
    setCurrentPage,
    pagination,
    canCreate,
    canRead,
    selectedOffer,
    setSelectedOffer,
    handleUsageChange,
    handlePropertySubTypeChange,
    handlePriceChange,
    handlePricePaste,
    handlePriceKeyDown,
    handlePhoneChange,
    handlePhonePaste,
    handlePhoneKeyDown,
    handleAreaChange,
    handleAreaPaste,
    handleAreaKeyDown,
    searchCode,
    setSearchCode,
  };
};
