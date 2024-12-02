import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { AdminService } from '../services/Admin.service';
import { Admin } from '../models/Admin';
import { Router } from '@angular/router';
import { SearchMovie } from '../models/SearchMovie';
import { Movie } from '../models/Movie'; 
import { MovieService } from '../services/movie.service';
import { Genre } from '../services/Genres.service';
import { AdminMovieUpdates } from '../models/AdminMovieUpdate';
import { UserWPsswDTO } from '../models/UserWPsswDTO';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-adminpage',
  templateUrl: './Adminpage.component.html',
  styleUrls: ['./Adminpage.component.css'],
})
export class AdminPageComponent implements OnInit {
  admin: Admin | undefined;
  currentDate: Date = new Date();

  isCreatingMovie: boolean = false;

  editingUser: boolean = false;
  userSearchString: string = '';
  showSuggestionsUsers: boolean = false;
  suggestedUsers: string[] = [];

  user: UserWPsswDTO | undefined = undefined;
  copyOfUser: UserWPsswDTO | undefined = undefined;

  userEditHistory: any[] = [];

  // Variables for managing movies
  searchCriteria: { name: string; year: number | undefined } = {
    name: '',
    year: undefined,
  };
  hasSearched: boolean = false;
  selectedTitle: string = '';
  selectedYear: number = 0;

  adminMovieUpdateHistory: AdminMovieUpdates[] = [];

  // Variables for adding new entities
  newGenre: string = '';
  newActor: string = '';
  newDirector: string = '';
  newStreamingService: string = '';
  newRatingCompany: string = '';
  newRatingScore: string = '';
  suggestedMovies: string[] = [];
  showSuggestionsMovies: boolean = false;

  movie: Movie | null | undefined; // Holds the movie data

  // Variables for tracking changes
  originalMovie: Movie | undefined;

  // Arrays for editing
  actorsArray: string[] = [];
  directorsArray: string[] = [];
  streamingServicesArray: string[] = [];
  genresArray: string[] = [];
  ratingsArray: { company: string; score: string }[] = [];
  productionCompaniesArray: string[] = [];

  // Popup visibility flags and other BS
  showAddProductionCompanyPopup: boolean = false;
  showAddActorPopup: boolean = false;
  showAddDirectorPopup: boolean = false;
  showAddStreamingServicePopup: boolean = false;
  showAddGenrePopup: boolean = false;
  showAddRatingPopup: boolean = false;
  suggestedActors: string[] = [];
  showSuggestionsActors: boolean = false;
  clickApplied: boolean = false;
  showSuggestionsDirectors: boolean = false;
  suggestedDirectors: string[] = [];
  suggestedProductionCompanies: string[] = []; // Example suggestions
  newProductionCompany: string = ''; // Input value
  showSuggestionsProductionCompanies: boolean = false;

 
  streamingPlatforms: string[] = ['Apple TV', 'Netflix', 'BritBox', 'Disney+', 'Crave', 'Curiosity Stream', 'Hotstar','Mubi','Paramount+','Pulto TV', 'Prime Video', 'Tubi', 'Zee5'];
  selectedPlatforms: string[] = [];

  genres: string[] = Object.values(Genre); 

  selectedGenres: string[] = [];
  suggestedRatingCompanies: any;
  selectedRatingCompany: string | null = null; // Selected rating company name
  isAddingNewCompany: boolean = false; // Flag to toggle adding a new company
  newRatingScale: any;


  newMovieTitle: string = '';
  newMovieYear: number = 0;
  newMovieDuration: number = 0;
  newMovieDescription: string = '';
  newMovieImage: string = '';


  constructor(
    private adminService: AdminService,
    private router: Router,
    private elementRef: ElementRef,
    private movieService: MovieService
  ) {}

