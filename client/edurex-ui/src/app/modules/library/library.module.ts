import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';

import { MatSliderModule } from '@angular/material/slider';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule, MatFormFieldControl} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDividerModule} from '@angular/material/divider';
import {MatMenuModule} from '@angular/material/menu';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {MatGridListModule} from '@angular/material/grid-list';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgBreadcrumbModule} from 'ng-breadcrumb';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import {MatTabsModule} from '@angular/material/tabs';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { LibraryComponent } from './library.component';
import { LibraryRoutingModule } from './library-routing.module';
import { CategoryComponent } from './components/category/category.component';
import { LibraryHomeComponent } from './components/library-home/library-home.component';
import { BookExplorerModule } from './modules/book-explorer/book-explorer.module';
import { BookExplorerRoutingModule } from './modules/book-explorer/book-explorer.routing.module';
import { MatChipsModule } from '@angular/material/chips';
import { ProfileModule } from './modules/profile/profile.module';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';




@NgModule({
  declarations: [
    
    
  LibraryComponent,
    
    
  CategoryComponent,
    
    
  LibraryHomeComponent,
       
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatTabsModule,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatExpansionModule,
    MatSidenavModule,
    MatTableModule,
    MatSortModule,
    MatAutocompleteModule,
    MatDividerModule,
    MatDialogModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatSelectModule,
    MaterialFileInputModule,
    MatProgressBarModule,
    NgxMatSelectSearchModule,
    MatGridListModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgBreadcrumbModule,
    LibraryRoutingModule,
    BookExplorerModule,
    ProfileModule
    

  ],
  exports : [LibraryComponent],
  providers: [LibraryComponent],
  bootstrap: [LibraryComponent, LibraryHomeComponent]
})




export class LibraryModule { }
