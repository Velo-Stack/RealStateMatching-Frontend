import { inputClasses } from "../../constants/styles";

const ValidatedSelect = ({
  label,
  name,
  value,
  onChange,
  error,
  touched,
  required = false,
  disabled = false,
  children,
}) => {
  const hasError = touched && error;
  const isValid = touched && !error && value;

  const selectClassWithValidation = `${inputClasses} ${
    hasError
      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
      : isValid
      ? "border-green-500 focus:border-green-500 focus:ring-green-500"
      : ""
  }`;

  const labelClass = `block text-sm font-medium mb-2`;
  const labelStyle = {
    color: hasError ? 'var(--danger)' : 'var(--text-primary)',
  };

  return (
    <div className="relative">
      <label className={labelClass} style={labelStyle}>
        {label}
        {required && <span className="text-red-500 mr-1">*</span>}
      </label>
      <div className="relative">
        <select
          name={name}
          className={selectClassWithValidation}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
        >
          {children}
        </select>
        {isValid && (
          <div className="absolute left-10 top-1/2 -translate-y-1/2 text-green-500 pointer-events-none">
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
        {hasError && (
          <div className="absolute left-10 top-1/2 -translate-y-1/2 text-red-500 pointer-events-none">
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
      {hasError && (
        <p className="mt-1 text-sm text-right" style={{ color: 'var(--danger)' }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default ValidatedSelect;
