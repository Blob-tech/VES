import { Component, OnInit } from '@angular/core';
import { PackageService } from 'src/app/modules/library/service/package.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import {config} from 'src/conf';
import { from } from 'rxjs';

@Component({
  selector: 'app-package-view',
  templateUrl: './package-view.component.html',
  styleUrls: ['./package-view.component.css']
})
export class PackageViewComponent implements OnInit {

  package;
  showLoader=true;
  iconUrl = config.host + "package/";
  constructor(private packageService : PackageService,private matsnackbar : MatSnackBar,
    private route : ActivatedRoute) { }

  ngOnInit(): void {
    this.getPackage(this.route.snapshot.paramMap.get('id'))
  }

  getPackage(package_id)
  {
    this.showLoader=true;
    this.packageService.getPackageById(package_id).subscribe(
      data=>{
        if(!(JSON.parse(JSON.stringify(data))['err']))
        {
          this.package = data[0];
          this.showLoader=false;
        }
        else
        {
          this.matsnackbar.open(JSON.parse(JSON.stringify(data))['err'],null,{duration : 5000});
        }
      }
    )
  }

}
