import { Routes } from '@angular/router';
import { MovieList } from './pages/movie-list/movie-list';
import { Home } from './pages/home/home';
export const routes: Routes = [
    {path: '', component: Home},
    { path: 'movieList', component: MovieList },
];
