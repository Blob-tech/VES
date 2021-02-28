import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileViewComponent } from './profile-view/profile-view.component';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTreeModule } from '@angular/material/tree';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatVideoModule } from 'mat-video';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSliderModule } from '@angular/material/slider';



@NgModule({
  declarations: [ProfileViewComponent],
  imports: [
    CommonModule,
    MatSidenavModule,
    MatSliderModule,
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
    NgxSpinnerModule,
    MatVideoModule,
    NgbModule,

  ],
  bootstrap : [ProfileViewComponent]
})
export class ProfileModule { }
