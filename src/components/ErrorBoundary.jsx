import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Unhandled UI error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-4">
          <div className="max-w-md w-full rounded-2xl border border-white/10 bg-[#111827]/80 p-6 text-center">
            <h2 className="text-white text-lg font-bold mb-2">حدث خطأ غير متوقع</h2>
            <p className="text-slate-400 text-sm mb-5">
              حصل خطأ أثناء تحميل الصفحة. جرب إعادة التحميل.
            </p>
            <button
              type="button"
              onClick={this.handleRetry}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm transition-colors"
            >
              إعادة التحميل
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
