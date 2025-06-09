// Import A-Frame to ensure it's available globally
import * as AFRAME from 'aframe';

// This is necessary to ensure AFRAME is available globally
if (window && !window.AFRAME) {
  (window as any).AFRAME = AFRAME;
}

export default AFRAME;