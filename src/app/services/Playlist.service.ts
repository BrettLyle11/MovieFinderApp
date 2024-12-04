import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreatePlaylist } from '../models/CreatePlaylist';
import { AddToPlaylist } from '../models/AddToPlaylist';
import { UpdatePlaylistTime } from '../models/UpdatePlaylistTime';

@Injectable({
        providedIn: 'root'
})
export class PlaylistService {
        private apiUrl = `https://localhost:44302/api/movies`;

        constructor(private http: HttpClient) { }

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
                        userID: 1,
                        playlistName: playlistName,
                        movieYear: movie.year,
                        movieName: movie.title
                };
                return this.http.post<void>('https://localhost:44302/api/movies/addMovieToPlaylist', addMovieToPlaylist);
        }

        updatePlaylistWatchTime(playlistName: string, duration: number): Observable<void> {
                let updatePlaylistTime: UpdatePlaylistTime = {
                        userID: 1,
                        playlistName: playlistName,
                        duration: duration
                };
                return this.http.post<void>('https://localhost:44302/api/movies/updatePlaylistTime', updatePlaylistTime);
        }
}