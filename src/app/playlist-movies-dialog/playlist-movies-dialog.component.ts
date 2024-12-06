import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { EditPlaylistNameDialogComponent } from '../edit-playlist-name/edit-playlist-name.component';
import { PlaylistService } from '../services/Playlist.service';
import { ViewPlaylistMovieComponent } from '../view-playlist-movie/view-playlist-movie.component';

@Component({
  selector: 'app-playlist-movies-dialog',
  templateUrl: './playlist-movies-dialog.component.html',
  styleUrls: ['./playlist-movies-dialog.component.css']
})
export class PlaylistMoviesDialogComponent {
  @Output() editMoviesEvent = new EventEmitter<any>();
  playlistName: string | undefined;
  movies: any[] = []; // Add a property to store movies

  constructor(
    public dialogRef: MatDialogRef<PlaylistMoviesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private playlistService: PlaylistService
  ) {
    if (data.playlist) {
      this.playlistName = data.playlist.playlistName; // Assign the playlist name
    }
    if (data.movies) {
      this.movies = data.movies; // Assign the movies
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onEditName(): void {
    const dialogRef = this.dialog.open(EditPlaylistNameDialogComponent, {
      width: '300px',
      data: { currentName: this.playlistName }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('New Playlist Name:', result);
        const newPlaylistName = result;
        const userID = 1; // Replace with the actual user ID

        // Create the new playlist
        this.playlistService.createPlaylist(newPlaylistName, userID).subscribe(response => {
          console.log('New playlist created:', response);

          // Add each movie from the original playlist to the new playlist
          this.movies.forEach((movie: any) => {
            console.log(movie);
            this.playlistService.addMovieToPlaylist2(newPlaylistName, movie.year, movie.title).subscribe(addResponse => {
              console.log('Movie added to new playlist:', addResponse);
            });

            // Update the watch time for the new playlist
          this.playlistService.updatePlaylistWatchTime(newPlaylistName, movie.durationMins).subscribe(updateResponse => {
            console.log('Watch time updated for new playlist:', updateResponse);
          });
          });

          // Delete the movies from the original playlist
          console.log(this.playlistName!);
          this.playlistService.deletePlaylistMovies(userID, this.playlistName!).subscribe(deleteResponse => {
            console.log('Movies deleted from original playlist:', deleteResponse);
          });

          // Delete the original playlist
          console.log(this.playlistName!);
          this.playlistService.deletePlaylist(userID, this.playlistName!).subscribe(deleteResponse => {
            console.log('Original playlist deleted:', deleteResponse);
            // Update the playlist name in the component
            this.playlistName = newPlaylistName;
          });
        });
      }
    });
  }

  onEditMovies(): void {
    this.editMoviesEvent.emit(this.movies); // Emit the event with the movies data
    this.dialogRef.close(); // Close the dialog
  }
}