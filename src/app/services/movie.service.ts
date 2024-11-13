import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MovieFilters } from '../models/MovieFilters';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  constructor(private http:HttpClient) {
   }

   searchForDirectorLikeNames(directorName : string): Observable<any> {
    return this.http.post(`https://localhost:44302/api/movies/searchDirector/`+directorName,null);
    }

   searchForActorLikeNames(actorName: string): Observable<any> {
 

    return this.http.post(`https://localhost:44302/api/movies/searchActor/`+actorName,null);
   }
  
  getMoviesOffSearch(filters: MovieFilters): Observable<any> {
    
    return this.http.post('https://localhost:44302/api/movies/moviesByFilters', filters);
  }

  getAllRatingCompanies(): Observable<any> {
    return this.http.get('https://localhost:44302/api/movies/getAllRatingCompanies');
  }
}