  ngOnInit(): void {
    this.movie = null;
    this.admin = this.adminService.getUser();

    if (this.admin === undefined) {
      // Navigate to the login page if no admin user is found
      this.router.navigate(['/login']);
    } else {
      // Admin user is logged in; proceed with any additional initialization
      console.log('Logged in as:', this.admin);
    }

    this.movieService.getAllRatingCompanies().subscribe((response) => {
      console.log('Rating companies:', response);
      this.suggestedRatingCompanies = response;
    });
    
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;

    if (targetElement && !this.elementRef.nativeElement.contains(targetElement)) {
      this.showSuggestionsMovies = false;
    }
  }

  get selectedRatingScale(): string {
    const company = this.suggestedRatingCompanies.find(
      (c: { ratingCompanyName: string | null; }) => c.ratingCompanyName === this.selectedRatingCompany
    );
    return company ? company.ratingScale : this.newRatingScale;
  }

  // Validate score input based on the selected rating scale
  validateScoreInput(): boolean {
    if (!this.selectedRatingScale) {
      return true; // No validation if no scale is selected
    }
    const [min, max] = this.selectedRatingScale.split('-').map(Number);
    const score = Number(this.newRatingScore);
    return score >= min && score <= max;
  }

  // Add a rating
  addRating(): void {
    if (this.isAddingNewCompany) {
      if (!this.newRatingCompany.trim()) {
        alert('Please provide a name for the new rating company.');
        return;
      }

      if (!this.newRatingScale) {
        alert('Please select a scale for the new rating company.');
        return;
      }
    }

    if (!this.validateScoreInput()) {
      alert(
        `Score must be within the scale of ${this.selectedRatingScale} for the selected rating company.`
      );
      return;
    }

    if (this.selectedRatingCompany) {
      this.ratingsArray.push({ company: this.selectedRatingCompany, score: this.newRatingScore });
    } else {
      alert('Please select a rating company.');
    }
    

    // Clear inputs and close popup
    this.resetRatingInputs();
    this.showAddRatingPopup = false;
  }

  // Reset inputs
  resetRatingInputs(): void {
    this.newRatingCompany = '';
    this.newRatingScale = '';
    this.newRatingScore = '';
    this.selectedRatingCompany = null;
    this.isAddingNewCompany = false;
  }


  toggleGenreSelection(genre: string): void {
    if (this.selectedGenres.includes(genre)) {
      // Remove if already selected
      this.selectedGenres = this.selectedGenres.filter((g) => g !== genre);
    } else {
      // Add if not selected
      this.selectedGenres.push(genre);
    }
    console.log('Genres remain unchanged:', this.genresArray);
  }

  // Confirm selected genres and close popup
  confirmGenres(): void {
    console.log('Selected genres:', this.selectedGenres);
    this.genresArray = JSON.parse(JSON.stringify(this.selectedGenres)); // Update the main genres array
    console.log('Genres remain unchanged:', this.genresArray);
    this.showAddGenrePopup = false;
  }

  // Cancel genre editing and close popup
  cancelGenreEdit(): void {
    console.log('Genres remain unchanged:', this.genresArray);
    this.selectedGenres = JSON.parse(JSON.stringify(this.genresArray));
    this.showAddGenrePopup = false;
  }

  togglePlatformSelection(platform: string): void {
    if (this.selectedPlatforms.includes(platform)) {
      // Remove if already selected
      this.selectedPlatforms = this.selectedPlatforms.filter(
        (p) => p !== platform
      );
    } else {
      // Add if not selected
      this.selectedPlatforms.push(platform);
    }
  }

  // Confirm selected platforms and close popup
  confirmPlatforms(): void {
    console.log('Selected platforms:', this.selectedPlatforms);
    this.streamingServicesArray = JSON.parse(JSON.stringify(this.selectedPlatforms));
    this.showAddStreamingServicePopup = false;
  }

  cancelPlatformEdit(): void{
    console.log('Selected platforms:', this.streamingServicesArray);
    this.selectedPlatforms = JSON.parse(JSON.stringify(this.streamingServicesArray));
    this.showAddStreamingServicePopup = false;
  }

