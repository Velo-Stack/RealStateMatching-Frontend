import { JOIN_US_COLORS } from '../../constants/joinUsConstants';

export const joinUsInputClass =
  'w-full rounded-2xl border px-4 py-3.5 text-sm outline-none transition-all text-gray-800 focus:ring-2 focus:ring-[#C9A84C]/30 focus:border-[#2D5016]';

export const joinUsInputStyle = {
  backgroundColor: JOIN_US_COLORS.inputBg,
  borderColor: 'rgba(45, 80, 22, 0.18)',
};

export const joinUsLabelClass = 'block text-sm font-semibold text-gray-800 mb-2';

export const joinUsCardClass =
  'relative bg-white rounded-3xl shadow-xl shadow-[#2D5016]/8 ring-1 ring-black/5 overflow-hidden';

export const joinUsGoldBarClass = 'absolute top-0 inset-x-0 h-1 bg-gradient-to-l from-[#C9A84C] to-[#2D5016]';

export const joinUsProgressGradient = 'linear-gradient(90deg, #C9A84C, #2D5016)';
