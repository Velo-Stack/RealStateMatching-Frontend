import RequestsFilters from "./RequestsFilters";
import RequestsHeader from "./RequestsHeader";
import RequestsList from "./RequestsList";
import RequestsStats from "./RequestsStats";
import RequestDetailsModal from "./RequestDetailsModal";
import RequestFormSection from "./RequestFormSection";
import { useRequestsPageModel } from "../hooks/useRequestsPageModel";
import { ROLES } from "../../../utils/rbac";

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
    currentPage,
    setCurrentPage,
    pagination,
    isFetching,
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
    handleBudgetChange,
    handleBudgetPaste,
    handleBudgetKeyDown,
    searchCode,
    setSearchCode,
  } = useRequestsPageModel();

  // For DATA_ENTRY_ONLY users, show only the add form
  const isDataEntryOnly = user?.role === ROLES.DATA_ENTRY_ONLY;

  return (
    <div className="space-y-6">
      <RequestsHeader
        openCreate={canCreate ? formModal.openCreate : undefined}
        searchCode={searchCode}
        onSearchCodeChange={setSearchCode}
      />

      {!isDataEntryOnly && (
        <>
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
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            pagination={pagination}
            isFetching={isFetching}
          />

          <RequestDetailsModal
            isOpen={!!selectedRequest}
            onClose={() => setSelectedRequest(null)}
            request={selectedRequest}
          />
        </>
      )}

      {isDataEntryOnly && (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-200">إضافة طلبات عملاء</h3>
            <p className="text-slate-400">
              يمكنك إضافة طلبات عملاء جديدة من خلال الضغط على زر "إضافة طلب" في الأعلى
            </p>
          </div>
        </div>
      )}

      <RequestFormSection
        formModal={formModal}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        handleUsageChange={handleUsageChange}
        handlePropertySubTypeChange={handlePropertySubTypeChange}
        handleAreaChange={handleAreaChange}
        handleAreaPaste={handleAreaPaste}
        handleAreaKeyDown={handleAreaKeyDown}
        handleBudgetChange={handleBudgetChange}
        handleBudgetPaste={handleBudgetPaste}
        handleBudgetKeyDown={handleBudgetKeyDown}
        handlePhoneChange={handlePhoneChange}
        handlePhonePaste={handlePhonePaste}
        handlePhoneKeyDown={handlePhoneKeyDown}
      />
    </div>
  );
};

export default RequestsPage;
