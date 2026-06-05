import { Phone, WhatsappLogo } from "phosphor-react";
import { toTelUrl, toWhatsAppUrl } from "../../utils/phone";

const PhoneActions = ({
  phone,
  label = "تواصل",
  showCall = true,
  showWhatsApp = true,
  message = "",
  className = "",
}) => {
  const waUrl = showWhatsApp ? toWhatsAppUrl(phone, message) : null;
  const telUrl = showCall ? toTelUrl(phone) : null;

  if (!waUrl && !telUrl) return null;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {label && (
        <span className="text-xs text-slate-400 w-full sm:w-auto">{label}</span>
      )}
      {waUrl && (
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-300 transition-colors hover:bg-emerald-500/20"
        >
          <WhatsappLogo size={16} weight="fill" />
          واتساب
        </a>
      )}
      {telUrl && (
        <a
          href={telUrl}
          className="inline-flex items-center gap-2 rounded-lg border border-sky-500/30 bg-sky-500/10 px-3 py-2 text-xs font-medium text-sky-300 transition-colors hover:bg-sky-500/20"
        >
          <Phone size={16} weight="fill" />
          اتصال
        </a>
      )}
    </div>
  );
};

export default PhoneActions;
