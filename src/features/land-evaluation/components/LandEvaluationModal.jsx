import Modal from "../../../components/Modal";
import LandEvaluationPanel from "./LandEvaluationPanel";

const LandEvaluationModal = ({ isOpen, onClose, offer }) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="تقدير سعر الأرض">
      <LandEvaluationPanel offer={offer} embedded />
    </Modal>
  );
};

export default LandEvaluationModal;
