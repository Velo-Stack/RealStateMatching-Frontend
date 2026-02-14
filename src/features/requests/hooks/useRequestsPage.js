import { useAuth } from "../../../context/AuthContext";
import { useFormModal } from "../../../hooks";
import { REQUESTS_DELETE_CONFIRMATION_MESSAGE, REQUESTS_EMPTY_FORM } from "../constants/requestsConstants";
import { mapRequestFormToPayload } from "../utils/requestsUtils";
import { useRequestsFilters } from "./useRequestsFilters";
import { useRequestsCrud } from "./useRequestsCrud";

export const useRequestsPage = () => {
  const { user } = useAuth();
  const { filters, handleChange, clearFilters, hasActiveFilters, getFilterParams } =
    useRequestsFilters();
  const { data: requests, isLoading, create, update, remove, isSubmitting } =
    useRequestsCrud(getFilterParams());
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
  };
};
