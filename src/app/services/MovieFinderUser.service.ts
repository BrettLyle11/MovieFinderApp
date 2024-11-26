import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NewUser } from '../models/NewUser';

@Injectable({
    providedIn: 'root',
})
export class MovieFinderUserService {
    

    private signedInUser: any = null; 

    private apiUrl = 'https://localhost:44302'; 

    setUser(user: any) {
        this.signedInUser = user;
      }
    
    getUser() {
    return this.signedInUser;
    }

    constructor(private http: HttpClient) {}

    CreateUser(user:NewUser): Observable<any> {
        return this.http.post(`${this.apiUrl}/api/movies/Sign-Up`, user);
    }

    LoginUser(user:NewUser): Observable<any> {
        return this.http.post(`${this.apiUrl}/api/movies/Login`, user);
    }


    // Add more methods as needed
}