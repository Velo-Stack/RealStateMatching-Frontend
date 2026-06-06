import ValidatedInput from "./ValidatedInput";
import { formatNumberWithCommas } from "../../utils/numberFormatting";

const FormattedNumberInput = ({
  name,
  value,
  onChange,
  maxDigits = 15,
  onPaste,
  onKeyDown,
  ...props
}) => {
  const handleChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, maxDigits);
    const formatted = formatNumberWithCommas(digitsOnly);
    onChange({
      ...e,
      target: { ...e.target, name, value: formatted },
    });
  };

  const handlePaste = (e) => {
    if (onPaste) {
      onPaste(e);
      return;
    }
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const digitsOnly = pastedText.replace(/\D/g, "").slice(0, maxDigits);
    const formatted = formatNumberWithCommas(digitsOnly);
    onChange({
      ...e,
      target: { ...e.target, name, value: formatted },
    });
  };

  const handleKeyDown = (e) => {
    if (onKeyDown) {
      onKeyDown(e);
      return;
    }
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const allowedControlKeys = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
      "Home",
      "End",
    ];
    if (allowedControlKeys.includes(e.key)) return;
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <ValidatedInput
      name={name}
      type="text"
      inputMode="numeric"
      pattern="[0-9,]*"
      value={value}
      onChange={handleChange}
      onPaste={handlePaste}
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
};

export default FormattedNumberInput;
