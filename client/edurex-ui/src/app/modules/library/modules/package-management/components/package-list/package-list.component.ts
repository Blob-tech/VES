import { Component, OnInit } from '@angular/core';
import { PackageService } from 'src/app/modules/library/service/package.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {config} from 'src/conf';

@Component({
  selector: 'app-package-list',
  templateUrl: './package-list.component.html',
  styleUrls: ['./package-list.component.css']
})
export class PackageListComponent implements OnInit {

  packageList=[];
  showLoader=true;
  iconUrl = config.host + "package/";
  constructor(private packageService : PackageService, private _snackbar : MatSnackBar) { }

  ngOnInit(): void {
    this.getPackages();
  }

  getPackages()
  {
    this.showLoader=true;
    this.packageService.getPackages().subscribe(
      data=>{
        this.packageList = data as Array<any>;
        this.showLoader=false;
      },
      err=>{
        this._snackbar.open("Error in retrieving the list of packages!",null,{duration:5000});
      }
    )
  }

}