  onProductionCompanyChange(value: string): void {
    this.showSuggestionsProductionCompanies = true;
    this.newProductionCompany = value;
    this.movieService.getProductionCompanies(value).subscribe((response) => {
      console.log('Production company suggestions:', response);
      this.suggestedProductionCompanies = response;
    });
  }

  // Add a production company
  addProductionCompany(): void {
    if (this.newProductionCompany.trim() && !this.productionCompaniesArray.includes(this.newProductionCompany)) {
      this.productionCompaniesArray.push(this.newProductionCompany.trim());
    }
    this.newProductionCompany = ''; // Clear input
    this.showSuggestionsProductionCompanies = false; 
    this.showAddProductionCompanyPopup = false; // Close pop-up
  }

  // Select a production company from suggestions
  selectProductionCompany(company: string): void {
    this.newProductionCompany = company;
    this.showSuggestionsProductionCompanies = false; // Hide suggestions
  }

  // Cancel adding a production company
  cancelAddProductionCompany(): void {
    this.newProductionCompany = ''; // Clear input
    
    this.showAddProductionCompanyPopup = false; // Close pop-up
  }

  onNameChange(newValue: string): void {
    if (newValue) {
      this.adminService.searchMovieNames(newValue).subscribe((data) => {
        console.log('Suggested movies:', data);
        this.suggestedMovies = data || [];
        this.showSuggestionsMovies = true;
      });
    } else {
      this.suggestedMovies = [];
      this.showSuggestionsMovies = false;
    }
  }

  // Function to search movies
  searchMovies(): void {
    this.hasSearched = true;

    // Prepare the search criteria
    const searchCriteria: SearchMovie = {
      name: this.selectedTitle,
      year: this.selectedYear,
    };

    this.adminService.searchMovie(searchCriteria).subscribe((data) => {
      // Handle search results
      this.movie = data;
      // Make a deep copy of the original movie data to track changes
      this.originalMovie = JSON.parse(JSON.stringify(data));

      // Split comma-separated strings into arrays
      this.actorsArray = this.movie?.actors ? this.movie.actors.split(',').map(s => s.trim()) : [];
      this.directorsArray = this.movie?.directors ? this.movie.directors.split(',').map(s => s.trim()) : [];
      this.streamingServicesArray = this.movie?.streamingServices ? this.movie.streamingServices.split(',').map(s => s.trim()) : [];
      this.genresArray = this.movie?.genres ? this.movie.genres.split(',').map(s => s.trim()) : [];
      this.ratingsArray = this.movie?.ratingsAndScores
        ? this.movie.ratingsAndScores.split(',').map((item) => {
            const [company, score] = item.split(':');
            return { company: company.trim(), score: score.trim() };
          })
        : [];
      this.productionCompaniesArray = this.movie?.productionCompanies ? this.movie.productionCompanies.split(',').map(s => s.trim()) : [];

      console.log('Search results:', this.movie);
      this.selectedPlatforms = JSON.parse(JSON.stringify(this.streamingServicesArray));
      this.selectedGenres = JSON.parse(JSON.stringify(this.genresArray));
      console.log('Production companies:', this.productionCompaniesArray);
    });

    this.adminService.getMovieUpdateHistory(searchCriteria).subscribe((response) => {
      console.log('Update history:', response);
      this.adminMovieUpdateHistory = response;
    });
  }

  

  onUserNameChange(value: string): void {
    if (value) {
      this.adminService.searchUserNames(value).subscribe((data) => {
        console.log('Suggested users:', data);
        this.suggestedUsers = data ;
        this.showSuggestionsUsers = true;
      });
    } else {
      this.suggestedUsers = [];
      this.showSuggestionsUsers = false;
    }

  }

  preventClose(event: MouseEvent): void {
    event.stopPropagation();
  }

