import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MovieFinderUserService } from '../services/MovieFinderUser.service';
import { debounceTime, distinctUntilChanged, forkJoin } from 'rxjs';
import { MovieService } from '../services/movie.service';
import { MovieFilters } from '../models/MovieFilters';
import { Genre } from '../services/Genres.service';
import { Movie } from '../models/Movie';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PlaylistDialogComponent } from '../playlist-dialog/playlist-dialog.component';
import { PlaylistService } from '../services/Playlist.service';
import { PlaylistMoviesDialogComponent } from '../playlist-movies-dialog/playlist-movies-dialog.component';
import { SearchMovie } from '../models/SearchMovie';
import { AdminService } from '../services/Admin.service';
import { WatchHistoryService } from '../services/WatchHistory.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './UserPage.component.html',
  styleUrls: ['./UserPage.component.css'],
})
export class UserPageComponent implements OnInit {
  playlists: any[] = []; // Replace 'any' with your playlist model
  searchForm: FormGroup;
  streamingPlatforms: string[] = ['Apple TV', 'Netflix', 'BritBox', 'Disney+', 'Crave', 'Curiosity Stream', 'Hotstar', 'Mubi', 'Paramount+', 'Pulto TV', 'Prime Video', 'Tubi', 'Zee5'];
  selectedPlatforms: string[] = [];
  public signedInUser: any = null;


  suggestedActors: string[] = [];
  showSuggestionsActors: boolean = false;
  selectedActor: string[] = [];

  suggestedDirectors: string[] = [];
  showSuggestionsDirectors = false;
  selectedDirectors: string[] = [];

  genres: string[] = [];
  selectedGenres: string[] = [];

  selectedRatingCompanies: string[] = [];
  selectedRatingCompany: string = '';
  ratingCompanies: Map<string, string> = new Map();
  ratingKeys: string[] = [];

  showResulst = false;

  movieList: Movie[] = [];
  showPlaylistMovies = false;
  playlistMovies: any[] = [];
  selectedPlaylistName: string = '';
  showWatchHistoryMovies = false;
  watchHistoryMovies: any[] = [];

  constructor(private fb: FormBuilder, private movieService: MovieService, private router: Router, private service: MovieFinderUserService, private dialog: MatDialog, private playlistService: PlaylistService, private adminService: AdminService, private watchHistoryService: WatchHistoryService) {
    this.searchForm = this.fb.group({
      title: [''],
      actor: [''],
      director: [''],
      selectedRatingCompany: [''],
      minimumRating: [''],
      year: [''],
      duration: [''],
      // We will handle streaming platforms separately
    });
  }


  ngOnInit(): void {
    this.signedInUser = this.service.getUser();
    console.log('Signed in user:', this.signedInUser);
    this.loadPlaylists();
    this.genres = Object.values(Genre);
    this.selectedGenres.push(this.signedInUser.favouriteGenre);

    this.movieService.getAllRatingCompanies().subscribe((response) => {

      for (const ratingCompany of response) {
        this.ratingCompanies.set(ratingCompany.ratingCompanyName, ratingCompany.ratingScale);
      }
      this.ratingKeys = Array.from(this.ratingCompanies.keys());

    });

    // For actor name changes:
    this.searchForm.get('actor')?.valueChanges
      .pipe(
        debounceTime(700), // Wait 2 seconds after user stops typing
        distinctUntilChanged() // Trigger only if the value changes
      )
      .subscribe((actorName) => {
        this.onActorNameChanged(actorName); // Call your function here
      });


    this.searchForm.get('director')?.valueChanges
      .pipe(debounceTime(700), distinctUntilChanged())
      .subscribe((directorName) => {
        this.onDirectorNameChanged(directorName);
      });
    this.showResulst = false;
  }
  onDirectorNameChanged(directorName: any) {
    this.movieService.searchForDirectorLikeNames(directorName).subscribe((response) => {
      this.suggestedDirectors = response;
      this.showSuggestionsDirectors = true;
    });
  }

