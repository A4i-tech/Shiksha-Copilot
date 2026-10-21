interface Window {
  env?: {
    apiUrl?: string;
    turnstileSiteKey?: string;
    umamiUrl?: string;
    umamiWebsiteId?: string;
  };
  umami?: {
    track: (name: string, data?: Record<string, string | number | boolean>) => void;
    identify: (userId: string, data?: Record<string, string | number | boolean>) => void;
  };
}
