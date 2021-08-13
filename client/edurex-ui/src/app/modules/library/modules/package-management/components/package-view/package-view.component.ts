import { Component, OnInit, DoCheck, OnDestroy } from '@angular/core';
import { PackageService } from 'src/app/modules/library/service/package.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import {config} from 'src/conf';
import { from } from 'rxjs';
import { FormBuilder, Validators, ValidatorFn, FormGroup } from '@angular/forms';
import { NavbarService } from 'src/app/components/navbar/navbar.service';
import { MatDialog } from '@angular/material/dialog';



const validDiscountPrice: ValidatorFn = (fg: FormGroup) => {
  const total = fg.get('total_premium_price').value;
  const discount = fg.get('discounted_premium_price').value;

  if(total<=discount)
  {
      fg.get('discounted_premium_price').setErrors({invalidDiscountAmt : true});
  }
  else
  {
    fg.get('discounted_premium_price').setErrors(null);
  }
  return total !== null && discount !== null && total > discount
    ? null
    : { range: true };
};

@Component({
  selector: 'app-package-view',
  templateUrl: './package-view.component.html',
  styleUrls: ['./package-view.component.css']
})
export class PackageViewComponent implements OnInit,DoCheck,OnDestroy{

  package;
  showLoader=false;
  iconUrl = config.host + "package/";
  showPremium=false;
  premiumList=[];
  packageEdit=false;
  usersEdit=false;
  subscriptionEdit=false;
  spaceEdit=false;
  minDate : Date;
  constructor(private packageService : PackageService,private matsnackbar : MatSnackBar,
    private route : ActivatedRoute, private formBuilder : FormBuilder, 
    private navbarService : NavbarService, private dialog : MatDialog,
    private router : Router) {
      this.minDate = new Date();
     }

  ngOnInit(): void {
    this.getPackage(this.route.snapshot.paramMap.get('id'));
    this.getCounter();
  }

  ngDoCheck()
  {
    
    this.addPremiumForm.get('total_premium_price').setValue(
      this.splitwise_price.value && this.max_time_period.value ?
      this.splitwise_price.value * this.max_time_period.value : 0
    );
  }

  ngOnDestroy()
  {
    this.updatePackage();
  }

  updatePackage()
  {
    let formData = new FormData();
    formData.append("package_name",this.package.package_name);
    formData.append("total_media_disk_space",this.package.total_media_disk_space);
    formData.append("total_users",this.package.total_users);
    formData.append("subscription_categories",this.package.subscription_categories);
    this.packageService.updatePackage(this.route.snapshot.paramMap.get('id'),formData)
    .subscribe(
      data=>{
        if(JSON.parse(JSON.stringify(data))['err'])
        {
          this.matsnackbar.open(JSON.parse(JSON.stringify(data))['err'],null,{duration : 5000});
        }
      },
      err=>{
        this.matsnackbar.open("Error in updating package",null,{duration:5000});
      }
    )
  }

  getPremium(premium_id)
  {
    this.packageService.getPremium(premium_id).subscribe(
      data=>{
        if(!(JSON.parse(JSON.stringify(data))['err']))
        {
          let premium=data[0];
          this.addPremiumForm.patchValue(
            {
              premium_id : premium.premium_id,
              premium_name : premium.premium_name,
              premium_description : premium.premium_description,
              is_splitwise : premium.is_splitwise,
              splitwise_category :premium.splitwise_category,
              splitwise_price : premium.splitwise_price,
              premium_price : premium.premium_price,
              total_premium_price : premium.total_premium_price,
              is_discounted_price :premium.is_discounted_price,
              max_time_period : premium.max_time_period,
              discounted_premium_price : premium.discounted_premium_price,
              discount_valid_upto : premium.discount_valid_upto
            }
          )
        }
        else
        {
          this.matsnackbar.open(JSON.parse(JSON.stringify(data))['err'],null,{duration:5000});
        }
      },
      err=>{
        this.matsnackbar.open("Error in loading Premium Details",null,{duration:5000});
      }
    )
  }

  resetAddPremiumForm()
  {
    this.addPremiumForm.patchValue(
      {
        premium_name : '',
        premium_description : '',
        is_splitwise : false,
        splitwise_category :'',
        splitwise_price : '',
        premium_price :'',
        total_premium_price : '',
        is_discounted_price :false,
        max_time_period : '',
        discounted_premium_price : '',
        discount_valid_upto:''
      }
    )
  }

  enabledAddPremiumSave() : boolean
  {
    if(this.is_splitwise.value == false)
    {
      if(this.is_discounted_price.value == false)
      {

        if(this.premium_name.valid && this.premium_description.valid && this.premium_price.valid && this.max_time_period.valid  )
        {
          return true;
        }
      }
      else
      {
        if(this.premium_name.valid && this.premium_description.valid && this.premium_price.valid 
          && this.max_time_period.valid && this.discounted_premium_price.valid && this.discount_valid_upto.valid )
        {
          return true;
        }
      }
    }    
    else
    {
      if(this.is_discounted_price.value == false)
      {
        if(this.premium_name.valid  && this.premium_description.valid && this.splitwise_category.valid
        && this.max_time_period.valid && this.splitwise_price.valid &&
        this.total_premium_price.valid)
        {
          return true;
        }
      }
      else
      {
        if(this.premium_name.valid  && this.premium_description.valid && this.splitwise_category.valid 
        && this.max_time_period.valid && this.splitwise_price.valid &&
        this.total_premium_price.valid  && this.discounted_premium_price.valid && this.discount_valid_upto.valid)
        {
          return true;
        }
      }
    }
    return false;
  }

