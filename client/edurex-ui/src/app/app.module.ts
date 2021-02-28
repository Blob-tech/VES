import { BrowserModule } from '@angular/platform-browser';

import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';



import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';

import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent} from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule,MatFormFieldControl } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule, MatAccordion } from '@angular/material/expansion';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { LibraryRoutingModule } from './modules/library/library-routing.module';
import { LibraryModule } from './modules/library/library.module';
import {MatTreeModule} from '@angular/material/tree';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { NgxSpinnerModule } from "ngx-spinner";
import { MatVideoModule } from 'mat-video';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatNativeDateModule } from '@angular/material/core';
import { ProfileRoutingModule } from './modules/profile/profile-routing.module';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LibraryRoutingModule,
    ProfileRoutingModule,
    BrowserAnimationsModule,
    MaterialFileInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatTreeModule,
    MatMenuModule,
    MatCardModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatGridListModule,
    MatCheckboxModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatTableModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    LibraryModule,
    NgxSpinnerModule,
    MatVideoModule,
    NgbModule,

  ],
  exports:[],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
