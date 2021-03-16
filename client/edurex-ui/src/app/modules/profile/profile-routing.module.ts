import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileViewComponent } from './profile-view/profile-view.component';
import { ProfileGuradService } from './profile-guard';
import { AuthGuradService } from 'src/app/shared/guard/auth-guard';





const routes: Routes = [
  {path : 'profile/:view/:user_id' , component : ProfileViewComponent, canActivate : [ProfileGuradService,AuthGuradService]},
  {path : '**' , redirectTo : '/404'}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