  selectMovieSuggestion(movie: string): void {
    console.log('Selected movie:', movie);
  
    // Find the position of the last colon in the string
    const lastColonIndex = movie.lastIndexOf(':');
  
    if (lastColonIndex !== -1) {
      // Extract the title and year based on the last colon position
      this.selectedTitle = movie.substring(0, lastColonIndex).trim();
      const yearString = movie.substring(lastColonIndex + 1).trim();
      this.selectedYear = Number(yearString);
    } else {
      // Handle the case where no colon is found
      this.selectedTitle = movie.trim();
      this.selectedYear = 0; // or set to undefined or handle accordingly
    }
  
    this.showSuggestionsMovies = false;
    this.searchCriteria.name = this.selectedTitle;
  
    // Optionally trigger a search
    // this.searchMovies();
  }
  selectUserSuggestion(user: string): void {
    this.userSearchString = user;
    this.showSuggestionsUsers = false;
    
  }
  searchUserOffEmail(){
    this.adminService.getUserInfo(this.userSearchString).subscribe((data) => {
      console.log('User info:', data);2
      this.user = data;
      this.copyOfUser = JSON.parse(JSON.stringify(data));
      this.adminService.getUserEditHistory(this.user?.id!).subscribe((response: any) => {
        
        this.userEditHistory = response;
        console.log('User edit history:', this.userEditHistory);

      });
    });
  }

  updateUser(): void {
    if(JSON.parse(JSON.stringify(this.copyOfUser)) === JSON.parse(JSON.stringify(this.user))){
      alert('No changes detected.');
      return;
    }
    console.log('Updating user:', this.user);
    this.adminService.updateUserInfo(this.user!, this.admin!).subscribe((response) => {
      console.log('Update response:', response);
      alert('User updated successfully.');
      this.searchUserOffEmail();
    },
    (error) => {
      alert('Error updating user. Please try again later.');
      console.error('Error updating user:', error);
    });
  }
  cancelUser(): void {
    this.user = undefined;
    this.copyOfUser = undefined;
    this.userEditHistory = [];
    this.userSearchString = '';
    this.showSuggestionsUsers = false;
  
  }
  resetUser(): void {
    this.user = JSON.parse(JSON.stringify(this.copyOfUser));
  }

  cancelMovie(): void {
    this.hasSearched = false;
    this.isCreatingMovie = false;
    this.unselectMovie();
  }

  unselectMovie(): void {
    this.selectedTitle = '';
    this.selectedYear = 0;
    this.searchCriteria.name = '';
    this.suggestedMovies = [];
    this.showSuggestionsMovies = false;
    this.movie = undefined;
    this.originalMovie = undefined;
    this.actorsArray = [];
    this.directorsArray = [];
    this.streamingServicesArray = [];
    this.genresArray = [];
    this.ratingsArray = [];
  }

  // Logout function (if applicable)
  logout(): void {
    this.adminService.clearUser();
    this.router.navigate(['/login']);
  }

  selectActor(actor: string): void {
    this.newActor = actor;
    this.showSuggestionsActors = false;
    this.clickApplied = true;
    console.log('Selected actor:', actor);
  }

  // Functions to manage actors
  removeActor(index: number): void {
    this.actorsArray.splice(index, 1);
  }

  addActor(): void {
    if (this.newActor) {
      this.actorsArray.push(this.newActor.trim());
      this.newActor = '';
      this.showAddActorPopup = false;
    }
  }

  // Functions to manage directors
  removeDirector(index: number): void {
    this.directorsArray.splice(index, 1);
  }

  removeProdCompany(index: number): void {
    this.productionCompaniesArray.splice(index, 1);
  }


  addDirector(): void {
    if (this.newDirector) {
      this.directorsArray.push(this.newDirector.trim());
      this.newDirector = '';
      this.showAddDirectorPopup = false;
    }
  }

  // Functions to manage streaming services
  removeStreamingService(index: number): void {
    this.streamingServicesArray.splice(index, 1);
  }

  addStreamingService(): void {
    if (this.newStreamingService) {
      this.streamingServicesArray.push(this.newStreamingService.trim());
      this.newStreamingService = '';
      this.showAddStreamingServicePopup = false;
    }
  }


  // Functions to manage ratings
  removeRating(index: number): void {
    this.ratingsArray.splice(index, 1);
  }