  selectDirector(director: string) {
    this.selectedDirectors.push(director);
    this.showSuggestionsDirectors = false;
  }

  clearDirector(director: string) {
    this.selectedDirectors = this.selectedDirectors.filter((d) => d !== director);
  }
  hideSuggestionsDirectors() {
    setTimeout(() => {
      this.showSuggestionsDirectors = false;
    }, 200);
  }


  onActorNameChanged(actorName: any) {
    this.movieService.searchForActorLikeNames(actorName).subscribe((response) => {
      console.log('Actor search response:', response);
      this.suggestedActors = response;
      this.showSuggestionsActors = true;
    });
  }

  selectActor(actor: string) {
    // Set the selected actor name in the form control and close suggestions
    this.selectedActor.push(actor);
    this.showSuggestionsActors = false;
  }

  clearActor(actor: string) {
    // Clear the selected actor name
    this.selectedActor = this.selectedActor.filter((a) => a !== actor);
  }

  hideSuggestions() {
    // Hide suggestions after a brief delay to allow clicks to register
    setTimeout(() => {
      this.showSuggestionsActors = false;
    }, 200);
  }

  preventClose(event: MouseEvent) {

    event.preventDefault();
  }

  loadPlaylists() {
    this.playlistService.getPlaylists(this.signedInUser.id).subscribe(
      (data: any[]) => {
        this.playlists = data; // Populate the playlists property with data from the service
        console.log(this.playlists);
      },
      (error) => {
        console.error('Error loading playlists:', error);
        this.playlists = []; // Set playlists to be empty in case of an error
      }
    );
  }

  onPlaylistClick(playlist: any) {
    console.log('Playlist clicked:', playlist);
    this.playlistMovies = [];
    this.playlistService.getPlaylistMoviesWithDetails(this.signedInUser.id, playlist.playlistName).subscribe((data) => {
      console.log('Playlist movies:', data);
      data.forEach((movie) => {
        let currMovie: SearchMovie = {
          name: movie.title,
          year: movie.year,
        };
        this.adminService.searchMovie(currMovie).subscribe((movieData: any) => {
          console.log('Movie data:', movieData);
          this.playlistMovies.push(movieData);
        });
      })
      const dialogRef = this.dialog.open(PlaylistMoviesDialogComponent, {
        width: '500px',
        data: { playlist: playlist, movies: data }
      });

      dialogRef.componentInstance.editMoviesEvent.subscribe((eventData: { movies: any[], playlistName: string }) => {
        this.selectedPlaylistName = eventData.playlistName;
        this.showPlaylistMovies = true;
      });

      dialogRef.afterClosed().subscribe(() => {
        console.log('loaded')
        this.loadPlaylists(); // Refresh the list of playlists after the dialog is closed
      });
    });
  }

  handleClosePlaylistMovie() {
    this.showPlaylistMovies = false;
  }

  handleCloseWatchHistoryMovie() {
    this.showWatchHistoryMovies = false;
  }

  createPlaylist() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px'; // Set the width of the dialog
    dialogConfig.panelClass = 'custom-dialog-container'; // Add a custom class for additional styling

