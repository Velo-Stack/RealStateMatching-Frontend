import { useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import CommissionCalculatorPage from "./CommissionCalculatorPage";
import { buildPrefillFromOffer } from "../utils/commissionFormatters";

const CommissionCalculatorModal = ({ isOpen, onClose, offer }) => {
  const [prefill, setPrefill] = useState(null);

  useEffect(() => {
    if (isOpen && offer) {
      setPrefill(buildPrefillFromOffer(offer));
    }
  }, [isOpen, offer]);

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="حاسبة السعي">
      <CommissionCalculatorPage
        embedded
        initialForm={prefill}
        offerId={offer?.id}
        onSaved={onClose}
      />
    </Modal>
  );
};

export default CommissionCalculatorModal;
