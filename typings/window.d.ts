declare global {
  interface Window {
    analytics: any;
  }
}

window.analytics = window.analytics || {};