  onActorChange(actorName: any) {
    this.movieService.searchForActorLikeNames(actorName).subscribe((response) => {
    console.log('Actor search response:', response);
    this.suggestedActors = response;
    this.showSuggestionsActors = true;
    
    });
    if(this.clickApplied){
      this.clickApplied = false;
      this.showSuggestionsActors = false;
      console.log('No more window');
    }
  }

  onDirectorChange(directorName: any) {
    this.movieService.searchForDirectorLikeNames(directorName).subscribe((response) => {
    console.log('Director search response:', response);
    this.suggestedDirectors = response;
    this.showSuggestionsDirectors = true;
    });
    if(this.clickApplied){
      this.clickApplied = false;
      this.showSuggestionsDirectors = false;
      console.log('No more window');
    }
  }

  selectDirector(director: string) {
    this.newDirector = director;
    this.showSuggestionsDirectors = false;
    this.clickApplied = true;
  }

  addNewRatingCompany(){
    

    var newRatingCompantRequest =
  {
    ratingCompanyName: this.newRatingCompany,
    scale: this.newRatingScale,
  }

  this.adminService.addRatingCompanyWithScale(newRatingCompantRequest).subscribe((response) => {
    console.log('New rating company added:', response);
    this.movieService.getAllRatingCompanies().subscribe((response) => {
      console.log('Rating companies:', response);
      this.suggestedRatingCompanies = response;
      this.newRatingCompany = '';
      this.newRatingScale = '';
    });
  });
  this.isAddingNewCompany = false;
  }

  

