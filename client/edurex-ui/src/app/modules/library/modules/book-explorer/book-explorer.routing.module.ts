import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BookExplorerComponent } from './book-explorer.component';
import { CreateNewBooksComponent } from './components/create-new-books/create-new-books.component';
import { DisplayBookComponent } from './components/display-book/display-book.component';
import { ViewBookComponent } from './components/view-book/view-book.component';
import { EditBookComponent } from './components/edit-book/edit-book.component';


const routes = [
    {path : 'book-explorer', component : BookExplorerComponent ,
    children : [
      {path : 'create-new',component : CreateNewBooksComponent},
      {path : 'list/:category/:subcategory', component : DisplayBookComponent},
      {path : 'view/:id', component : ViewBookComponent},
      {path : 'edit/:id',component : EditBookComponent},
   
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
  export class BookExplorerRoutingModule { }