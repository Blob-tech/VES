import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuradService } from 'src/app/shared/guard/auth-guard';
import { PackageManagementComponent } from './package-management/package-management.component';
import { PackageListComponent } from './components/package-list/package-list.component';
import { CreatePackageComponent } from './components/create-package/create-package.component';
import { PackageViewComponent } from './components/package-view/package-view.component';



const routes = [
  {path : 'packages', component : PackageManagementComponent , canActivate : [AuthGuradService],
  children : [
       {path : 'list',component : PackageListComponent, },
       {path : 'create', component : CreatePackageComponent},
       {path : 'view/:id',component : PackageViewComponent},
       {path : '**', redirectTo : '/404'},
  ]},
]

@NgModule({
    exports: [
      RouterModule,
    ],
    imports: [
      RouterModule.forChild(routes)
    ]
  })

  export class PackageRoutingModule { }