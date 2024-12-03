import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Movie } from '../models/Movie';
import { AddToPlaylistDialogComponent } from '../add-to-playlist-dialog/add-to-playlist-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PlaylistService } from '../services/Playlist.service';

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

  playlists: any[] = []; // Replace 'any' with your playlist model

  constructor(private dialog: MatDialog, private playlistService: PlaylistService) {} // Inject MatDialog and PlaylistService

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

  AddMovieToPlaylist(): void {
    this.playlistService.getPlaylists(1).subscribe((data: any[]) => {
      this.playlists = data;
    });

    const dialogRef = this.dialog.open(AddToPlaylistDialogComponent, {
      width: '400px',
      data: { playlists: this.playlists, movie: this.currentMovie }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Selected Playlists:', result);
        // Add logic to add the movie to the selected playlists
        result.forEach((playlist: any) => {
          this.playlistService.addMovieToPlaylist(playlist.id, this.currentMovie).subscribe(response => {
            console.log('Movie added to playlist:', response);
          });
        });
      }
    });
  }
}