import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MovieFinderUserService } from './MovieFinderUser.service';
import { AddToWatchHistory } from '../models/AddToWatchHistory';

@Injectable({
        providedIn: 'root'
})
export class WatchHistoryService {
        private apiUrl = `https://localhost:44302/api/movies`;
        public signedInUser: any = null;

        constructor(private http: HttpClient, private service: MovieFinderUserService) { 
                this.signedInUser =  this.service.getUser();
        }

        addMovieToWatchHistory(movie: any, finished: boolean): Observable<any> {
                let addMovieToWatchHistory: AddToWatchHistory = {
                        userID: this.signedInUser.id,
                        movieYear: movie.year,
                        movieName: movie.title,
                        didFinish: finished,
                };
                console.log(addMovieToWatchHistory)
                return this.http.post<void>('https://localhost:44302/api/movies/addMovieToWatchHistory', addMovieToWatchHistory);
        }
        
        getWatchHistory(userID: number): Observable<any[]> {
                return this.http.get<any[]>(`${this.apiUrl}/getWatchHistory`, {
                        params: { userID: userID.toString() }
                });
        }

        removeMovieFromWatchHistory(userID: number, movieName: string, movieYear: number): Observable<void> {
                return this.http.delete<void>(`${this.apiUrl}/removeMovieFromWatchHistory`, {
                  params: {
                    userID: userID.toString(),
                    movieName: movieName,
                    movieYear: movieYear.toString()
                  }
                });
              }
}