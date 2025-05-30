export {};

declare global {
  interface Window {
    __coverage__?: Record<string, unknown>;
  }
}
