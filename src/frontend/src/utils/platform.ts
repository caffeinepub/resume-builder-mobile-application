// Platform detection utilities for gating Android-specific UI

export function isAndroid(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /android/i.test(navigator.userAgent);
}

export function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

export function isDesktop(): boolean {
  if (typeof navigator === 'undefined') return true;
  
  // Check for coarse pointer (mobile/tablet) vs fine pointer (desktop)
  const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
  
  // If has fine pointer or no touch, likely desktop
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
  
  // Desktop if: fine pointer AND not mobile UA
  const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent);
  
  return hasFinePointer && !isMobileUA && !hasCoarsePointer;
}
