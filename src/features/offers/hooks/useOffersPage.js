import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useExport, useFormModal } from "../../../hooks";
import { hasRole, ROLES } from "../../../utils/rbac";
import {
  OFFERS_DELETE_CONFIRMATION_MESSAGE,
  OFFERS_EMPTY_FORM,
  OFFERS_PAGE_SIZE,
} from "../constants/offersConstants";
import { mapOfferFormToPayload } from "../utils/offersUtils";
import { useOffersFilters } from "./useOffersFilters";
import { useOffersCrud } from "./useOffersCrud";

export const useOffersPage = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const { exportPDF } = useExport("offers");
  const {
    filters,
    handleChange: baseHandleChange,
    clearFilters: baseClearFilters,
    hasActiveFilters,
    getFilterParams,
  } =
    useOffersFilters();

  const handleChange = (e) => {
    setCurrentPage(1);
    baseHandleChange(e);
  };

  const clearFilters = () => {
    setCurrentPage(1);
    baseClearFilters();
  };

  const {
    data: offers,
    pagination,
    isLoading,
    status,
    isFetching,
    error,
    create,
    update,
    remove,
    isSubmitting,
  } =
    useOffersCrud({
      ...getFilterParams(),
      page: currentPage,
      limit: OFFERS_PAGE_SIZE,
    });
  const formModal = useFormModal(OFFERS_EMPTY_FORM);

  const confirmDelete = (offer) => {
    if (!window.confirm(OFFERS_DELETE_CONFIRMATION_MESSAGE)) return;
    remove(offer.id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const payload = mapOfferFormToPayload(formModal.formData);

    if (formModal.isEditing) {
      update({ id: formModal.editingItem.id, payload });
    } else {
      create(payload);
    }

    formModal.close();
  };

  const canExportPDF = hasRole(user, [ROLES.ADMIN, ROLES.MANAGER]);

  return {
    user,
    offers,
    isLoading,
    status,
    isFetching,
    error,
    isSubmitting,
    exportPDF,
    formModal,
    handleSubmit,
    confirmDelete,
    canExportPDF,
    filters,
    handleChange,
    clearFilters,
    hasActiveFilters,
    currentPage,
    setCurrentPage,
    pagination,
  };
};
