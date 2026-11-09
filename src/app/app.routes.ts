import { Routes } from '@angular/router';
import { MovieList } from './pages/movie-list/movie-list';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { authGuard, loginGuard, rootRedirectGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [rootRedirectGuard],
    component: Login,
  },
  { path: 'login', component: Login, canActivate: [loginGuard] },
  { path: 'home', component: Home, canActivate: [authGuard] },
  { path: 'movieList', component: MovieList, canActivate: [authGuard] },
];