/**
 * Normalize Saudi phone numbers to E.164 digits for wa.me (966XXXXXXXXX).
 */
export const normalizeSaudiPhone = (phone) => {
  if (!phone) return null;
  const digits = String(phone).replace(/\D/g, '');
  if (!digits) return null;

  if (digits.startsWith('966') && digits.length >= 12) {
    return digits.slice(0, 12);
  }
  if (digits.startsWith('0') && digits.length >= 10) {
    return `966${digits.slice(1, 10)}`;
  }
  if (digits.length === 9 && digits.startsWith('5')) {
    return `966${digits}`;
  }
  if (digits.length >= 10) {
    return digits;
  }
  return null;
};

export const toWhatsAppUrl = (phone, message = '') => {
  const normalized = normalizeSaudiPhone(phone);
  if (!normalized) return null;
  const base = `https://wa.me/${normalized}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
};

export const toTelUrl = (phone) => {
  const normalized = normalizeSaudiPhone(phone);
  if (!normalized) return null;
  return `tel:+${normalized}`;
};
