import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

function setAppHeight() {
  const vv = window.visualViewport?.height ?? 0;
  const h = Math.max(window.innerHeight, vv);
  document.documentElement.style.setProperty('--app-height', `${h}px`);
}

setAppHeight();
requestAnimationFrame(setAppHeight);
window.addEventListener('load', setAppHeight);
window.addEventListener('pageshow', setAppHeight);
window.addEventListener('orientationchange', setAppHeight);
window.addEventListener('resize', setAppHeight);
window.visualViewport?.addEventListener('resize', setAppHeight);
setTimeout(setAppHeight, 100);
setTimeout(setAppHeight, 500);

bootstrapApplication(App, appConfig).catch((err) => console.error(err));