import { Injectable } from "@angular/core";
import { Admin } from "../models/Admin";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { SearchMovie } from "../models/SearchMovie";
import { Movie } from "../models/Movie";
import { UserWPsswDTO } from "../models/UserWPsswDTO";

@Injectable({
    providedIn: 'root',
})
export class AdminService {
    private signedInUser: Admin | undefined;

    private apiUrl = 'https://localhost:44302'; 
   

    constructor(private http: HttpClient) {
        // On service initialization, attempt to retrieve the admin user from localStorage
        const adminData = localStorage.getItem('admin');
        if (adminData) {
            this.signedInUser = JSON.parse(adminData) as Admin;
        }
    }

    searchMovie(mockMovie: SearchMovie): Observable<any> {
        return this.http.post(this.apiUrl + '/api/movies/searchMovieTitleAndYear',mockMovie);
    }

    searchMovieNames(name: String): Observable<any> {
        return this.http.post('https://localhost:44302/api/movies/searchMovieName/'+name,null);
    }

    setUser(user: Admin) {
        this.signedInUser = user;
        // Store the admin user data in localStorage
        localStorage.setItem('admin', JSON.stringify(user));
    }

    updateMovie(movie: any): Observable<any> {
        return this.http.post('https://localhost:44302/api/movies/update', movie);
    }

    getMovieUpdateHistory(movie : SearchMovie): Observable<any> {
        return this.http.post('https://localhost:44302/api/movies/GrabUpdateHistory', movie);
    }

    addRatingCompanyWithScale(ratingCompany: any): Observable<any> {
        return this.http.post('https://localhost:44302/api/movies/NewRatingScale', ratingCompany);
    }

    getUser(): Admin | undefined {
        return this.signedInUser;
    }

    clearUser() {
        this.signedInUser = undefined;
        localStorage.removeItem('admin');
    }

    createMovie(movie: Movie): Observable<any> {
        return this.http.post('https://localhost:44302/api/movies/createMovie', movie);
    }

    searchUserNames(name: String): Observable<any> {
        return this.http.post('https://localhost:44302/api/movies/searchUsers/'+name, null);
    }

    getUserInfo(username: String): Observable<any> {
        return this.http.post('https://localhost:44302/api/movies/getUser/'+username, null);
    }
    
    updateUserInfo(user: UserWPsswDTO, admin: Admin): Observable<any> {
        // Prepare query parameters for the `Admin` object
        let params = new HttpParams();
        if (admin.adminID !== undefined) {
            params = params.set('adminID', admin.adminID.toString());
        }
        if (admin.username) {
            params = params.set('username', admin.username);
        }
    
        // Make the HTTP POST request with the User object in the body and Admin in the query string
        return this.http.post('https://localhost:44302/api/movies/updateUser', user, { params });
    }

    getUserEditHistory(username: number): Observable<any> {
        return this.http.get('https://localhost:44302/api/movies/userUpdateHistory/'+username);
    }

    // Add more methods as needed
}