import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in application:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#111216] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-[#181a20] p-8 rounded-2xl border border-white/10 shadow-2xl">
            <h1 className="text-xl font-bold text-[#0abab5] mb-2">Произошла ошибка загрузки</h1>
            <p className="text-white/60 text-sm mb-6">
              {this.state.error?.message || 'Не удалось отобразить компонент.'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-6 py-2.5 bg-[#0abab5] hover:bg-[#099e9a] text-white font-bold rounded-xl text-sm transition-all"
            >
              Перезагрузить страницу
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
