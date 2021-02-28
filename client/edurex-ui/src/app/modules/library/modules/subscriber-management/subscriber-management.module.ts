import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';




import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import {MatButtonModule} from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
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
import {MatBadgeModule} from '@angular/material/badge';




import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import {MatTabsModule} from '@angular/material/tabs';
import {NgBreadcrumbModule} from 'ng-breadcrumb';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { NgxDocViewerModule} from 'ngx-doc-viewer';
import { MatVideoModule } from 'mat-video';
import { PlyrModule } from 'ngx-plyr';
import { SubscriberManagementComponent } from './subscriber-management/subscriber-management.component';
import { RegisterSubscriberComponent } from './register-subscriber/register-subscriber.component';
import { SubscriberRoutingModule } from './subscriber-routing.module';
import { SubscribersComponent } from './subscribers/subscribers.component';
import { SubscriberListComponent } from './subscriber-list/subscriber-list.component';
import { ProfileGridComponent } from 'src/app/shared/widgets/profile-grid/profile-grid/profile-grid.component';
import { AppModule } from 'src/app/app.module';
import { InstituteManagementModule } from '../institute-management/institute-management.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatChip, MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';



@NgModule({
  declarations: [SubscriberManagementComponent, RegisterSubscriberComponent, SubscribersComponent, SubscriberListComponent,
    ],
  imports: [
    CommonModule,
    MatSliderModule,
    MatTabsModule,
    MatButtonModule,
    MatToolbarModule,
    MatTooltipModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatExpansionModule,
    MatSidenavModule,
    MatBadgeModule,
    MatTableModule,
    MatSortModule,
    MatAutocompleteModule,
    MatDividerModule,
    MatDialogModule,
    MatMenuModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatSelectModule,
    MaterialFileInputModule,
    MatProgressBarModule,
    NgxMatSelectSearchModule,
    NgBreadcrumbModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    PdfViewerModule,
    PdfJsViewerModule,
    NgxDocViewerModule,
    MatVideoModule,
    PlyrModule,
    SubscriberRoutingModule,
    MatChipsModule,
    MatDatepickerModule,
    SharedModule
  ],
  providers : [],
  bootstrap: [SubscriberManagementComponent]
})

export class SubscriberManagementModule { }
