interface Window {
  env?: {
    apiUrl?: string;
    turnstileSiteKey?: string;
  };
  umami?: {
    track: (name: string, data?: Record<string, string | number | boolean>) => void;
    identify: (userId: string, data?: Record<string, string | number | boolean>) => void;
  };
}
