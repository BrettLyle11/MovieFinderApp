import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MovieFinderUserService } from '../services/MovieFinderUser.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MovieService } from '../services/movie.service';
import { MovieFilters } from '../models/MovieFilters';
import { Genre } from '../services/Genres.service';
import { Movie } from '../models/Movie';

@Component({
  selector: 'app-main-page',
  templateUrl: './UserPage.component.html',
  styleUrls: ['./UserPage.component.css'],
})
export class UserPageComponent implements OnInit {
  playlists: any[] = []; // Replace 'any' with your playlist model
  searchForm: FormGroup;
  streamingPlatforms: string[] = ['Apple TV', 'Netflix', 'BritBox', 'Disney+', 'Crave', 'Curiosity Stream', 'Hotstar','Mubi','Paramount+','Pulto TV', 'Prime Video', 'Tubi', 'Zee5'];
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

  constructor(private fb: FormBuilder,private movieService: MovieService, private router: Router, private service: MovieFinderUserService) {
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
    this.signedInUser =  this.service.getUser();
    this.loadPlaylists();
    this.genres = Object.values(Genre);

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
    // Fetch the user's playlists from the server or local storage
 
  }

  goToWatchHistory() {
    // Navigate to the watch history page
    this.router.navigate(['/watch-history']);
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
 
    if(range ==='1-10'){
    const ratingControl = this.searchForm.get('minimumRating');
    if (ratingControl && ratingControl.value < 1) {
      ratingControl.setValue(1);
    } else if (ratingControl && ratingControl.value > 10) {
      ratingControl.setValue(10);
    }
  }
  else if(range === '1-100'){
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
      MovieTitle : this.searchForm.get('title')?.value || undefined,
      ActorNames : commaSeparatedActors || undefined,
      DirectorNames : commaSeparatedDirectors || undefined,
      StreamingPlatforms : commaSeparatedPlatforms || undefined,
      Genres : this.selectedGenres.join(',') || undefined,
      RatingCompanies : this.selectedRatingCompanies.join(',') || undefined,
      DurationMins : this.searchForm.get('duration')?.value || undefined,
      MovieYear : this.searchForm.get('year')?.value || undefined
    } 

    console.log('New Movie:', newMovie);
    this.movieService.getMoviesOffSearch(newMovie).subscribe((response) => {
      console.log('Movie Search Response:', response);
      this.movieList = response;
      this.showResulst = true;
    });

    
  }
  handleCloseMovie(){
    this.showResulst = false;
    this.selectedPlatforms = [];
  }
}