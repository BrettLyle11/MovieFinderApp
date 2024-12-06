import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Movie } from '../models/Movie';
import { MatDialog } from '@angular/material/dialog';
import { PlaylistService } from '../services/Playlist.service';
import { AddToPlaylistDialogComponent } from '../add-to-playlist-dialog/add-to-playlist-dialog.component';

@Component({
  selector: 'app-view-playlist-movie',
  templateUrl: './view-playlist-movie.component.html',
  styleUrls: ['./view-playlist-movie.component.css'],
})
export class ViewPlaylistMovieComponent implements OnInit {
  @Input() movies: Movie[] = []; // List of movies passed to the component
  @Output() closeMovieEvent = new EventEmitter<void>();
  currentIndex: number = 0;
  currentMovie: Movie | null = null;
  playlists: any[] = []; // Replace 'any' with your playlist model

  constructor(private dialog: MatDialog, private playlistService: PlaylistService) {
    this.playlistService.getPlaylists(1).subscribe((data: any[]) => {
      this.playlists = data;
      console.log(this.playlists);
      console.log(this.playlists[0].playlistName);
    });
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
    console.log(this.playlists);
    // this.playlistService.removeMovieFromPlaylist(1, , movieTitle, movieYear).subscribe(response => {
    //   console.log('Movie removed from playlist:', response);
    // });
  }
}