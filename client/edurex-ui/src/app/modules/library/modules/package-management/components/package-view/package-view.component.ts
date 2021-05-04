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
  showLoader=true;
  iconUrl = config.host + "package/";
  showPremium=false;
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
