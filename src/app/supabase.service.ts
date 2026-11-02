import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Movie } from './movie.config';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;
  constructor() {
    this.supabase = createClient(
      environment.supabaseURL,
      environment.supabaseApiKey
    );
  }

  getMovies() {
    return this.supabase.from('movies').select('*');
  }

  addMovie(movie: Movie) {
    return this.supabase.from('movies').insert(movie);
  }

  updateMovieWatchedStatus(movieTitle: any, movieYear: any, watched: boolean) {
    return this.supabase.from('movies').update({watched: watched}).eq('title', movieTitle).eq('year', movieYear);
  }

  getNextUp() {
    return this.supabase.from('movies').select('*').eq('nextUp', true);
  }

  async setNextUp(movieTitle: any, movieYear: any) {
    //check if getnextup returns anything
    const nextUpMovies = await this.getNextUp();
    if (nextUpMovies.data && nextUpMovies.data.length > 0) {
      // unset the current nextUp movie
      const currentNextUp = nextUpMovies.data[0];
      await this.supabase.from('movies').update({nextUp: false}).eq('title', currentNextUp.title).eq('year', currentNextUp.year);
    } 

    return this.supabase.from('movies').update({nextUp: true}).eq('title', movieTitle).eq('year', movieYear);
  }

  async unsetNextUp() {
    const nextUpMovies = await this.getNextUp();
    if (nextUpMovies.data && nextUpMovies.data.length > 0) {
      const currentNextUp = nextUpMovies.data[0];
      await this.supabase.from('movies').update({nextUp: false}).eq('title', currentNextUp.title).eq('year', currentNextUp.year);
      return nextUpMovies.data[0];
    }
  }
}