import { useState, useMemo } from "react";
import { hasRole, ROLES } from "../../../utils/rbac";
import { useRequestsPage } from "./useRequestsPage";
import { formatNumberWithCommas } from "../../../utils/numberFormatting";
import { getRequestCode } from "../../../utils/entityCodes";

export const useRequestsPageModel = () => {
  const [selectedRequest, setSelectedRequest] = useState(null);

  const {
    user,
    requests: rawRequests,
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
    searchCode,
    setSearchCode,
  } = useRequestsPage();

  // Filter requests by search code
  const requests = useMemo(() => {
    if (!searchCode.trim()) return rawRequests;

    const searchTerm = searchCode.trim().toUpperCase();
    return rawRequests.filter(request => {
      const code = getRequestCode(request).toUpperCase();
      return code.includes(searchTerm);
    });
  }, [rawRequests, searchCode]);

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

  const handleBudgetChange = (e) => {
    e.target.setCustomValidity("");
    const { name, value } = e.target;
    const digitsOnly = value.replace(/\D/g, "").slice(0, 15);
    const formatted = formatNumberWithCommas(digitsOnly);
    formModal.setValue(name, formatted);

    // Real-time validation for budget range
    if (name === "budgetFrom" || name === "budgetTo") {
      const currentData = { ...formModal.formData, [name]: formatted };
      const fromVal = Number(String(currentData.budgetFrom || "0").replace(/,/g, ""));
      const toVal = Number(String(currentData.budgetTo || "0").replace(/,/g, ""));

      if (currentData.budgetFrom && currentData.budgetTo && !isNaN(fromVal) && !isNaN(toVal)) {
        if (toVal < fromVal) {
          e.target.setCustomValidity("الميزانية (إلى) يجب أن تكون أكبر من أو تساوي الميزانية (من)");
        }
      }
    }
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
    searchCode,
    setSearchCode,
  };
};
