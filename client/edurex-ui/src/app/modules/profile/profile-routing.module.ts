import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileViewComponent } from './profile-view/profile-view.component';





const routes: Routes = [
  {path : 'profile/:view/:user_id' , component : ProfileViewComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
