import OffersFilters from "./OffersFilters";
import OffersHeader from "./OffersHeader";
import OffersList from "./OffersList";
import OffersStats from "./OffersStats";
import OfferDetailsModal from "./OfferDetailsModal";
import OfferFormSection from "./OfferFormSection";
import { useOffersPageModel } from "../hooks/useOffersPageModel";

const OffersPage = () => {
  const {
    user,
    offers,
    isLoading,
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

  return (
    <div className="space-y-6">
      <OffersHeader
        openCreate={canCreate ? formModal.openCreate : undefined}
        canExportPDF={canExportPDF}
        exportPDF={exportPDF}
      />

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
        user={user}
        openEdit={formModal.openEdit}
        confirmDelete={confirmDelete}
        onOffersClick={setSelectedOffer}
      />

      <OfferDetailsModal
        isOpen={!!selectedOffer}
        onClose={() => setSelectedOffer(null)}
        offer={selectedOffer}
      />

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
