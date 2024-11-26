// login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MovieFinderUserService } from '../services/MovieFinderUser.service';
import { NewUser } from '../models/NewUser';
import { Router } from '@angular/router';
import { Admin } from '../models/Admin';
import { AdminService } from '../services/Admin.service';

interface LoginViewinterface {
    username: FormControl<string | null>;
    password: FormControl<string | null>;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm!: FormGroup<LoginViewinterface>;

  constructor(private fb: FormBuilder,
    private movieFinderUserService: MovieFinderUserService,
    private router: Router,
    private admin: AdminService
  ) {
    this.createForm();
  }
  ngOnInit() {
    
  }

  // Initialize the form using FormBuilder
  createForm() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  // Handle form submission
  onSubmit() {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
        const newUser: NewUser = {
            username: loginData.username ?? undefined,
            password: loginData.password ?? undefined,
            genre: undefined,
            email: undefined
        };

        this.movieFinderUserService.LoginUser(newUser).subscribe((data) => {
        if(data.message === "success"){
          if(data.user === undefined){
            this.admin.setUser(data.admin);
            this.router.navigate(['/admin']);
            return;
          }
          this.movieFinderUserService.setUser(data.user);
            this.router.navigate(['/main']);

        }
        else{
          alert("Invalid Username or Password");
        }
        });
      console.log('Login Data:', loginData);
      // Implement your authentication logic here
    } else {
      // Mark all controls as touched to trigger validation messages
      this.loginForm.markAllAsTouched();
    }
  }
}