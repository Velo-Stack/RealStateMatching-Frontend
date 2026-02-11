import { useAuth } from "../../../context/AuthContext";
import { useExport, useFormModal } from "../../../hooks";
import { hasRole, ROLES } from "../../../utils/rbac";
import {
  OFFERS_DELETE_CONFIRMATION_MESSAGE,
  OFFERS_EMPTY_FORM,
} from "../constants/offersConstants";
import { mapOfferFormToPayload } from "../utils/offersUtils";
import { useOffersCrud } from "./useOffersCrud";

export const useOffersPage = () => {
  const { user } = useAuth();
  const { exportPDF } = useExport("offers");
  const { data: offers, isLoading, create, update, remove, isSubmitting } =
    useOffersCrud();
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
    isSubmitting,
    exportPDF,
    formModal,
    handleSubmit,
    confirmDelete,
    canExportPDF,
  };
};
