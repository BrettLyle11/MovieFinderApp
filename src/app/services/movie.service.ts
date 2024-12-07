import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MovieFilters } from '../models/MovieFilters';
import { Observable } from 'rxjs';
import { MovieFinderUserService } from './MovieFinderUser.service';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  public signedInUser: any = null;
  constructor(private http:HttpClient, private service: MovieFinderUserService) {
    this.signedInUser =  this.service.getUser();
   }

   searchForDirectorLikeNames(directorName : string): Observable<any> {
    return this.http.post(`https://localhost:44302/api/movies/searchDirector/`+directorName,null);
    }

   searchForActorLikeNames(actorName: string): Observable<any> {
 

    return this.http.post(`https://localhost:44302/api/movies/searchActor/`+actorName,null);
   }
  
  // Just in case, I kept the old function
  // getMoviesOffSearch(filters: MovieFilters): Observable<any> {
    
  //   return this.http.post('https://localhost:44302/api/movies/moviesByFilters', filters);
  // }

  getMoviesOffSearch(filters: MovieFilters): Observable<any> {
    const url = `https://localhost:44302/api/movies/moviesByFilters`;
    const params = new HttpParams().set('userId', this.signedInUser.id.toString());

    return this.http.post<any>(url, filters, { params });
  }

  getAllRatingCompanies(): Observable<any> {
    return this.http.get('https://localhost:44302/api/movies/getAllRatingCompanies');
  }

  getProductionCompanies(companyName: string): Observable<any> {
    console.log(companyName);
    return this.http.post('https://localhost:44302/api/movies/GetSuggestProductionCompanies/'+ companyName,null);
  }
}