    const dialogRef = this.dialog.open(PlaylistDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Playlist Name:', result.name);
        this.playlistService.createPlaylist(result.name, this.signedInUser.id).subscribe(response => {
          console.log('Playlist created:', response);
          this.loadPlaylists();
        });
      }
    });
  }

  goToWatchHistory() {
    // Clear the current watch history movies
    this.watchHistoryMovies = [];
  
    // Fetch the watch history from the service
    this.watchHistoryService.getWatchHistory(this.signedInUser.id).subscribe((data) => {
      if (data) {
        const movieRequests = data.map((movie) => {
          let currMovie: SearchMovie = {
            name: movie.name,
            year: movie.year,
          };
          return this.adminService.searchMovie(currMovie);
        });
    
        // Wait for all movie search requests to complete
        forkJoin(movieRequests).subscribe((movieDataArray: any[]) => {
          this.watchHistoryMovies = movieDataArray;
          console.log('Watch history movies:', this.watchHistoryMovies);
    
          // Set showWatchHistoryMovies to true after the watch history movies are populated
          this.showWatchHistoryMovies = true;
        });
      } else {
        this.showWatchHistoryMovies = true;
      }
    });
  }


  onGenreChange(event: any) {
    const genre = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
      // Add the genre to the selectedGenres array
      this.selectedGenres.push(genre);
    } else {
      // Remove the genre from the selectedGenres array
      const index = this.selectedGenres.indexOf(genre);
      if (index > -1) {
        this.selectedGenres.splice(index, 1);
      }
    }

    // Debugging: Log the selected genres
    console.log('Selected Genres:', this.selectedGenres);
  }

  validateRating(range: string) {

    if (range === '1-10') {
      const ratingControl = this.searchForm.get('minimumRating');
      if (ratingControl && ratingControl.value < 1) {
        ratingControl.setValue(1);
      } else if (ratingControl && ratingControl.value > 10) {
        ratingControl.setValue(10);
      }
    }
    else if (range === '1-100') {
      const ratingControl = this.searchForm.get('minimumRating');
      if (ratingControl && ratingControl.value < 1) {
        ratingControl.setValue(1);
      } else if (ratingControl && ratingControl.value > 100) {
        ratingControl.setValue(100);
      }
    }

  }

  addRatingCompany(event?: Event) {
    if (event) {
      event.preventDefault(); // Prevent default form behavior
      event.stopPropagation(); // Stop the event from bubbling up
    }

    let combined = this.searchForm.get('selectedRatingCompany')?.value + ':' + this.searchForm.get('minimumRating')?.value;
    this.selectedRatingCompanies.push(combined);
    console.log('showResulst before:', this.showResulst);
    this.showResulst = false; // Ensure it remains false
    console.log('showResulst after:', this.showResulst);
  }
  clearRating(rating: string) {
    this.selectedRatingCompanies = this.selectedRatingCompanies.filter((r) => r !== rating);
  }

  onPlatformChange(event: any) {
    const platform = event.target.value;
    if (event.target.checked) {
      this.selectedPlatforms.push(platform);
    } else {
      this.selectedPlatforms = this.selectedPlatforms.filter((p) => p !== platform);
    }
    console.log('Selected Platforms:', this.selectedPlatforms);
  }
  debugEvent(event: Event) {
    console.log('Event triggered:', event.type, 'on target:', event.target);
  }

  onSearch() {
    let commaSeparatedActors = this.selectedActor.join(',');
    let commaSeparatedDirectors = this.selectedDirectors.join(',');
    let commaSeparatedPlatforms = this.selectedPlatforms.join(',');
    let newMovie: MovieFilters = {
      MovieTitle: this.searchForm.get('title')?.value || undefined,
      ActorNames: commaSeparatedActors || undefined,
      DirectorNames: commaSeparatedDirectors || undefined,
      StreamingPlatforms: commaSeparatedPlatforms || undefined,
      Genres: this.selectedGenres.join(',') || undefined,
      RatingCompanies: this.selectedRatingCompanies.join(',') || undefined,
      DurationMins: this.searchForm.get('duration')?.value || undefined,
      MovieYear: this.searchForm.get('year')?.value || undefined
    }

    console.log('New Movie:', newMovie);
    this.movieService.getMoviesOffSearch(newMovie).subscribe((response) => {
      console.log('Movie Search Response:', response);
      this.movieList = response;
      this.showResulst = true;
    });


  }
  handleCloseMovie() {
    this.showResulst = false;
    this.selectedPlatforms = [];
  }
}