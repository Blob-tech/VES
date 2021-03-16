import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CategoryComponent } from './components/category/category.component';
import { LibraryHomeComponent } from './components/library-home/library-home.component';
import { LibraryComponent } from './library.component';
import { SubscriberManagementComponent } from './modules/subscriber-management/subscriber-management/subscriber-management.component';
import { NotFoundComponent } from 'src/app/components/not-found/not-found.component';
import { AuthGuradService } from 'src/app/shared/guard/auth-guard';

const routes = [
    {path : 'e-library', component : LibraryComponent, canActivate : [AuthGuradService],
    children : [
      {path : 'home',component : LibraryHomeComponent, canActivate : [AuthGuradService]},
      {path : 'category/all', component : CategoryComponent, canActivate : [AuthGuradService]},
      {path : 'book-explorer', loadChildren: () => import(`./modules/book-explorer/book-explorer.module`).then(m => m.BookExplorerModule), canActivate : [AuthGuradService]},
      {path : 'subscriber', loadChildren :
    ()=> import(`./modules/subscriber-management/subscriber-management.module`).then(m=>m.SubscriberManagementModule), canActivate : [AuthGuradService]},
    {path : 'institute', loadChildren :
    ()=> import(`./modules/institute-management/institute-management.module`).then(m=>m.InstituteManagementModule), canActivate : [AuthGuradService]},
    {path : '**', redirectTo : '/404'},
    ]},
]

@NgModule({
    exports: [
      RouterModule
    ],
    imports: [
      RouterModule.forChild(routes)
    ]
  })
  export class LibraryRoutingModule { }