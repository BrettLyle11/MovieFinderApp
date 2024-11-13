import { Component, OnInit } from '@angular/core';
import { MovieService } from '../services/movie.service';
import { MovieFilters } from '../models/MovieFilters';
import { Router } from '@angular/router';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  constructor(private movieService: MovieService, private router: Router) {}
  images = [
    '/assets/Inception.jpg',
    '/assets/Jaws.jpg',
    '/assets/Space Odyssey.jpg'
  ];
  ngOnInit(): void {
    
  }

  signUpCLick(){
    console.log("Sign Up Clicked");
    const movie:MovieFilters = {
        Genres: 'Action,Horror'
        };
        console.log(movie);
    // this.movieService.getMoviesOffSearch(movie).subscribe((data) => {
    //     console.log(data);
    // });
    this.router.navigate(['/signup']);
  }

  loginClick(){
    console.log("Login Clicked");
    this.router.navigate(['/login']);
  }
}