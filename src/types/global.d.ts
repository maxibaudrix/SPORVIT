// src/types/global.d.ts

// Google Analytics gtag types
interface Window {
  gtag?: (
    command: 'config' | 'event' | 'js' | 'set',
    targetId: string,
    config?: Record<string, any>
  ) => void;
  dataLayer?: Array<any>;
}

// Wake Lock API types
interface WakeLockSentinel extends EventTarget {
  released: boolean;
  type: 'screen';
  release(): Promise<void>;
}

interface Navigator {
  wakeLock?: {
    request(type: 'screen'): Promise<WakeLockSentinel>;
  };
}

// Vibration API
interface Navigator {
  vibrate(pattern: number | number[]): boolean;
}

// Crypto UUID (para navegadores sin soporte)
interface Crypto {
  randomUUID?: () => string;
}