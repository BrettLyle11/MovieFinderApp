export interface MovieFilters {
    DurationMins?: number;                    // Duration in minutes (optional)
    MovieYear?: number;                       // Release year (optional)
    MovieTitle?: string;                      // Title or partial title (optional)
    ActorNames?: string;                      // Comma-separated actor names (optional)
    DirectorNames?: string;                   // Comma-separated director names (optional)
    StreamingPlatforms?: string;              // Comma-separated streaming platform names (optional)
    RatingCompanies?: string;                 // Comma-separated 'RatingCompany:MinScore' pairs (optional)
    Genres?: string;                          // Comma-separated genres (optional)
}