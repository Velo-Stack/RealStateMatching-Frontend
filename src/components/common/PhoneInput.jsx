const COUNTRY_CODE_WIDTH = 118;
const VALIDATION_ICON_SPACE = 44;
const SAUDI_FLAG_URL = "/images/Saudi.jpg";

const PhoneInput = ({
  label,
  name,
  value,
  onChange,
  onPaste,
  onKeyDown,
  onBlur,
  error,
  touched,
  required = false,
  disabled = false,
  placeholder = "5xxxxxxxx",
}) => {
  const hasError = Boolean(touched && error);
  const isValid = Boolean(touched && !error && value);

  const inputClassWithValidation = `
    w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all duration-300
    focus:shadow-[0_0_20px_rgba(212,175,55,0.22)]
    ${
      hasError
        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
        : isValid
          ? "border-green-500 focus:border-green-500 focus:ring-green-500"
          : ""
    }
  `
    .replace(/\s+/g, " ")
    .trim();

  return (
    <div className="relative">
      <label
        className="mb-2 block text-sm font-medium"
        style={{
          color: hasError ? "var(--danger)" : "var(--text-primary)",
        }}
      >
        {label}
        {required && <span className="mr-1 text-red-500">*</span>}
      </label>

      <div className="relative">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 flex items-center gap-2 rounded-l-xl px-3"
          style={{
            width: `${COUNTRY_CODE_WIDTH}px`,
            borderRight: "2px solid var(--border-default)",
            backgroundColor: "var(--bg-elevated)",
          }}
        >
          <img
            src={SAUDI_FLAG_URL}
            alt="علم السعودية"
            className="h-6 w-9 rounded-[3px] object-fill shadow-sm"
          />
          <span
            dir="ltr"
            className="select-none whitespace-nowrap text-sm font-semibold"
            style={{
              color: "var(--text-primary)",
              direction: "ltr",
              unicodeBidi: "isolate",
            }}
          >
            +966
          </span>
        </div>

        <input
          name={name}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={9}
          dir="ltr"
          className={inputClassWithValidation}
          style={{
            paddingLeft: `${COUNTRY_CODE_WIDTH + 12}px`,
            paddingRight: `${VALIDATION_ICON_SPACE}px`,
            textAlign: "right",
            backgroundColor: "var(--bg-input)",
            borderColor: hasError
              ? "var(--danger)"
              : isValid
                ? "var(--success)"
                : "var(--border-default)",
            color: "var(--text-primary)",
          }}
          value={value}
          onChange={onChange}
          onPaste={onPaste}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
        />

        {isValid && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}

        {hasError && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>

      {hasError ? (
        <p className="mt-1 text-right text-sm" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      ) : (
        <p className="mt-1 text-right text-xs" style={{ color: "var(--text-dim)" }}>
          ادخل 9 ارقام بعد مفتاح الدولة
        </p>
      )}
    </div>
  );
};

export default PhoneInput;
