import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Movie } from '../../movie.config';
import { SupabaseService } from '../../supabase.service';
import { NgOptimizedImage } from '@angular/common';
import { SwipeableDirective } from '../../directives/swipeable-directive';

@Component({
  selector: 'app-movie-list',
  imports: [SwipeableDirective],
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

  isDragging = false;
  startX = 0;
  currentX = 0;
  previousX = 0;
  threshold = 50; // Minimum pixels to snap/slide

  onTouchStart(event: TouchEvent): void {
    this.isDragging = true;
    this.startX = event.touches[0].clientX - this.previousX;
  }

  onTouchMove(event: TouchEvent): void {
    if (!this.isDragging) return;
    const clientX = event.touches[0].clientX;
    this.currentX = clientX - this.startX;
  }

  onTouchEnd(): void {
    this.isDragging = false;
    this.previousX = this.currentX;

    // Optional: snap or reset behavior if dragged past a threshold
    if (this.currentX > 150) {
      this.currentX = 150; // Max right limit
    } else if (this.currentX < -150) {
      this.currentX = -150; // Max left limit
    }
  }

  async ngOnInit(){
    this.loading = true;
    const state = history.state as {watched: boolean};
    this.watched = state.watched ?? false;
    await this.getMovies();
    await this.getNextUp();
  }

  async getMovies() {
    const { data, error } = await this.supabaseService.getMovies();
    if (error) {
      console.error('Error fetching movies:', error);
    } else {
      this.loading = false;
      this.movieList = data ?? [];
      this.movieList = this.movieList.filter(movie => movie.watched === this.watched);
    }
  }

  async deleteMovie(title: any, year: any){
    this.movieList = this.movieList.filter((movie) => movie.title!=title && movie.year!=year);
    await this.supabaseService.deleteMovie(title, year);
    if(this.nextToWatch && this.nextToWatch.title == title && this.nextToWatch.year == year){
      this.unsetNextUp();
    }
    this.cdr.detectChanges;
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
    const { data, error } = await this.supabaseService.updateMovieWatchedStatus(movieTitle, movieYear, !watched);
    this.getMovies();
    this.cdr.detectChanges();
  }
}
