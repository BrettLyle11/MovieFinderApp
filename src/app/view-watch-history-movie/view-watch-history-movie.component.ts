import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Movie } from '../models/Movie';
import { MatDialog } from '@angular/material/dialog';
import { WatchHistoryService } from '../services/WatchHistory.service';
import { MovieFinderUserService } from '../services/MovieFinderUser.service';

@Component({
  selector: 'app-view-watch-history-movie',
  templateUrl: './view-watch-history-movie.component.html',
  styleUrls: ['./view-watch-history-movie.component.css'],
})
export class ViewWatchHistoryMovieComponent implements OnInit {
  @Input() movies: Movie[] = []; // List of movies passed to the component
  @Output() closeMovieEvent = new EventEmitter<void>();
  currentIndex: number = 0;
  currentMovie: Movie | null = null;
  public signedInUser: any = null;

  constructor(private dialog: MatDialog, private watchHistoryService: WatchHistoryService, private service: MovieFinderUserService) {
    this.signedInUser = this.service.getUser();
  }

  ngOnInit(): void {
    console.log(this.movies)
    if (this.movies.length > 0) {
      this.currentMovie = this.movies[this.currentIndex];
    } else {
      console.error('No movies provided to ViewWatchHistoryMovieComponent.');
    }
  }

  nextMovie(): void {
    if (this.currentIndex < this.movies.length - 1) {
      this.currentIndex++;
      this.currentMovie = this.movies[this.currentIndex];
    }
  }

  previousMovie(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.currentMovie = this.movies[this.currentIndex];
    }
  }

  parseList(data: string): string[] {
    return data.split(',').map(item => item.trim());
  }

  closeMovie() {
    this.closeMovieEvent.emit();
  }

  RemoveMovieFromWatchHistory(): void {
    let movieTitle = this.currentMovie?.title;
    let movieYear = this.currentMovie?.year;
    if (movieTitle && movieYear) {
      this.watchHistoryService.removeMovieFromWatchHistory(this.signedInUser.id, movieTitle, movieYear).subscribe(response => {
        console.log('Movie removed from watch history:', response);
      });
      this.closeMovie();
    } else {
      console.error('Movie title or year is undefined.');
    }
  }
}