export interface PlatformInfo {
  isMobile: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isStandalone: boolean;
  hasTouch: boolean;
  hasVibration: boolean;
}

export function detectPlatform(): PlatformInfo {
  const ua = navigator.userAgent;
  
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isAndroid = /Android/.test(ua);
  const isMobile = isIOS || isAndroid || /Mobi|Android/i.test(ua);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true;
  const hasTouch = 'ontouchstart' in window;
  const hasVibration = 'vibrate' in navigator;

  return {
    isMobile,
    isIOS,
    isAndroid,
    isStandalone,
    hasTouch,
    hasVibration
  };
}

export function isPortrait(): boolean {
  return window.innerHeight > window.innerWidth;
}

export function getSafeAreaInsets(): {
  top: number;
  bottom: number;
  left: number;
  right: number;
} {
  const style = getComputedStyle(document.documentElement);
  return {
    top: parseInt(style.getPropertyValue('--safe-area-inset-top') || '0'),
    bottom: parseInt(style.getPropertyValue('--safe-area-inset-bottom') || '0'),
    left: parseInt(style.getPropertyValue('--safe-area-inset-left') || '0'),
    right: parseInt(style.getPropertyValue('--safe-area-inset-right') || '0')
  };
}
