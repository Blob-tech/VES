import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {InstituteManagementComponent} from './institute-management.component';
import { CreateInstituteComponent } from './components/create-institute/create-institute.component';
import { InstituteListComponent } from './components/institute-list/institute-list.component';

const routes = [
    {path : 'institute-management', component : InstituteManagementComponent ,
    children : [
      {path : 'create-new',component : CreateInstituteComponent},
      {path : 'list/all', component : InstituteListComponent}
      
   
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
  export class InstituteManagementRoutingModule { }