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
import { MatDialogModule } from '@angular/material/dialog';
import { PlaylistDialogComponent } from './playlist-dialog/playlist-dialog.component';
import { PlaylistService } from './services/Playlist.service';
import { AddToPlaylistDialogComponent } from './add-to-playlist-dialog/add-to-playlist-dialog.component';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    SignupComponent,
    LoginComponent,
    UserPageComponent,
    ViewMovieComponent,
    AdminPageComponent,
    PlaylistDialogComponent,
    AddToPlaylistDialogComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    RouterModule,
    MatDialogModule,
    MatListModule,
    MatButtonModule,
  ],
  providers: [MovieService,MovieFinderUserService,AdminService, PlaylistService],
  bootstrap: [AppComponent]
})
export class AppModule { }