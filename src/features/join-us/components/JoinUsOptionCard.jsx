import { motion as Motion } from 'framer-motion';
import { Check } from 'phosphor-react';
import { JOIN_US_COLORS } from '../constants/joinUsConstants';

const JoinUsOptionCard = ({
  label,
  description,
  icon: Icon,
  selected,
  multi = false,
  onClick,
  className = '',
}) => (
  <Motion.button
    type="button"
    onClick={onClick}
    whileHover={{ y: -2 }}
    whileTap={{ scale: 0.98 }}
    className={`w-full rounded-2xl border-2 px-4 py-3.5 text-right transition-all ${className} ${
      selected
        ? 'shadow-md'
        : 'bg-white hover:shadow-sm'
    }`}
    style={
      selected
        ? {
            backgroundColor: JOIN_US_COLORS.greenLight,
            borderColor: JOIN_US_COLORS.green,
          }
        : { borderColor: 'rgba(45, 80, 22, 0.12)' }
    }
    dir="rtl"
  >
    <div className="flex items-start gap-3">
      {Icon ? (
        <div
          className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            backgroundColor: selected ? 'rgba(45, 80, 22, 0.12)' : 'rgba(45, 80, 22, 0.06)',
          }}
        >
          <Icon
            size={22}
            weight={selected ? 'fill' : 'duotone'}
            style={{ color: selected ? JOIN_US_COLORS.green : '#6b7280' }}
          />
        </div>
      ) : null}

      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-semibold"
          style={{ color: selected ? JOIN_US_COLORS.green : '#1f2937' }}
        >
          {label}
        </p>
        {description ? (
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{description}</p>
        ) : null}
      </div>

      <div
        className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 transition-all ${
          selected ? 'border-transparent' : 'border-gray-300'
        }`}
        style={
          selected
            ? { backgroundColor: multi ? JOIN_US_COLORS.green : JOIN_US_COLORS.gold }
            : undefined
        }
      >
        {selected && multi ? (
          <Check size={12} weight="bold" className="text-white" />
        ) : selected ? (
          <span className="w-2 h-2 rounded-full bg-white" />
        ) : null}
      </div>
    </div>
  </Motion.button>
);

export default JoinUsOptionCard;
