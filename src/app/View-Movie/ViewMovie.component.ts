import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Movie } from '../models/Movie';

@Component({
  selector: 'app-view-movie',
  templateUrl: './ViewMovie.component.html',
  styleUrls: ['./ViewMovie.component.css'],
})
export class ViewMovieComponent implements OnInit {
  @Input() movies: Movie[] = []; // List of movies passed to the component

  @Output() closeMovieEvent = new EventEmitter<void>();
  currentIndex: number = 0;
  currentMovie: Movie | null = null;

  ngOnInit(): void {
    if (this.movies.length > 0) {
      this.currentMovie = this.movies[this.currentIndex];
    } else {
      console.error('No movies provided to ViewMovieComponent.');
    }
  }

  nextMovie(): void {
    if (this.currentIndex < this.movies.length - 1) {
      this.currentIndex++;
      this.currentMovie = this.movies[this.currentIndex];
    }
  }
  parseList(data: string): string[] {
    return data.split(',').map(item => item.trim());
  }

  closeMovie(){
    this.closeMovieEvent.emit();
  }

  previousMovie(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.currentMovie = this.movies[this.currentIndex];
    }
  }
}