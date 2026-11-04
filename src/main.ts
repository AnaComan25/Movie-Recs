import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

function setAppHeight() {
  const h = window.visualViewport?.height ?? window.innerHeight;
  document.documentElement.style.setProperty('--app-height', `${h}px`);
}

setAppHeight();
requestAnimationFrame(setAppHeight);
window.visualViewport?.addEventListener('resize', setAppHeight);
window.addEventListener('orientationchange', setAppHeight);
window.addEventListener('resize', setAppHeight);

bootstrapApplication(App, appConfig).catch((err) => console.error(err));