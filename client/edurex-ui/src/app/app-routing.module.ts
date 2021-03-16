import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LibraryHomeComponent } from './modules/library/components/library-home/library-home.component';
import { LibraryComponent } from './modules/library/library.component';
import { RegisterComponent } from './components/register/register.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthGuradService } from './shared/guard/auth-guard';




const routes: Routes = [
  {path : 'login' , component : LoginComponent},
  {path : 'register', component : RegisterComponent},
  {path : '404', component : NotFoundComponent , canActivate : [AuthGuradService]},
  {path : '', component : LibraryComponent, 
  children : [
    {path : '',component : LibraryHomeComponent, canActivate : [AuthGuradService]},
  ]}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
