import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../supabase.service';
import { Movie } from '../../movie.config';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-home',
  imports: [FormsModule],
  providers: [SupabaseService],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  movieTitle = '';
  director = '';
  year = '';
  todos: any[] = [];

  constructor(private supabaseService: SupabaseService, private router: Router) {}

  async addMovie() {
    let movie = this.fetchMovieDetails(this.movieTitle, this.year);
    await this.saveMovie(await movie.then(m => m));
  }

  async fetchMovieDetails(title: string, year: string) : Promise<Movie> {
    try {
      const response = await fetch('http://www.omdbapi.com/?apikey=' + environment.movieDBApiKey + '&t=' + encodeURIComponent(title) + '&y=' + encodeURIComponent(year));
      const data = await response.json();
      let movie = {
        title: data.Title,
        director: data.Director,
        year: data.Year,
        genre: data.Genre,
        poster: data.Poster,
        watched: false,
        nextUp: false
      }
      return movie;
    } catch (error){
      throw error;
    }
  }

  async saveMovie(movie: Movie) {
    const { data, error } = await this.supabaseService.addMovie(movie);
    if (error) {
      alert('Either movie already in list or it was spelled wrong');
    } else {
      alert('Movie added successfully');
    }
  }

  haveTheseMoviesBeenWatched(watched: boolean) {
    this.router.navigate(['/movieList'], { state: {watched: watched } });
  }
}
