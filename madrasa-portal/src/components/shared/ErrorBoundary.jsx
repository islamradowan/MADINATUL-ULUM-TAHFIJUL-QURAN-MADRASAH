import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { hasError: false, message: '' };

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message ?? 'Unknown error' };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center gap-6">
        <span className="material-symbols-outlined text-6xl text-error">error</span>
        <div>
          <h1 className="text-2xl font-bold font-manrope text-primary-container mb-2">Something went wrong</h1>
          <p className="text-sm text-text-muted font-inter max-w-md">{this.state.message}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-primary-container text-white rounded-xl text-sm font-semibold font-inter hover:bg-primary transition-colors"
        >
          Reload Page
        </button>
      </div>
    );
  }
}
