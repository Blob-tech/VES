import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LibraryHomeComponent } from './modules/library/components/library-home/library-home.component';
import { LibraryComponent } from './modules/library/library.component';




const routes: Routes = [
  {path : 'login' , component : LoginComponent},
  {path : '', component : LibraryComponent, 
  children : [
    {path : '',component : LibraryHomeComponent}
  ]}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
