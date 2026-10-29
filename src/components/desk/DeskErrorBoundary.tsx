import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode; label: string };
type State = { hasError: boolean; attempt: number };

/** Isolates a fault to one desk; the other desks, Sentinel and bus stay mounted. */
export default class DeskErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, attempt: 0 };

  static getDerivedStateFromError(): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Details stay out of production consoles: an error can carry mission text.
    if (import.meta.env.DEV) console.error(`Desk render error (${this.props.label}):`, error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return <div key={this.state.attempt} className="contents">{this.props.children}</div>;
    return (
      <div role="alert" className="border border-border bg-navy-tint p-6 text-center">
        <p className="eyebrow mb-3">Desk notice</p>
        <p className="text-foreground/85 mb-5">{this.props.label} encountered a display issue. The other desks are unaffected.</p>
        <button
          type="button"
          onClick={() => this.setState((s) => ({ hasError: false, attempt: s.attempt + 1 }))}
          className="inline-flex items-center border border-border px-5 py-2 text-sm hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Reload this desk
        </button>
      </div>
    );
  }
}
