import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PlaylistService } from '../services/Playlist.service';
import { forkJoin } from 'rxjs';
import { MovieFinderUserService } from '../services/MovieFinderUser.service';
import { MatSelectionListChange } from '@angular/material/list';

@Component({
  selector: 'app-add-to-playlist-dialog',
  templateUrl: './add-to-playlist-dialog.component.html',
  styleUrls: ['./add-to-playlist-dialog.component.css']
})
export class AddToPlaylistDialogComponent {
  playlistMovies: any[] = [];
  playlistsStatus: { playlistName: string, loaded: boolean, containsMovie: boolean }[] = [];
  public signedInUser: any = null;

  constructor(
    public dialogRef: MatDialogRef<AddToPlaylistDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private playlistService: PlaylistService,
    private service: MovieFinderUserService
  ) {
    this.signedInUser =  this.service.getUser();
    console.log(data);
  }

  ngOnInit(): void {
    this.initializePlaylistsStatus();
    this.loadPlaylistMovies();
  }

  initializePlaylistsStatus(): void {
    this.playlistsStatus = this.data.playlists.map((playlist: any) => ({
      playlistName: playlist.playlistName,
      loaded: false,
      containsMovie: false
    }));
  }

  loadPlaylistMovies(): void {
    const movieRequests = this.data.playlists.map((playlist: any) => 
      this.playlistService.getPlaylistMovies(this.signedInUser.id, playlist.playlistName)
    );

    forkJoin(movieRequests).subscribe((value: unknown) => {
      const moviesArray = value as any[][];
      moviesArray.forEach((movies, index) => {
        console.log(movies)
        this.playlistsStatus[index].loaded = true;
        this.playlistsStatus[index].containsMovie = movies.some(movie => movie.name === this.data.movie.title && movie.year === this.data.movie.year);
      });

      console.log('Playlists Status:', this.playlistsStatus);
    });
  }

  

  onCancel(): void {
    this.dialogRef.close();
  }

  onAdd(selectedPlaylists: any): void {
    this.dialogRef.close(selectedPlaylists.map((option: any) => option.value));
  }

  onSelectionChange(event: MatSelectionListChange): void {
    const selectedOption = event.options[0];
    const index = this.data.playlists.findIndex((playlist: any) => playlist.playlistName === selectedOption.value.playlistName);

    if (this.playlistsStatus[index].containsMovie) {
      // Revert the selection change if the option was previously selected
      selectedOption.selected = true;
    }
  }
}