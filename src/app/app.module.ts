import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app.routes';
import { AppComponent } from './app.component';
import { MainComponent } from './mainPage/main.component';
import { MovieService } from './services/movie.service';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from './Sign-Up/signup.component';
import { MovieFinderUserService } from './services/MovieFinderUser.service';
import { LoginComponent } from './Login/login.component';
import { UserPageComponent } from './UserPage/UserPage.component';
import { ViewMovieComponent } from './View-Movie/ViewMovie.component';
import { AdminPageComponent } from './AdminPage/Adminpage.component';
import { AdminService } from './services/Admin.service';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    SignupComponent,
    LoginComponent,
    UserPageComponent,
    ViewMovieComponent,
    AdminPageComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    RouterModule  
  ],
  providers: [MovieService,MovieFinderUserService,AdminService],
  bootstrap: [AppComponent]
})
export class AppModule { }