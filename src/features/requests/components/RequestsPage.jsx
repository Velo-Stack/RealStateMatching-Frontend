import RequestsFilters from "./RequestsFilters";
import RequestsHeader from "./RequestsHeader";
import RequestsList from "./RequestsList";
import RequestsStats from "./RequestsStats";
import RequestDetailsModal from "./RequestDetailsModal";
import RequestFormSection from "./RequestFormSection";
import { useRequestsPageModel } from "../hooks/useRequestsPageModel";

const RequestsPage = () => {
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
    selectedRequest,
    setSelectedRequest,
    canCreate,
    handleUsageChange,
    handlePropertySubTypeChange,
    handlePhoneChange,
    handlePhonePaste,
    handlePhoneKeyDown,
    handleAreaChange,
    handleAreaPaste,
    handleAreaKeyDown,
  } = useRequestsPageModel();

  return (
    <div className="space-y-6">
      <RequestsHeader
        openCreate={canCreate ? formModal.openCreate : undefined}
      />
      <RequestsStats requests={requests} />
      <RequestsFilters
        filters={filters}
        handleChange={handleChange}
        clearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <RequestsList
        requests={requests}
        isLoading={isLoading}
        user={user}
        openEdit={formModal.openEdit}
        confirmDelete={confirmDelete}
        onRequestsClick={setSelectedRequest}
      />

      <RequestDetailsModal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        request={selectedRequest}
      />

      <RequestFormSection
        formModal={formModal}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        handleUsageChange={handleUsageChange}
        handlePropertySubTypeChange={handlePropertySubTypeChange}
        handleAreaChange={handleAreaChange}
        handleAreaPaste={handleAreaPaste}
        handleAreaKeyDown={handleAreaKeyDown}
        handlePhoneChange={handlePhoneChange}
        handlePhonePaste={handlePhonePaste}
        handlePhoneKeyDown={handlePhoneKeyDown}
      />
    </div>
  );
};

export default RequestsPage;
