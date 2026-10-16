import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode; resetKey?: string };
type State = { hasError: boolean };

/**
 * Keeps a rendering error in one page from unmounting the whole <main> view.
 * Resets automatically when the route (resetKey) changes.
 */
export default class RouteErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Route render error:", error, info.componentStack);
  }

  componentDidUpdate(prev: Props) {
    if (this.state.hasError && prev.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="container mx-auto px-6 py-24">
        <div className="max-w-xl mx-auto border border-border bg-navy-tint p-8 text-center">
          <p className="eyebrow mb-4">Display notice</p>
          <p className="text-foreground/85 mb-6">This page encountered a display issue.</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center border border-border px-5 py-2 text-sm hover:bg-foreground/5"
          >
            Reload page
          </button>
        </div>
      </div>
    );
  }
}
