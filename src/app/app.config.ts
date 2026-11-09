import {
  ApplicationConfig,
  inject,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  provideRouter,
  Router,
  withViewTransitions,
} from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideServiceWorker } from '@angular/service-worker';

function primaryRoutePath(snapshot: ActivatedRouteSnapshot | null | undefined): string {
  if (!snapshot) return '';
  let route = snapshot;
  while (route.firstChild) {
    route = route.firstChild;
  }
  const configured = route.routeConfig?.path;
  if (configured !== undefined && configured !== '') return configured;
  if (configured === '') return '';
  return route.url.map((s) => s.path).join('');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withViewTransitions({
        skipInitialTransition: true,
        onViewTransitionCreated: ({ transition, from, to }) => {
                          const router = inject(Router);
                          const nav = router.currentNavigation();
                          const fromPath = primaryRoutePath(from);
                          const toPath = primaryRoutePath(to);
                          const html = document.documentElement;

                          if (nav?.extras?.state?.['skipTransition']) {
                            transition.skipTransition();
                            return;
                          }

                          const isFirstNav = !nav?.previousNavigation;
                          if (isFirstNav && fromPath === '' && (toPath === 'home' || toPath === 'login')) {
                            transition.skipTransition();
                            return;
                          }

                          if (fromPath === 'home' && toPath === 'login') {
                            transition.skipTransition();
                            return;
                          }

                          html.classList.remove('slide-reverse', 'fade-only');

                          if (fromPath === 'login' && toPath === 'home') {
                            html.classList.add('fade-only');
                          } else if (fromPath === 'movieList' && toPath === 'home') {
                            html.classList.add('slide-reverse');
                          }
                        },
      }),
    ),
    provideClientHydration(withEventReplay()),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};