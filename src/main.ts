import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

function setAppHeight() {
  const h = window.visualViewport?.height ?? window.innerHeight;
  document.documentElement.style.setProperty('--app-height', `${h}px`);
}

function preventPinchZoom() {
  document.addEventListener('gesturestart', (e) => e.preventDefault(), { passive: false });
  document.addEventListener('gesturechange', (e) => e.preventDefault(), { passive: false });
  document.addEventListener('gestureend', (e) => e.preventDefault(), { passive: false });
}

preventPinchZoom();
setAppHeight();
requestAnimationFrame(setAppHeight);
window.addEventListener('load', setAppHeight);
window.addEventListener('pageshow', setAppHeight);
window.addEventListener('orientationchange', setAppHeight);
window.visualViewport?.addEventListener('resize', setAppHeight);
window.visualViewport?.addEventListener('scroll', setAppHeight);
setTimeout(setAppHeight, 100);

bootstrapApplication(App, appConfig).catch((err) => console.error(err));