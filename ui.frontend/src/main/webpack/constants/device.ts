export const isTouchDevice = 
    'ontouchstart' in window || 
    navigator.maxTouchPoints > 0 || 
    (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);