  edit(field)
  {
    if(field == 'package')
    {
      this.packageEdit = !this.packageEdit
    }
    else if(field == 'users')
    {
      this.usersEdit = !this.usersEdit
    }
    else if(field == 'subscription')
    {
      this.subscriptionEdit = !this.subscriptionEdit
    }
    else if(field == 'space')
    {
      this.spaceEdit = !this.spaceEdit
    }
  }

  openModal(content,premium_id)
  {
    this.getPremium(premium_id);
    this.showPremium = false;
    let dialogRef = this.dialog.open(content);
  }

  

  removePackage()
  {
    var res=confirm("Are you sure you want to remove this Package ?");
    if(res)
    {
      this.showLoader=true;
      this.packageService.removePackage(this.route.snapshot.paramMap.get('id')).subscribe(
        data=>{
          if(!(JSON.parse(JSON.stringify(data))['err']))
          {
            this.matsnackbar.open(JSON.parse(JSON.stringify(data))['msg'],null,{duration : 5000});
            this.router.navigateByUrl("/e-library/package-management/packages/list");
            this.showLoader=false;
          }
          else
          {
            this.matsnackbar.open(JSON.parse(JSON.stringify(data))['err'],null,{duration : 5000});
            this.showLoader=false;
          }
        },
        err=>{
          this.matsnackbar.open("Deletion Failed ! Please try after sometime" + 
          JSON.stringify(err),null,{duration : 500000});
            this.showLoader=false;
        }
      )
    }
  }

  removePremium(id)
  {
    var res= confirm("Are you sure you want to remove this package ?");
    if(res)
    {
      this.showLoader=true;
      this.packageService.removePremium(id).subscribe(
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
          this.matsnackbar.open("Error in removing premium from this package. Please try after sometime"+JSON.stringify(err),null,{duration : 500000});
          this.showLoader=false;
        }
      )
    }
  }

  isDiscountValid(premium):boolean
  {
    let currDate = new Date();
    if(premium && premium.discount_valid_upto) {
      if(premium.discount_valid_upto.getTime() < currDate.getTime())
      {
        return true;
      }
    }

    return false;
    
  }
  
  showHidePremiumForm()
  {
    this.resetAddPremiumForm();
    this.showPremium = !this.showPremium;
  }
  addPremiumForm = this.formBuilder.group(
    {
      premium_id : ['',Validators.required],
      premium_name : ['',[Validators.required,Validators.maxLength(50)]],
      premium_description : ['',[Validators.maxLength(100)]],
      is_splitwise : [false],
      splitwise_category :['',Validators.required],
      splitwise_price :['',[Validators.required,Validators.min(1),Validators.max(100000000)]],
      premium_price : ['',[Validators.required,Validators.min(1),Validators.max(10000000000)]],
      total_premium_price : ['',[Validators.required,Validators.min(1),Validators.max(10000000000)]],
      is_discounted_price :[false],
      max_time_period : ['',[Validators.required,Validators.min(1),Validators.max(1000000)]],
      discounted_premium_price : ['',[Validators.required,Validators.min(1),Validators.max(10000000000)]],
      discount_valid_upto : ['',[Validators.required]]
    },
    {validators : validDiscountPrice}

  );

  get premium_id()
  {
    return this.addPremiumForm.get('premium_id');
  }

  get premium_name()
  {
    return  this.addPremiumForm.get('premium_name');
  }

  get premium_description()
  {
    return this.addPremiumForm.get('premium_description');
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
  
  get discount_valid_upto()
  {
    return this.addPremiumForm.get('discount_valid_upto');
  }

  get max_time_period()
  {
    return this.addPremiumForm.get('max_time_period');
  }

  get discounted_premium_price()
  {
    return this.addPremiumForm.get('discounted_premium_price')
  }

  updatePremium()
  {
    this.showLoader =true;
    let formData = new FormData();
    formData.append("package_id",this.route.snapshot.paramMap.get('id'));
    for ( const key of Object.keys(this.addPremiumForm.value) ) {
      const value = this.addPremiumForm.value[key];
      formData.append(key, value);
    }
    this.packageService.updatePremium(formData,this.premium_id.value).subscribe(
      data=>{
        if(!(JSON.parse(JSON.stringify(data))['err']))
        {
          this.getPremiums(this.route.snapshot.paramMap.get('id'));
          this.getCounter();
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
        this.matsnackbar.open("Error in updating premium. Please try after sometime",null,{duration : 5000});
        this.showLoader=false;
      }
    )

  }
  async addPremium()
  {
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
          this.getCounter();
          this.matsnackbar.open(JSON.parse(JSON.stringify(data))['msg'],null,{duration : 5000});
          this.resetAddPremiumForm();
          this.showPremium = false;
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

  counter;
  getCounter()
  {
   
    this.navbarService.getCounterList().subscribe(
      data=>{
        this.counter = data;
        const  currentDate = new Date();
        const currentDateYear = currentDate.getFullYear().toString();
        this.addPremiumForm.patchValue({premium_id : this.counter[0].premium_prefix +currentDateYear+this.counter[0].premium},{emitEvent : true});
       
      },
      err=>{
        this.matsnackbar.open("Error in loading counter",null,{duration : 5000});
       
      }
    )
  }

}
