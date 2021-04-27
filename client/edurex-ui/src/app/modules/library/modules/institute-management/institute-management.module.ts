import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateInstituteComponent } from './components/create-institute/create-institute.component';
import { InstituteManagementComponent} from './institute-management.component';


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
import {ClipboardModule} from '@angular/cdk/clipboard';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {PortalModule} from '@angular/cdk/portal';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';


import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { LibraryRoutingModule } from '../../library-routing.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { NgxDocViewerModule} from 'ngx-doc-viewer';
import { MatVideoModule } from 'mat-video';
import { PlyrModule } from 'ngx-plyr';
import { InstituteManagementRoutingModule } from './institute-management.routing.module';
import { InstituteListComponent } from './components/institute-list/institute-list.component';
import { EditInstituteComponent} from './components/edit-institute/edit-institute.component';
import { CommunicationService } from '../../service/communication.service';
import { ViewInstituteComponent } from './components/view-institute/view.institute.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';


@NgModule({
  declarations: [ InstituteManagementComponent ,CreateInstituteComponent, InstituteListComponent, EditInstituteComponent,
  ViewInstituteComponent],
  imports: [
    CommonModule,
    DragDropModule,
    ScrollingModule,
    MatSliderModule,
    MatTabsModule,
    MatDatepickerModule,
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
    MatChipsModule,
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
    SharedModule,
    InstituteManagementRoutingModule
  ],
  exports : [],
  providers : [CommunicationService],
  bootstrap: [InstituteManagementComponent,CreateInstituteComponent, InstituteListComponent, EditInstituteComponent,
  ViewInstituteComponent],
})
export class InstituteManagementModule { }
