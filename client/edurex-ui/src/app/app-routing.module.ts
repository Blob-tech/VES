import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LibraryHomeComponent } from './modules/library/components/library-home/library-home.component';
import { LibraryComponent } from './modules/library/library.component';
import { RegisterComponent } from './components/register/register.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthGuradService } from './shared/guard/auth-guard';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LoginGuardService } from './shared/guard/login-guard.service';
import { AccessForbiddenComponent } from './components/access-forbidden/access-forbidden.component';




const routes: Routes = [
  {path : 'login' , component : LoginComponent,canActivate : [LoginGuardService]},
  {path : 'register', component : RegisterComponent, canActivate :[LoginGuardService]},
  {path : 'forgot-password', component : ForgotPasswordComponent},
  {path : '404', component : NotFoundComponent , canActivate : [AuthGuradService]},
  {path : '403', component : AccessForbiddenComponent, canActivate : [AuthGuradService]},
  {path : 'package-management',loadChildren:
      ()=> import(`./modules/library/modules/package-management/package-management.module`).then(m=>m.PackageManagementModule), canActivate : [AuthGuradService]},
  {path : '', component : LibraryComponent, 
  children : [
    {path : '',component : LibraryHomeComponent, canActivate : [AuthGuradService]},
  ]}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
