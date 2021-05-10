import { Component, OnInit, DoCheck } from '@angular/core';
import { PackageService } from 'src/app/modules/library/service/package.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import {config} from 'src/conf';
import { from } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';




@Component({
  selector: 'app-package-view',
  templateUrl: './package-view.component.html',
  styleUrls: ['./package-view.component.css']
})
export class PackageViewComponent implements OnInit,DoCheck{

  package;
  showLoader=false;
  iconUrl = config.host + "package/";
  showPremium=false;
  premiumList=[];
  constructor(private packageService : PackageService,private matsnackbar : MatSnackBar,
    private route : ActivatedRoute, private formBuilder : FormBuilder) { }

  ngOnInit(): void {
    this.getPackage(this.route.snapshot.paramMap.get('id'))
  }

  ngDoCheck()
  {
    
    this.addPremiumForm.get('total_premium_price').setValue(
      this.splitwise_price.value && this.max_time_period.value ?
      this.splitwise_price.value * this.max_time_period.value : 0
    );
  }

  enabledAddPremiumSave() : boolean
  {
    if(this.is_splitwise.value == false)
    {
      if(this.premium_name.valid && this.premium_price.valid && this.max_time_period.valid  )
      {
        return true;
      }
    }    
    else
    {
      if(this.is_discounted_price.value == false)
      {
        if(this.premium_name.valid && this.splitwise_category.valid
        && this.max_time_period.valid && this.splitwise_price.valid &&
        this.total_premium_price.valid)
        {
          return true;
        }
      }
      else
      {
        if(this.premium_name.valid && this.splitwise_category.valid 
        && this.max_time_period.valid && this.splitwise_price.valid &&
        this.total_premium_price.valid  && this.discounted_premium_price.valid)
        {
          return true;
        }
      }
    }
    return false;
  }

  showHidePremiumForm()
  {
    this.showPremium = !this.showPremium;
  }
  addPremiumForm = this.formBuilder.group(
    {
      premium_name : ['',[Validators.required,Validators.maxLength(50)]],
      is_splitwise : [false],
      splitwise_category :['',Validators.required],
      splitwise_price :['',[Validators.required,Validators.min(1),Validators.max(100000000)]],
      premium_price : ['',[Validators.required,Validators.min(1),Validators.max(10000000000)]],
      total_premium_price : ['',[Validators.required,Validators.min(1),Validators.max(10000000000)]],
      is_discounted_price :[false],
      max_time_period : ['',[Validators.required,Validators.min(1),Validators.max(1000000)]],
      discounted_premium_price : ['',[Validators.required,Validators.min(1),Validators.max(10000000000)]],
    }
  );

  get premium_name()
  {
    return  this.addPremiumForm.get('premium_name');
  }

  get is_splitwise()
  {
    return this.addPremiumForm.get('is_splitwise');
  }

  get splitwise_category()
  {
    return this.addPremiumForm.get('splitwise_category');
  }

  get splitwise_price()
  {
    return this.addPremiumForm.get('splitwise_price');
  }

  get total_premium_price()
  {
    return this.addPremiumForm.get('total_premium_price');
  }

  get premium_price()
  {
    return this.addPremiumForm.get('premium_price');
  }

  get is_discounted_price()
  {
    return this.addPremiumForm.get('is_discounted_price');
  }
  
  get max_time_period()
  {
    return this.addPremiumForm.get('max_time_period');
  }

  get discounted_premium_price()
  {
    return this.addPremiumForm.get('discounted_premium_price')
  }
  addPremium()
  {
    this.showLoader=true;
    let formData = new FormData();
    formData.append("package_id",this.route.snapshot.paramMap.get('id'));
    for ( const key of Object.keys(this.addPremiumForm.value) ) {
      const value = this.addPremiumForm.value[key];
      formData.append(key, value);
    }
    this.packageService.addPremium(formData).subscribe(
      data=>{
        if(!(JSON.parse(JSON.stringify(data))['err']))
        {
          this.getPremiums(this.route.snapshot.paramMap.get('id'));
          this.matsnackbar.open(JSON.parse(JSON.stringify(data))['msg'],null,{duration : 5000});
          this.showLoader=false;
        }
        else
        {
          this.matsnackbar.open(JSON.parse(JSON.stringify(data))['err'],null,{duration : 5000});
          this.showLoader=false;
        }
      },
      err=>{
        this.matsnackbar.open("Error in adding premium to this package. Please try after sometime",null,{duration : 5000});
        this.showLoader=false;
      }
    )
  }

  getPremiums(package_id)
  {
    this.showLoader=true;
    this.packageService.getPremiumByPackageId(package_id).subscribe(
      data=>{
        if(!(JSON.parse(JSON.stringify(data))['err']))
        {
          this.premiumList = data as Array<any>;
          this.showLoader=false;
        }
        else
        {
          this.matsnackbar.open(JSON.parse(JSON.stringify(data))['err'],null,{duration : 5000});
          this.showLoader=false;
        }
      },
      err => {
        this.matsnackbar.open("Error Occured !" + JSON.stringify(err),null,{duration : 5000});
        this.showLoader=false;
      }
    )
  }
  getPackage(package_id)
  {
    this.showLoader=true;
    this.packageService.getPackageById(package_id).subscribe(
      data=>{
        if(!(JSON.parse(JSON.stringify(data))['err']))
        {
          this.package = data[0];
          this.getPremiums(package_id);
          this.showLoader=false;
        }
        else
        {
          this.matsnackbar.open(JSON.parse(JSON.stringify(data))['err'],null,{duration : 5000});
          this.showLoader=false;
        }
      },
      err => {
        this.matsnackbar.open("Error Occured !" + JSON.stringify(err),null,{duration : 5000});
        this.showLoader=false;
      }
    )
  }

}
