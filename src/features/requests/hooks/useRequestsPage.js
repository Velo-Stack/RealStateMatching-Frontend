import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useFormModal } from "../../../hooks";
import {
  REQUESTS_DELETE_CONFIRMATION_MESSAGE,
  REQUESTS_EMPTY_FORM,
  REQUESTS_PAGE_SIZE,
} from "../constants/requestsConstants";
import { mapRequestFormToPayload } from "../utils/requestsUtils";
import { useRequestsFilters } from "./useRequestsFilters";
import { useRequestsCrud } from "./useRequestsCrud";
import { ROLES } from "../../../utils/rbac";

export const useRequestsPage = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const {
    filters,
    handleChange: baseHandleChange,
    clearFilters: baseClearFilters,
    hasActiveFilters,
    getFilterParams,
  } =
    useRequestsFilters();

  const handleChange = (e) => {
    setCurrentPage(1);
    baseHandleChange(e);
  };

  const clearFilters = () => {
    setCurrentPage(1);
    baseClearFilters();
  };

  const requestParams = {
    ...getFilterParams(),
    page: currentPage,
    limit: REQUESTS_PAGE_SIZE,
    userId: user?.role === ROLES.DATA_ENTRY_ONLY ? user.id : undefined,
  };

  const {
    data: requests,
    pagination,
    isLoading,
    isFetching,
    create,
    update,
    remove,
    isSubmitting,
  } = useRequestsCrud(requestParams);
  const formModal = useFormModal(REQUESTS_EMPTY_FORM);

  const confirmDelete = (request) => {
    if (!window.confirm(REQUESTS_DELETE_CONFIRMATION_MESSAGE)) return;
    remove(request.id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const payload = mapRequestFormToPayload(formModal.formData);

    if (formModal.isEditing) {
      update({ id: formModal.editingItem.id, payload });
    } else {
      create(payload);
    }

    formModal.close();
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
  };
};
