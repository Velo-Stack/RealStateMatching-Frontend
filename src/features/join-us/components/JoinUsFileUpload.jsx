import { useRef } from 'react';
import { JOIN_US_COLORS } from '../constants/joinUsConstants';

const JoinUsFileUpload = ({ label, required, file, onChange, accept = '.pdf,.jpg,.jpeg,.png,.webp' }) => {
  const inputRef = useRef(null);

  return (
    <div className="text-right">
      <label className="block text-sm font-medium text-gray-800 mb-2">
        {label}
        {required ? <span style={{ color: JOIN_US_COLORS.gold }}> *</span> : null}
      </label>
      <div
        className="border-2 border-dashed rounded-xl p-4 cursor-pointer transition-colors hover:border-[#2D5016]/50"
        style={{ borderColor: 'rgba(45, 80, 22, 0.25)' }}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
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
          <p className="text-sm text-[#2D5016] font-medium">{file.name}</p>
        ) : (
          <p className="text-sm text-gray-500">اضغط لرفع ملف (PDF أو صورة — حد أقصى 5MB)</p>
        )}
      </div>
    </div>
  );
};

export default JoinUsFileUpload;
