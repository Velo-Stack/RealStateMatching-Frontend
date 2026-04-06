const FormField = ({ label, required, children, hint }) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-300">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {hint && <p className="mt-2 text-xs text-slate-500">{hint}</p>}
    </div>
  );
};

export default FormField;
