import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CategoryComponent } from './components/category/category.component';
import { LibraryHomeComponent } from './components/library-home/library-home.component';
import { LibraryComponent } from './library.component';
import { SubscriberManagementComponent } from './modules/subscriber-management/subscriber-management/subscriber-management.component';

const routes = [
    {path : 'e-library', component : LibraryComponent, 
    children : [
      {path : 'home',component : LibraryHomeComponent},
      {path : 'category/all', component : CategoryComponent},
      {path : '', loadChildren: () => import(`./modules/book-explorer/book-explorer.module`).then(m => m.BookExplorerModule)},
      {path : 'subscriber', loadChildren :
    ()=> import(`./modules/subscriber-management/subscriber-management.module`).then(m=>m.SubscriberManagementModule)},
    {path : 'institute', loadChildren :
    ()=> import(`./modules/institute-management/institute-management.module`).then(m=>m.InstituteManagementModule)}
      
    ]}
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