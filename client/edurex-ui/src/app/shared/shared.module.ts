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
import {MatButtonToggleModule} from '@angular/material/button-toggle';
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
import { ProfileGridComponent } from './widgets/profile-grid/profile-grid/profile-grid.component';
import { ManageAccessComponent } from './widgets/manage-access/manage-access.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { SocialLinksComponent } from './widgets/social-links/social-links.component';
import { MatChipsModule } from '@angular/material/chips';
import { RoleTranslatePipe } from './pipes/role-translate.pipe';
import { SearchGridComponent } from './widgets/search/search-grid/search-grid.component';
import { SecureStorageService } from './services/secure-storage.service';
import { LocalService } from './services/local-storage';
import { AuthGuradService } from './guard/auth-guard';



@NgModule({
  declarations: [ProfileGridComponent, ManageAccessComponent, SocialLinksComponent, RoleTranslatePipe, SearchGridComponent],
  imports: [
    CommonModule,
    MatSliderModule,
    MatTabsModule,
    MatButtonModule,
    MatToolbarModule,
    MatTooltipModule,
    MatDatepickerModule,
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
    MatButtonToggleModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatSelectModule,
    MaterialFileInputModule,
    MatProgressBarModule,
    NgxMatSelectSearchModule,
    MatChipsModule,
    NgBreadcrumbModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    PdfViewerModule,
    PdfJsViewerModule,
    NgxDocViewerModule,
    MatVideoModule,
    PlyrModule,
  ],
  exports : [ProfileGridComponent,ManageAccessComponent,SocialLinksComponent,
    SearchGridComponent, RoleTranslatePipe],
  providers : [MatDatepickerModule,SecureStorageService,LocalService, AuthGuradService],
  bootstrap: [ProfileGridComponent,ManageAccessComponent]
})

export class SharedModule { }
