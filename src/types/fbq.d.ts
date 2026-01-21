declare global {
  interface Window {
    fbq: {
      (command: 'consent', action: 'grant' | 'revoke'): void;
      (command: 'init', pixelId: string): void;
      (command: 'track', event: string, params?: Record<string, unknown>): void;
      (command: 'trackCustom', event: string, params?: Record<string, unknown>): void;
      callMethod?: (...args: unknown[]) => void;
      queue: unknown[];
      loaded: boolean;
      version: string;
      push: (...args: unknown[]) => void;
    };
    _fbq: unknown;
  }
}

export {};
