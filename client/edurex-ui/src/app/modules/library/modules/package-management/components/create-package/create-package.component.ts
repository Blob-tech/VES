import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavbarService } from 'src/app/components/navbar/navbar.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileValidator } from 'ngx-material-file-input';
import { PackageService } from 'src/app/modules/library/service/package.service';
import { Router } from '@angular/router';
import { LibraryCategoryService } from 'src/app/modules/library/service/library-category.service';

@Component({
  selector: 'app-create-package',
  templateUrl: './create-package.component.html',
  styleUrls: ['./create-package.component.css']
})
export class CreatePackageComponent implements OnInit {

  showLoader = true;
  maxSpaceLimit;
  maxUserLimit;
  maxSubscriptionLimit;
  iconprogress: number;
  configParams;
  counter;
  url = "assets/images/package.jpg";
  constructor(private formBuilder : FormBuilder,private navbarService :NavbarService,
    private _sanckbar : MatSnackBar,private packageService : PackageService,private libraryCategoryService 
    : LibraryCategoryService,
    private router : Router) { }

  ngOnInit(): void {
    this.getCounter();
    this.getSystemBranding();
  }

  

  addPackageForm = this.formBuilder.group(
    {
      package_id : [''],
      package_name : ['',[Validators.required,Validators.maxLength(50)]],
      total_media_disk_space : [''],
      total_users : [''],
      subscription_categories : [''],
      package :['']
    }
  );

  get package()
  {
    return this.addPackageForm.get('package');
  }

  get package_id()
  {
    return this.addPackageForm.get('package_id')
  }
  get package_name()
  {
    return this.addPackageForm.get('package_name');
  }

  get total_media_disk_space()
  {
    return this.addPackageForm.get('total_media_disk_space');
  }
  get total_users()
  {
    return this.addPackageForm.get('total_users');
  }

  get subscription_categories()
  {
    return this.addPackageForm.get('subscription_categories');
  }

  getSystemBranding()
  {
    this.navbarService.getSystemBranding().subscribe(
      data=>{
        this.configParams = data[0];
        this.maxSpaceLimit= Number(data[0].MAX_SPACE);
        this.maxSubscriptionLimit = Number(data[0].MAX_SUBSCRIPTION);
        this.maxUserLimit= Number(data[0].MAX_USER);
        this.addPackageForm.get('package').setValidators([FileValidator.maxContentSize(data[0].package_icon_size*1024*1024)]);
        this.addPackageForm.get('total_media_disk_space').setValidators([Validators.required,Validators.max(data[0].MAX_SPACE),Validators.min(1)]);
        this.addPackageForm.get('total_users').setValidators([Validators.required,Validators.max(data[0].MAX_USER),Validators.min(1)]);
        this.addPackageForm.get('subscription_categories').setValidators([Validators.required,Validators.max(data[0].MAX_SUBSCRIPTION),Validators.min(1)]);
        this.showLoader=false;
        },
        err=>{
          this._sanckbar.open("Error in loading brand", null, {duration : 5000});
        }
      
    )
  }

  getCounter()
  {
    this.showLoader = true;
    this.navbarService.getCounterList().subscribe(
      data=>{
        this.counter = data;
        const  currentDate = new Date();
        const currentDateYear = currentDate.getFullYear().toString();
        this.addPackageForm.patchValue({package_id : this.counter[0].package_prefix +currentDateYear+this.counter[0].package},{emitEvent : true});
        this.showLoader = false;
      },
      err=>{
        this._sanckbar.open("Error in loading counter",null,{duration : 5000});
        this.showLoader = false;
      }
    )
  }


  IconFile : any;
  onSelectIcon(event) {
    this.iconprogress = 0;
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      this.IconFile = event.target.files[0]
      reader.onload = (event: any) => {
        this.iconprogress = Math.round(100 * event.loaded / event.total);
        this.url = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  addPackage()
  {
    this.showLoader = true;
    let formData = new FormData()
    formData.append('package',this.IconFile);
    
    for ( const key of Object.keys(this.addPackageForm.value) ) {
      const value = this.addPackageForm.value[key];
      formData.append(key, value);
    }
   
    this.packageService.addPackage(formData).subscribe(
      data=>
      {
        this.addPackageForm.reset();
        if(!(JSON.parse(JSON.stringify(data))['err']))
        {
          this._sanckbar.open(JSON.parse(JSON.stringify(data))['msg'],null,{duration:5000})
          this.router.navigateByUrl('e-library/package-management/packages/list').then(
            ()=>{this.showLoader = false});
        }
        else
        {
          this._sanckbar.open(JSON.parse(JSON.stringify(data))['err'],null,{duration:5000})
          this.showLoader = false;
        }
      },
      err =>
      {
        this._sanckbar.open("Error in adding package! Please try after few minutes",null,{duration:5000})
        this.showLoader = false;
      }
    )
  }

}

