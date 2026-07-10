import { useRef } from 'react';
import { UploadSimple, X } from 'phosphor-react';
import { JOIN_US_COLORS } from '../constants/joinUsConstants';

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const JoinUsFileUpload = ({
  label,
  required,
  file,
  onChange,
  accept = '.pdf,.jpg,.jpeg,.png,.webp',
  fieldKey,
  error,
}) => {
  const inputRef = useRef(null);

  return (
    <div className="text-right" dir="rtl" data-join-field={fieldKey || undefined}>
      <label className="block text-sm font-semibold text-gray-800 mb-2">
        {label}
        {required ? <span style={{ color: JOIN_US_COLORS.gold }}> *</span> : null}
      </label>
      <div
        className="border-2 border-dashed rounded-2xl p-5 cursor-pointer transition-all hover:border-[#C9A84C]/60 hover:bg-[#f7f8fa]"
        style={{ borderColor: 'rgba(45, 80, 22, 0.2)' }}
        onClick={() => !file && inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && !file && inputRef.current?.click()}
        role="button"
        tabIndex={0}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => onChange(e.target.files?.[0] || null)}
        />
        {file ? (
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: JOIN_US_COLORS.green }}>
                {file.name}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{formatSize(file.size)}</p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
                if (inputRef.current) inputRef.current.value = '';
              }}
              className="shrink-0 p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"
              aria-label="إزالة الملف"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center gap-2 py-2">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: 'rgba(45, 80, 22, 0.08)' }}
            >
              <UploadSimple size={24} weight="duotone" style={{ color: JOIN_US_COLORS.green }} />
            </div>
            <p className="text-sm text-gray-600">اضغط لرفع ملف</p>
            <p className="text-xs text-gray-400">PDF أو صورة — حد أقصى 5MB</p>
          </div>
        )}
      </div>
      {error ? <p className="text-red-600 text-xs mt-1.5">{error}</p> : null}
    </div>
  );
};

export default JoinUsFileUpload;
