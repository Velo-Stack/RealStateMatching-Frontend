const FormGroup = ({ title, children }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-6">
      <h3 className="mb-4 text-lg font-semibold text-white">{title}</h3>
      {children}
    </div>
  );
};

export default FormGroup;
