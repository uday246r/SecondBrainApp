declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: (element?: HTMLElement | null) => void;
      };
    };
  }
}

export {}; 