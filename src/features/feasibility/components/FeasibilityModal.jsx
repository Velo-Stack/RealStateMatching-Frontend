import { useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import FeasibilityToolPage from "./FeasibilityToolPage";
import { buildPrefillFromOffer } from "../constants/feasibilityConstants";

const FeasibilityModal = ({ isOpen, onClose, offer }) => {
  const [prefill, setPrefill] = useState(null);

  useEffect(() => {
    if (isOpen && offer) setPrefill(buildPrefillFromOffer(offer));
  }, [isOpen, offer]);

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="دراسة جدوى سريعة">
      <FeasibilityToolPage embedded initialForm={prefill} offerId={offer?.id} />
    </Modal>
  );
};

export default FeasibilityModal;
