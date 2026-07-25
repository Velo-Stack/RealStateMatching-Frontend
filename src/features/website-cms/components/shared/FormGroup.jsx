const FormGroup = ({ title, children }) => {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/40 p-4">
      <h3 className="mb-3 text-sm font-semibold text-white">{title}</h3>
      {children}
    </div>
  );
};

export default FormGroup;
