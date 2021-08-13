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
  currentPackage;
  currentPremium;
  packageList=[];
  premiumList = [];
  imgUrl = config.host + "organisation_logo/";
  minDate : Date;
  period : String = 'Year(s)';
  premiumStartDate ='';
  premiumEndDate = '';
  total_price = '';
  discountedPrice = '';

  constructor(private dialog : MatDialog, private instituteService : InstituteManagementService,
    private snackBar : MatSnackBar, private packageService : PackageService,
    private formBuilder : FormBuilder) { 
      this.minDate  = new Date() ;
    }

  ngOnInit(): void {
    this.getPackages();
    this.getInstitute();
  }

  ngOnDestroy()
  {
    this.subscriptionForm.reset();
  }

  subscriptionForm = this.formBuilder.group(
    {
      package : ['',Validators.required],
      premium : ['', Validators.required],
      subscription_period : ['',Validators.required],
     // is_custom_price : [false],
     // custom_price : [''],
    }
  )

  get subscription_period()
  {
    return this.subscriptionForm.get('subscription_period');
  }

 /* get isCustomPrice()
  {
    return this.subscriptionForm.get('is_custom_price');

  }

  get custom_price()
  {
    return this.subscriptionForm.get('custom_price');
  }*/

  get package()
  {
    return this.subscriptionForm.get('package');
  }

  get premium()
  {
    return this.subscriptionForm.get('premium');
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
    this.currentPackage = this.packageList.filter(value => {return (value.package_id === package_id)})[0];
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

  getPeriod(event)
  {
    
    let premium_id = event.value.trim();
    let premium = this.premiumList.filter((value) => {return value.premium_id == premium_id});
    this.currentPremium = premium[0];
    this.subscription_period.setValue(premium[0]['max_time_period']);
    if(premium[0]['is_splitwise'])
    {
      let premiumCategory = premium[0]['splitwise_category'];
      switch (premiumCategory)
      {
        case 'weekly' :
          this.period = "Week(s)";
          break;
        case 'monthly' :
          this.period ="Month(s)";
          break;
        case 'daily' :
          this.period = "Day(s)";
          break;
        default :
          this.period = "Year(s)";

      }
    }
    else
    {
      this.period = "Year(s)";
    }
  }

  calcPremiumAccess()
  {
    let premium = this.premiumList.filter((value)=>{return value.premium_id == this.premium.value});
    let subsPeriod = this.subscription_period.value;
    if(premium[0]['is_splitwise']) { 
          if(premium[0]['max_time_period'] > subsPeriod)
          {
            this.total_price = (Number(subsPeriod) * Number(premium[0]['splitwise_price'])).toString();
            this.discountedPrice='';
          }
          else if(premium[0]['max_time_period'] == subsPeriod)
          {
            this.total_price = premium[0]['total_premium_price'];
            this.discountedPrice = premium[0]['discounted_premium_price'];
          }
          else
          {
            this.total_price = (Number(subsPeriod) * Number(premium[0]['splitwise_price'])).toString();
            this.discountedPrice = (((Math.trunc(Number(subsPeriod))/Number(premium[0]['max_time_period']))
            *(Number(premium[0]['discounted_premium_price'])))
            + ( (Number(subsPeriod) % Number(premium[0]['max_time_period']))*premium[0]['splitwise_price'])).toString() ;
          }   
  }
  console.log(this.total_price);
  console.log(this.discountedPrice);
  }

}
