import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreatePlaylist } from '../models/CreatePlaylist';
import { AddToPlaylist } from '../models/AddToPlaylist';
import { UpdatePlaylistTime } from '../models/UpdatePlaylistTime';
import { PlaylistInfo } from '../models/PlaylistInfo';
import { MovieFinderUserService } from './MovieFinderUser.service';

@Injectable({
        providedIn: 'root'
})
export class PlaylistService {
        private apiUrl = `https://localhost:44302/api/movies`;
        public signedInUser: any = null;

        constructor(private http: HttpClient, private service: MovieFinderUserService) { 
                this.signedInUser =  this.service.getUser();
        }

        createPlaylist(name: string, userID: number): Observable<any> {
                let playlist: CreatePlaylist = {
                        name: name,
                        userID: userID
                };
                return this.http.post<void>('https://localhost:44302/api/movies/createPlaylist', playlist);
        }

        getPlaylists(userID: number): Observable<any[]> {
                return this.http.get<any[]>(`${this.apiUrl}/getPlaylists`, {
                        params: { userID: userID.toString() }
                });
        }

        addMovieToPlaylist(playlistName: string, movie: any): Observable<any> {
                let addMovieToPlaylist: AddToPlaylist = {
                        userID: this.signedInUser.id,
                        playlistName: playlistName,
                        movieYear: movie.year,
                        movieName: movie.title
                };
                return this.http.post<void>('https://localhost:44302/api/movies/addMovieToPlaylist', addMovieToPlaylist);
        }

        addMovieToPlaylist2(playlistName: string, myear: any, mname: any): Observable<any> {
                console.log(myear, mname);
                let addMovieToPlaylist: AddToPlaylist = {
                        userID: this.signedInUser.id,
                        playlistName: playlistName,
                        movieYear: myear,
                        movieName: mname
                };
                return this.http.post<void>('https://localhost:44302/api/movies/addMovieToPlaylist', addMovieToPlaylist);
        }

        updatePlaylistWatchTime(playlistName: string, duration: number): Observable<void> {
                let updatePlaylistTime: UpdatePlaylistTime = {
                        userID: this.signedInUser.id,
                        playlistName: playlistName,
                        duration: duration
                };
                return this.http.post<void>('https://localhost:44302/api/movies/updatePlaylistTime', updatePlaylistTime);
        }

        getPlaylistMovies(userID: number, playlistName: string): Observable<AddToPlaylist[]> {
                console.log(playlistName)
                return this.http.get<AddToPlaylist[]>('https://localhost:44302/api/movies/getPlaylistMovies', {
                        params: { userID: userID.toString(), playlistName: playlistName }
                });
        }

        getPlaylistMoviesWithDetails(userID: number, playlistName: string): Observable<any[]> {
                console.log(playlistName)
                return this.http.get<AddToPlaylist[]>('https://localhost:44302/api/movies/getMoviesInPlaylist', {
                        params: { userID: userID.toString(), playlistName: playlistName }
                });
        }

        deletePlaylist(userID: number, playlistName: string): Observable<void> {
                return this.http.delete<void>('https://localhost:44302/api/movies/deletePlaylist', {
                        params: { userID: userID.toString(), playlistName: playlistName }
                });
        }

        deletePlaylistMovies(userID: number, playlistName: string): Observable<void> {
                return this.http.delete<void>('https://localhost:44302/api/movies/deleteAllMoviesFromPlaylist', {
                        params: { userID: userID.toString(), playlistName: playlistName }
                });
        }
        
        // New method to remove a movie from a playlist
  removeMovieFromPlaylist(userID: number, playlistName: string, movieName: string, movieYear: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/removeMovieFromPlaylist`, {
          params: {
            userID: userID.toString(),
            playlistName: playlistName,
            movieName: movieName,
            movieYear: movieYear.toString()
          }
        });
      }
}