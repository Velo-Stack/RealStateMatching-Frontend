const FormField = ({ label, required, children, hint }) => {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-400">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-slate-500">{hint}</p>}
    </div>
  );
};

export default FormField;
