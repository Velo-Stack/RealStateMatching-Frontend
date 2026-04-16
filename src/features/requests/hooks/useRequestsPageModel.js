import { useState } from "react";
import { hasRole, ROLES } from "../../../utils/rbac";
import { useRequestsPage } from "./useRequestsPage";
import { formatNumberWithCommas } from "../../../utils/numberFormatting";

export const useRequestsPageModel = () => {
  const [selectedRequest, setSelectedRequest] = useState(null);

  const {
    user,
    requests,
    isLoading,
    isSubmitting,
    formModal,
    confirmDelete,
    handleSubmit,
    filters,
    handleChange,
    clearFilters,
    hasActiveFilters,
    currentPage,
    setCurrentPage,
    pagination,
    isFetching,
  } = useRequestsPage();

  const canCreate = hasRole(user, [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE, ROLES.BROKER, ROLES.DATA_ENTRY_ONLY]);

  const handleUsageChange = (e) => {
    const { value } = e.target;
    e.target.setCustomValidity("");
    formModal.setValue("usage", value);
    formModal.setValue("propertySubType", "");
  };

  const handlePropertySubTypeChange = (e) => {
    e.target.setCustomValidity("");
    formModal.handleChange(e);
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
    formModal.setValue("area", digitsOnly);
  };

  const handleAreaPaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const digitsOnly = pastedText.replace(/\D/g, "");
    formModal.setValue("area", digitsOnly);
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

  const handleBudgetChange = (e) => {
    e.target.setCustomValidity("");
    const { name, value } = e.target;
    const digitsOnly = value.replace(/\D/g, "").slice(0, 15);
    const formatted = formatNumberWithCommas(digitsOnly);
    formModal.setValue(name, formatted);
  };

  const handleBudgetPaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const digitsOnly = pastedText.replace(/\D/g, "").slice(0, 15);
    const formatted = formatNumberWithCommas(digitsOnly);
    const fieldName = e.target.name;
    formModal.setValue(fieldName, formatted);
  };

  const handleBudgetKeyDown = (e) => {
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
    requests,
    isLoading,
    isSubmitting,
    formModal,
    confirmDelete,
    handleSubmit,
    filters,
    handleChange,
    clearFilters,
    hasActiveFilters,
    currentPage,
    setCurrentPage,
    pagination,
    isFetching,
    canCreate,
    selectedRequest,
    setSelectedRequest,
    handleUsageChange,
    handlePropertySubTypeChange,
    handlePhoneChange,
    handlePhonePaste,
    handlePhoneKeyDown,
    handleAreaChange,
    handleAreaPaste,
    handleAreaKeyDown,
    handleBudgetChange,
    handleBudgetPaste,
    handleBudgetKeyDown,
  };
};
