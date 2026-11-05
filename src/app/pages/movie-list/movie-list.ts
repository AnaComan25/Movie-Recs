import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Movie } from '../../movie.config';
import { SupabaseService } from '../../supabase.service';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-movie-list',
  imports: [NgOptimizedImage],
  templateUrl: './movie-list.html',
  styleUrl: './movie-list.scss',
})
export class MovieList implements OnInit {
  movieList: Movie[] = [];
  watched: boolean = false;
  nextToWatch: Movie = {} as Movie;
  loading = false;
  
  constructor(private router: Router, private supabaseService: SupabaseService, private cdr: ChangeDetectorRef) {
  }

  async ngOnInit(){
    this.loading = true;
    const state = history.state as {watched: boolean};
    this.watched = state.watched ?? false;
    console.log('Watched:', this.watched);
    await this.getMovies();
    await this.getNextUp();
  }

  async getMovies() {
    const { data, error } = await this.supabaseService.getMovies();
    if (error) {
      console.error('Error fetching movies:', error);
    } else {
      console.log('Fetched movies:', data);
      this.loading = false;
      this.movieList = data ?? [];
      this.movieList = this.movieList.filter(movie => movie.watched === this.watched);
    }
  }

  async getNextUp(){
    const { data, error } = await this.supabaseService.getNextUp();
    if (error) {
      console.error('Error fetching next up movie:', error);
    } else {
      this.nextToWatch = (data && data.length > 0) ? data[0] : null;
    }
    this.cdr.detectChanges();
  }

  async setNextUp(movieTitle: any, movieYear: any, checked: boolean) {
    if (checked){
      const { data, error } = await this.supabaseService.setNextUp(movieTitle, movieYear);
      if (error) {
        console.error('Error setting next up movie:', error);
      } else {
        await this.getNextUp();
      }
    }
  }

  returnHome() {
    this.router.navigate(['/']);
  }

  async unsetNextUp() {
    await this.supabaseService.unsetNextUp();
    await this.getNextUp();
  }

  async updateWatchedStatus(movieTitle: any, movieYear: any, watched: boolean) {
    if (this.nextToWatch && this.nextToWatch.title === movieTitle && this.nextToWatch.year === movieYear && watched == false) {
      await this.unsetNextUp();
    }
    console.log('Updating watched status for:', movieTitle, movieYear, 'Current watched:', watched);
    const { data, error } = await this.supabaseService.updateMovieWatchedStatus(movieTitle, movieYear, !watched);
    this.getMovies();
    this.cdr.detectChanges();
  }
}
