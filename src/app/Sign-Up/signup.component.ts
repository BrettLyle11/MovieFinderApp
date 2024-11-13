import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { min } from 'rxjs';
import { MovieFinderUserService } from '../services/MovieFinderUser.service';
import { NewUser } from '../models/NewUser';
import { Genre } from '../services/Genres.service';
import { Router } from '@angular/router';

interface SignupFormControls {
  email: FormControl<string | null>;
  username: FormControl<string | null>;
  password: FormControl<string | null>;
  genre: FormControl<string | null>;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup<SignupFormControls>;
  submitted = false;
  genreValues: string[] = [];

  constructor(private formBuilder: FormBuilder,
    private movieFinderUserService: MovieFinderUserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.signupForm = new FormGroup<SignupFormControls>({
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      genre: new FormControl('', [Validators.required]),
    });

    this.genreValues = Object.values(Genre);
  }

  // Getter for easy access to form fields
  get f() {
    return this.signupForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // Stop if the form is invalid
    if (this.signupForm.invalid) {
      return;
    }
    const user: NewUser = {
      email: this.signupForm.value.email ?? undefined,
      username: this.signupForm.value.username ?? undefined,
      password: this.signupForm.value.password ?? undefined,
      genre: this.signupForm.value.genre ?? undefined,
    }

    if(user.email === undefined || user.username === undefined || user.password === undefined || user.genre === undefined){
    this.signupForm.reset();
    }

    // Proceed with form submission logic
    this.movieFinderUserService.CreateUser(user).subscribe((response) => {
      console.log(response);
      // Check if the response indicates success
      if (response.message === 'Success') {
        // Navigate to the main page
        this.movieFinderUserService.setUser({
          id: response.Id,
          email: response.Email,
          username: response.username,
          genre: response.Genre,
        });
        
        this.router.navigate(['/main']);
      } else {
        // Handle other statuses if necessary
        console.error('Signup failed with status:', response.status);
      }
        },
        (error) => {
          // Handle errors here
          console.error('An error occurred during signup:', error);
          // Optionally display an error message to the user
           // Reset the form after successful submission
        this.signupForm.reset();
        this.submitted = false;
        });
    
       
      }
    }

    // Reset the form after successful submission

  