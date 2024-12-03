import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreatePlaylist } from '../models/CreatePlaylist';

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
                return this.http.post('https://localhost:44302/api/movies/createPlaylist', playlist);
        }

        getPlaylists(userID: number): Observable<any[]> {
                return this.http.get<any[]>(`${this.apiUrl}/getPlaylists`, {
                        params: { userID: userID.toString() }
                });
        }

        addMovieToPlaylist(playlistId: number, movie: any): Observable<any> {
                return this.http.post(`${this.apiUrl}/addMovieToPlaylist`, { playlistId, movie });
              }
}