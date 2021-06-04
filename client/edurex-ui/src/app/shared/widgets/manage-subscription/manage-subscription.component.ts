import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Institute } from 'src/app/modules/library/modules/institute-management/models/institute';
import { InstituteManagementService } from 'src/app/modules/library/service/institute-management.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PackageService } from 'src/app/modules/library/service/package.service';
import {config} from 'src/conf';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-manage-subscription',
  templateUrl: './manage-subscription.component.html',
  styleUrls: ['./manage-subscription.component.css']
})
export class ManageSubscriptionComponent implements OnInit {

  @Input()
  access_id : string = '';

  @Input()
  mode ?: string = 'institute'

  @Input()
  disabled : boolean = false;

  

  currentInstitute;
  packageList=[];
  premiumList = [];
  imgUrl = config.host + "organisation_logo/";
  minDate : Date;
  

  constructor(private dialog : MatDialog, private instituteService : InstituteManagementService,
    private snackBar : MatSnackBar, private packageService : PackageService,
    private formBuilder : FormBuilder) { 
      this.minDate  = new Date() ;
    }

  ngOnInit(): void {
    this.getPackages();
    this.getInstitute();
  }

  subscriptionForm = this.formBuilder.group(
    {
      package : ['',Validators.required],
      premium : ['', Validators.required],
      valid_upto : ['']
    }
  )

  get package()
  {
    return this.subscriptionForm.get('package');
  }

  get premium()
  {
    return this.subscriptionForm.get('premium');
  }

  get valid_upto()
  {
    return this.subscriptionForm.get('valid_upto');
  }

  open(content)
  {
      const dialogref = this.dialog.open(content);
  }

  getInstitute()
  {
    this.instituteService.view_institute(this.access_id).subscribe(
      data=>{
        this.currentInstitute = data[0];
      },
      err=>{
        this.snackBar.open("Error in loading Institute",null,{duration : 5000});
      }
    )
  }

  getPackages()
  {
    this.packageService.getPackages().subscribe(
      data=>{
        this.packageList = data as Array<any>
      },
      err=>{
        this.snackBar.open("Error in loading packages",null,{duration : 5000});
      }
    )
  }

  getPremium(event)
  {
    this.premium.setValue('');
    let package_id = event.value.trim();
    if(package_id == '')
      {
        
        this.premiumList = [];
      }
    this.packageService.getPremiumByPackageId(package_id).subscribe(
      data=>{
        this.premiumList = data as Array<any>;
      },
      err=>{
        this.snackBar.open("Error in loading premium")
      }
    )
  }

}
