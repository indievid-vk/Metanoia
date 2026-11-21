import React, { Component } from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  declare props: ErrorBoundaryProps;
  declare setState: (state: Partial<ErrorBoundaryState>) => void;
  state: ErrorBoundaryState = { hasError: false };

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: { componentStack?: string }) {
    console.error('Page render error:', error, info?.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-md mx-auto my-12 p-6 bg-white/70 border border-[var(--color-cinnabar)]/20 rounded-2xl text-center space-y-4 shadow-sm">
          <div className="text-3xl text-[var(--color-cinnabar)]">✙</div>
          <h2 className="font-izhitsa text-xl text-[var(--color-cinnabar)]">
            Не удалось отобразить раздел
          </h2>
          <p className="text-sm text-[var(--color-ink)]/70 font-sans">
            Произошла непредвиденная ошибка при открытии страницы. Попробуйте обновить экран.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false });
              window.location.reload();
            }}
            className="px-6 py-2.5 bg-[var(--color-cinnabar)] text-white rounded-xl font-izhitsa text-base shadow hover:brightness-110 transition-all cursor-pointer"
          >
            Обновить страницу
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
