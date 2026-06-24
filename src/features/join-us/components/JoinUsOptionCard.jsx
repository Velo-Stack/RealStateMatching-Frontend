import { JOIN_US_COLORS } from '../constants/joinUsConstants';

const JoinUsOptionCard = ({ label, selected, onClick, className = '' }) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all text-right ${className} ${
      selected
        ? 'text-white border-transparent shadow-md'
        : 'bg-white hover:border-[#2D5016]/50'
    }`}
    style={
      selected
        ? { backgroundColor: JOIN_US_COLORS.green, borderColor: JOIN_US_COLORS.green }
        : { borderColor: 'rgba(45, 80, 22, 0.2)' }
    }
  >
    {label}
  </button>
);

export default JoinUsOptionCard;
