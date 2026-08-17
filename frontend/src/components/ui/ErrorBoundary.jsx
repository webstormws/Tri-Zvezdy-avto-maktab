import { Component } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h1 className="mt-6 text-2xl font-extrabold text-ink">Xatolik yuz berdi</h1>
          <p className="mt-3 max-w-sm text-sm text-ink/55">
            Sahifani yuklashda kutilmagan xatolik aniqlandi. Iltimos, qayta urinib ko'ring.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false });
              window.location.reload();
            }}
            className="btn-primary mt-8"
          >
            <RefreshCw className="h-4 w-4" />
            Qayta yuklash
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
