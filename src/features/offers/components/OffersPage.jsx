import OffersFilters from "./OffersFilters";
import OffersHeader from "./OffersHeader";
import OffersList from "./OffersList";
import OffersStats from "./OffersStats";
import OfferDetailsModal from "./OfferDetailsModal";
import OfferFormSection from "./OfferFormSection";
import { useOffersPageModel } from "../hooks/useOffersPageModel";
import { ROLES } from "../../../utils/rbac";

const OffersPage = () => {
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
    selectedOffer,
    setSelectedOffer,
    canCreate,
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
  } = useOffersPageModel();

  // For DATA_ENTRY_ONLY users, show only the add form
  const isDataEntryOnly = user?.role === ROLES.DATA_ENTRY_ONLY;

  return (
    <div className="space-y-6">
      <OffersHeader openCreate={canCreate ? formModal.openCreate : undefined} />

      {!isDataEntryOnly && (
        <>
          <OffersStats offers={offers} />
          <OffersFilters
            filters={filters}
            handleChange={handleChange}
            clearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />

          <OffersList
            offers={offers}
            isLoading={isLoading}
            status={status}
            isFetching={isFetching}
            error={error}
            user={user}
            openEdit={formModal.openEdit}
            confirmDelete={confirmDelete}
            onOffersClick={setSelectedOffer}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            pagination={pagination}
          />

          <OfferDetailsModal
            isOpen={!!selectedOffer}
            onClose={() => setSelectedOffer(null)}
            offer={selectedOffer}
          />
        </>
      )}

      {isDataEntryOnly && (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-200">إضافة عروض عقارية</h3>
            <p className="text-slate-400">
              يمكنك إضافة عروض عقارية جديدة من خلال الضغط على زر "إضافة عرض" في الأعلى
            </p>
          </div>
        </div>
      )}

      <OfferFormSection
        formModal={formModal}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        handleUsageChange={handleUsageChange}
        handlePropertySubTypeChange={handlePropertySubTypeChange}
        handleAreaChange={handleAreaChange}
        handleAreaPaste={handleAreaPaste}
        handleAreaKeyDown={handleAreaKeyDown}
        handlePriceChange={handlePriceChange}
        handlePricePaste={handlePricePaste}
        handlePriceKeyDown={handlePriceKeyDown}
        handlePhoneChange={handlePhoneChange}
        handlePhonePaste={handlePhonePaste}
        handlePhoneKeyDown={handlePhoneKeyDown}
      />
    </div>
  );
};

export default OffersPage;
