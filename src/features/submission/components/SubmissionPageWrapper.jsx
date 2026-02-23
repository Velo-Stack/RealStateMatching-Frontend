const SubmissionPageWrapper = ({ children }) => (
  <div
    className="min-h-screen flex items-center justify-center p-4"
    style={{
      background:
        "linear-gradient(135deg, #0a0f1c 0%, #111827 40%, #0d1526 100%)",
    }}
    dir="rtl"
  >
    <div className="w-full max-w-2xl">
      <div className="bg-[#111827]/80 backdrop-blur-xl rounded-3xl border border-white/5 p-6 sm:p-8 shadow-2xl">
        {children}
      </div>
    </div>
  </div>
);

export default SubmissionPageWrapper;
