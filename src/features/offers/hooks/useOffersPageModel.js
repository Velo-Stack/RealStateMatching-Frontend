import { useState, useMemo } from "react";
import { hasRole, ROLES } from "../../../utils/rbac";
import { useOffersPage } from "./useOffersPage";
import { formatNumberWithCommas } from "../../../utils/numberFormatting";
import { shouldShowOfferLengths } from "../utils/offersUtils";
import { getOfferCode } from "../../../utils/entityCodes";

export const useOffersPageModel = () => {
  const [selectedOffer, setSelectedOffer] = useState(null);

  const {
    user,
    offers: rawOffers,
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

  // Filter offers by search code
  const offers = useMemo(() => {
    if (!searchCode.trim()) return rawOffers;

    const searchTerm = searchCode.trim().toUpperCase();
    return rawOffers.filter(offer => {
      const code = getOfferCode(offer).toUpperCase();
      return code.includes(searchTerm);
    });
  }, [rawOffers, searchCode]);

  const canCreate = hasRole(user, [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE, ROLES.BROKER, ROLES.DATA_ENTRY_ONLY]);

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
    e.target.setCustomValidity("");
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 9);
    formModal.setValue("brokerContactPhone", digitsOnly);
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
