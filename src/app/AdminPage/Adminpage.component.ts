import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { AdminService } from '../services/Admin.service';
import { Admin } from '../models/Admin';
import { Router } from '@angular/router';
import { SearchMovie } from '../models/SearchMovie';
import { Movie } from '../models/Movie'; // Import the Movie interface
import { MovieService } from '../services/movie.service';

@Component({
  selector: 'app-adminpage',
  templateUrl: './Adminpage.component.html',
  styleUrls: ['./Adminpage.component.css'],
})
export class AdminPageComponent implements OnInit {
  admin: Admin | undefined;
  currentDate: Date = new Date();

  // Variables for managing movies
  searchCriteria: { name: string; year: number | undefined } = {
    name: '',
    year: undefined,
  };
  hasSearched: boolean = false;
  selectedTitle: string = '';
  selectedYear: number = 0;

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

  // Popup visibility flags and other BS
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
 
  streamingPlatforms: string[] = ['Apple TV', 'Netflix', 'BritBox', 'Disney+', 'Crave', 'Curiosity Stream', 'Hotstar','Mubi','Paramount+','Pulto TV', 'Prime Video', 'Tubi', 'Zee5'];
  selectedPlatforms: string[] = [];

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
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;

    if (targetElement && !this.elementRef.nativeElement.contains(targetElement)) {
      this.showSuggestionsMovies = false;
    }
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

      console.log('Search results:', this.movie);
      this.streamingPlatforms = this.streamingPlatforms
    });
  }

  preventClose(event: MouseEvent): void {
    event.stopPropagation();
  }

  selectMovieSuggestion(movie: string): void {
    console.log('Selected movie:', movie);
    const [title, year] = movie.split(':');
    this.selectedTitle = title.trim();
    this.selectedYear = Number(year.trim());
    this.showSuggestionsMovies = false;
    this.searchCriteria.name = this.selectedTitle;
    // Optionally trigger a search
    // this.searchMovies();
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

  // Functions to manage genres
  removeGenre(index: number): void {
    this.genresArray.splice(index, 1);
  }

  addGenre(): void {
    if (this.newGenre) {
      this.genresArray.push(this.newGenre.trim());
      this.newGenre = '';
      this.showAddGenrePopup = false;
    }
  }

  // Functions to manage ratings
  removeRating(index: number): void {
    this.ratingsArray.splice(index, 1);
  }

  addRating(): void {
    if (this.newRatingCompany && this.newRatingScore) {
      this.ratingsArray.push({
        company: this.newRatingCompany.trim(),
        score: this.newRatingScore.trim(),
      });
      this.newRatingCompany = '';
      this.newRatingScore = '';
      this.showAddRatingPopup = false;
    }
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

  

  // Function to save the edited movie data
  saveMovie(): void {
    if (this.movie && this.originalMovie) {
      // Prepare the data to be sent to the API
      // Combine arrays back into comma-separated strings
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
      };

      const fieldsToCheck: (keyof Movie)[] = ['title', 'year', 'durationMins', 'description', 'image'];

      const dto = {
        originalTitle: this.originalMovie.title,
        originalYear: this.originalMovie.year,
        updatedFields: {} as Partial<Record<keyof Movie, string | number>>, // Define type
      };

      fieldsToCheck.forEach((field) => {
        if (this.movie![field] !== this.originalMovie![field]) {
          dto.updatedFields[field] = this.movie![field]; // Safely assign updated value
        }
      });

      // Check for changes in string fields (arrays as comma-separated strings)
      if (editedMovie.actors !== this.originalMovie.actors) {
        dto.updatedFields['actors'] = editedMovie.actors;
      }
      if (editedMovie.directors !== this.originalMovie.directors) {
        dto.updatedFields['directors'] = editedMovie.directors;
      }
      if (editedMovie.streamingServices !== this.originalMovie.streamingServices) {
        dto.updatedFields['streamingServices'] = editedMovie.streamingServices;
      }
      if (editedMovie.genres !== this.originalMovie.genres) {
        dto.updatedFields['genres'] = editedMovie.genres;
      }
      if (editedMovie.ratingsAndScores !== this.originalMovie.ratingsAndScores) {
        dto.updatedFields['ratingsAndScores'] = editedMovie.ratingsAndScores;
      }

      // Currently, the save function does nothing
      // You can add the code to send 'dto' to the API here

      console.log('DTO ready to send to API:', dto);
    }
  }
}