import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { EditPlaylistNameDialogComponent } from '../edit-playlist-name/edit-playlist-name.component';
import { PlaylistService } from '../services/Playlist.service';

@Component({
  selector: 'app-playlist-movies-dialog',
  templateUrl: './playlist-movies-dialog.component.html',
  styleUrls: ['./playlist-movies-dialog.component.css']
})
export class PlaylistMoviesDialogComponent {
  playlistName: string | undefined; 

  constructor(
    public dialogRef: MatDialogRef<PlaylistMoviesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private playlistService: PlaylistService
  ) {
    if (data.movies && data.movies.length > 0) {
      this.playlistName = data.movies[0].playlistName; // Assign the playlist name
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
          this.data.movies.forEach((movie: any) => {
            this.playlistService.addMovieToPlaylist(newPlaylistName, movie).subscribe(addResponse => {
              console.log('Movie added to new playlist:', addResponse);
            });
          });

          // Delete the original playlist
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
    // Implement the logic to edit the movies in the playlist
    console.log('Edit Movies clicked');
  }
}