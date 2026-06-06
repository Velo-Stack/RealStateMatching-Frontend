import Modal from "../../../components/Modal";
import LandEvaluationPanel from "./LandEvaluationPanel";
import LandEvaluationHelp from "./LandEvaluationHelp";

const LandEvaluationModal = ({ isOpen, onClose, offer }) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="تقدير سعر الأرض">
      <div className="space-y-4">
        <LandEvaluationHelp />
        <LandEvaluationPanel offer={offer} embedded />
      </div>
    </Modal>
  );
};

export default LandEvaluationModal;
