import { Lock } from 'phosphor-react';
import { JOIN_US_COLORS, PRIVACY_NOTE } from '../../constants/joinUsConstants';

const JoinUsTrustBadge = ({ compact = false }) => (
  <div
    className={`flex items-start gap-3 rounded-2xl border text-right ${
      compact ? 'p-3 text-xs' : 'p-4 text-sm'
    }`}
    style={{
      backgroundColor: 'rgba(201, 168, 76, 0.08)',
      borderColor: 'rgba(201, 168, 76, 0.3)',
      color: '#4a5568',
    }}
    dir="rtl"
  >
    <div
      className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center"
      style={{ backgroundColor: 'rgba(45, 80, 22, 0.08)' }}
    >
      <Lock size={18} weight="duotone" style={{ color: JOIN_US_COLORS.green }} />
    </div>
    <p className="leading-relaxed">{PRIVACY_NOTE}</p>
  </div>
);

export default JoinUsTrustBadge;