  // Function to save the edited movie data
  saveMovie(): void {
    if (this.movie && this.originalMovie) {
      // Prepare the data to be sent to the API
      const editedMovie: Movie = {
        title: this.movie.title,
        year: this.movie.year,
        durationMins: this.movie.durationMins,
        description: this.movie.description,
        image: this.movie.image,
        actors: this.actorsArray.join(','),
        directors: this.directorsArray.join(','),
        streamingServices: this.streamingServicesArray.join(','),
        genres: this.genresArray.join(','),
        ratingsAndScores: this.ratingsArray.map(r => `${r.company}:${r.score}`).join(','),
        productionCompanies: this.productionCompaniesArray.join(','),
      };
  
      const fieldsToCheck: (keyof Movie)[] = ['title', 'year', 'durationMins', 'description', 'image'];
  
      const dto = {
        originalTitle: this.originalMovie.title,
        originalYear: this.originalMovie.year,
        updatedFields: {} as Partial<Record<keyof Movie, string | number>>,
        changes: {
          added: {} as Partial<Record<keyof Movie, string[]>>,
          removed: {} as Partial<Record<keyof Movie, string[]>>,
        },
        adminUsername : this.admin?.username,
        adminId : this.admin?.adminID
      };
  
      // Check simple fields for changes
      fieldsToCheck.forEach((field) => {
        if (this.movie![field] !== this.originalMovie![field]) {
          dto.updatedFields[field] = this.movie![field];
        }
      });
  
      // Helper function for array comparison
      const getAddedAndRemoved = (original: string[], updated: string[]) => {
        const added = updated.filter(item => !original.includes(item));
        const removed = original.filter(item => !updated.includes(item));
        return { added, removed };
      };
  
      // Compare actors
      const actorsChanges = getAddedAndRemoved(
        this.originalMovie.actors ? this.originalMovie.actors.split(',').map(s => s.trim()) : [],
        this.actorsArray
      );
      if (actorsChanges.added.length || actorsChanges.removed.length) {
        dto.changes.added['actors'] = actorsChanges.added;
        dto.changes.removed['actors'] = actorsChanges.removed;
      }
  
      // Compare directors
      const directorsChanges = getAddedAndRemoved(
        this.originalMovie.directors ? this.originalMovie.directors.split(',').map(s => s.trim()) : [],
        this.directorsArray
      );
      if (directorsChanges.added.length || directorsChanges.removed.length) {
        dto.changes.added['directors'] = directorsChanges.added;
        dto.changes.removed['directors'] = directorsChanges.removed;
      }
  
      // Compare streaming services
      const streamingChanges = getAddedAndRemoved(
        this.originalMovie.streamingServices ? this.originalMovie.streamingServices.split(',').map(s => s.trim()) : [],
        this.streamingServicesArray
      );
      if (streamingChanges.added.length || streamingChanges.removed.length) {
        dto.changes.added['streamingServices'] = streamingChanges.added;
        dto.changes.removed['streamingServices'] = streamingChanges.removed;
      }
  
      // Compare genres
      const genresChanges = getAddedAndRemoved(
        this.originalMovie.genres ? this.originalMovie.genres.split(',').map(s => s.trim()) : [],
        this.genresArray
      );
      if (genresChanges.added.length || genresChanges.removed.length) {
        dto.changes.added['genres'] = genresChanges.added;
        dto.changes.removed['genres'] = genresChanges.removed;
      }
  
      // Compare ratings and scores
      const originalRatings = this.originalMovie.ratingsAndScores
        ? this.originalMovie.ratingsAndScores.split(',').map((item) => {
            const [company, score] = item.split(':');
            return { company: company.trim(), score: score.trim() };
          })
        : [];
      const updatedRatings = this.ratingsArray;
  
      const ratingsChanges = {
        added: updatedRatings.filter(
          ur => !originalRatings.some(or => or.company === ur.company && or.score === ur.score)
        ),
        removed: originalRatings.filter(
          or => !updatedRatings.some(ur => ur.company === or.company && ur.score === or.score)
        ),
      };
  
      if (ratingsChanges.added.length || ratingsChanges.removed.length) {
        dto.changes.added['ratingsAndScores'] = ratingsChanges.added.map(r => `${r.company}:${r.score}`);
        dto.changes.removed['ratingsAndScores'] = ratingsChanges.removed.map(r => `${r.company}:${r.score}`);
      }
  
      // Compare production companies
      const productionChanges = getAddedAndRemoved(
        this.originalMovie.productionCompanies ? this.originalMovie.productionCompanies.split(',').map(s => s.trim()) : [],
        this.productionCompaniesArray
      );
      if (productionChanges.added.length || productionChanges.removed.length) {
        dto.changes.added['productionCompanies'] = productionChanges.added;
        dto.changes.removed['productionCompanies'] = productionChanges.removed;
      }
  
      // Log the DTO or send it to the API
      console.log('DTO ready to send to API:', dto);

      this.adminService.updateMovie(dto).subscribe((response) => {
        console.log('Update response:', response);
        this.searchMovies();
        
      });
    }
  }

  toggleState(): void {
    this.isCreatingMovie = !this.isCreatingMovie;
  }

 
createMovie(): void {
  // Validate required fields
  if (!this.newMovieTitle.trim() || this.newMovieYear <= 0 ) {
    alert('Please fill in all required fields.');
    return;
  }

  // Construct the movie object to send to the API
  const newMovie = {
    title: this.newMovieTitle.trim(),
    year: this.newMovieYear,
    durationMins: this.newMovieDuration,
    description: this.newMovieDescription.trim(),
    image: this.newMovieImage.trim(),
    actors: this.actorsArray.join(','), // Comma-separated actors
    directors: this.directorsArray.join(','), // Comma-separated directors
    streamingServices: this.streamingServicesArray.join(','), // Comma-separated streaming services
    genres: this.genresArray.join(','), // Comma-separated genres
    ratingsAndScores: this.ratingsArray.map(r => `${r.company}:${r.score}`).join(','), // Comma-separated ratings
    productionCompanies: this.productionCompaniesArray.join(',') // Comma-separated production companies
  };

  console.log('Creating movie with data:', newMovie);

  // Send the data to the backend API
  this.adminService.createMovie(newMovie).subscribe((response) => {
    this.cancelMovie();
  },
  (error) => {
    alert('Error creating movie. Please try again later. ' + error.error.error);
    console.error('Error creating movie:', error);
  });
}
  
}