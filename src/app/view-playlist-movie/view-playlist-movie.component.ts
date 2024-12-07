import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Movie } from '../models/Movie';
import { MatDialog } from '@angular/material/dialog';
import { PlaylistService } from '../services/Playlist.service';
import { MovieFinderUserService } from '../services/MovieFinderUser.service';

@Component({
  selector: 'app-view-playlist-movie',
  templateUrl: './view-playlist-movie.component.html',
  styleUrls: ['./view-playlist-movie.component.css'],
})
export class ViewPlaylistMovieComponent implements OnInit {
  @Input() movies: Movie[] = []; // List of movies passed to the component
  @Input() playlistName: string = '';
  @Output() closeMovieEvent = new EventEmitter<void>();
  currentIndex: number = 0;
  currentMovie: Movie | null = null;
  public signedInUser: any = null;

  constructor(private dialog: MatDialog, private playlistService: PlaylistService, private service: MovieFinderUserService) {
      console.log(this.movies);
      console.log(this.playlistName);
      this.signedInUser =  this.service.getUser();
  }

  ngOnInit(): void {
    if (this.movies.length > 0) {
      this.currentMovie = this.movies[this.currentIndex];
    } else {
      console.error('No movies provided to ViewPlaylistMovieComponent.');
    }
  }

  nextMovie(): void {
    console.log('Next movie');
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

  RemoveMovieFromPlaylist(): void {
    let movieTitle = this.currentMovie?.title;
    let movieYear = this.currentMovie?.year;
    if (movieTitle && movieYear) {
      this.playlistService.removeMovieFromPlaylist(this.signedInUser.id, this.playlistName, movieTitle, movieYear).subscribe(response => {
      });
      console.log('close movie pls')
      this.closeMovie();
    } else {
      console.error('Movie title or year is undefined.');
    }
  }
}