import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './mainPage/main.component';
import { SignupComponent } from './Sign-Up/signup.component';
import { LoginComponent } from './Login/login.component';
import { UserPageComponent } from './UserPage/UserPage.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'signup', component: SignupComponent },
  {path: 'login', component: LoginComponent},
  {path: 'main', component: UserPageComponent}
  // Add other routes here
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }