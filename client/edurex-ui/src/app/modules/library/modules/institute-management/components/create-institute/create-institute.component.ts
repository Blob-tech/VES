import { Component, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, Validators, ValidatorFn, FormGroup } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { FileValidator } from 'ngx-material-file-input';

import { NavbarService } from 'src/app/components/navbar/navbar.service';
import { Router } from '@angular/router';
import { LibraryCategoryService } from 'src/app/modules/library/service/library-category.service';
import { SubscriberService } from 'src/app/modules/library/service/subscriber.service';
import { InstituteManagementService } from 'src/app/modules/library/service/institute-management.service';
import { RoleAccessService } from 'src/app/shared/services/role-access.service';







@Component({
  selector: 'app-create-institute',
  templateUrl: './create-institute.component.html',
  styleUrls: ['./create-institute.component.css']
})
export class CreateInstituteComponent implements OnInit,OnChanges {

  showLoader = true;
  message = null;
  error = null;
  ishidden = true;
  languages;
  counter;
  configParams;
  maxImgSize : number;
  avatarprogress: number;
  docprogress : number;
  checkClientIDValidity = false;
  url = "assets/images/user.png";
  constructor(private formBuilder : FormBuilder, private libCategoryServices : LibraryCategoryService,
    private _snackbar : MatSnackBar, private router : Router,private instituteService :InstituteManagementService,
    private navbar : NavbarService, private subscriberService : SubscriberService,
    private roleAccessService : RoleAccessService, navbarService : NavbarService) { }

    
  ngOnInit(): void {
    
    this.getConfigParams();
    this.getCounter();
    
  }

  ngOnChanges() : void {

   
  }

  ngDoCheck() : void
  {
    
   
  }

  dismissMessageAlert()
  {
    this.message = null;
  }

  dismissErrorAlert()
  {
    this.error = null;
  }

  
  hide = true;
  hide2=true;



  organisationForm = this.formBuilder.group(
    {
      organisation_id : ['',[Validators.required, Validators.pattern("^[a-zA-Z][a-zA-Z0-9]*$")]],
      organisation_name : ['',[Validators.required, Validators.maxLength(200)]],
      contact_email :['',[Validators.required,Validators.pattern("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")]],
      contact_phone :['',[Validators.required,Validators.pattern("^[0-9]{10}$")]],
      contact_person : ['',[Validators.required, Validators.maxLength(100)]],
      address : ['',[Validators.maxLength(500)]],
      client_id :['',[Validators.required, Validators.maxLength(10)]],
      avatar : ['']//1 MB
    },
  )

  get controls() {
    return this.organisationForm.controls;
  }

  submitDisabled()
  {
    if(this.organisationForm.status == "VALID" && this.checkClientIDValidity)
    {
      return false;
    }
    else
    {
      return true;
    }
  }

  get organisation_id()
  {
    return this.organisationForm.get('organisation_id');
  }
  get organisation_name()
  {
    return this.organisationForm.get('organisation_name');
  }
  get contact_email()
  {
    return this.organisationForm.get('contact_email');
  }
 get contact_phone()
 {
   return this.organisationForm.get('contact_phone');
 }
 get client_id()
 {
   return this.organisationForm.get('client_id');
 }
  get contact_person()
  {
    return this.organisationForm.get('contact_person');
  }

  get address()
  {
    return this.organisationForm.get('address');
  }
  
  get avatar()
  {
    return this.organisationForm.get('avatar');
  }

  getConfigParams()
  {
    this.showLoader=true;
    this.navbar.getSystemBranding().subscribe(
    //this.libCategoryServices.getConfigParameters().subscribe(
      data=>{
        if(!JSON.parse(JSON.stringify(data))['err'])
        {
          this.configParams = data[0];
          this.organisationForm.get('avatar').setValidators([FileValidator.maxContentSize(this.configParams.logo_size*1024*1024)]);
        }
        else
        {
          this._snackbar.open(JSON.parse(JSON.stringify(data))['err'],null,{duration : 5000})
        }
        this.showLoader = false;
      },
      err=>{
        this._snackbar.open("Error in Loading Library Config Parameters",null,{duration : 5000});
        this.showLoader = false;
      }
    )
  }

  getCounter()
  {
    this.showLoader = true;
    this.navbar.getCounterList().subscribe(
      data=>{
        this.counter = data;
        const currentDate = new Date();
        const currentDateYear = currentDate.getFullYear().toString();
        this.organisationForm.patchValue({organisation_id : this.counter[0].organisation_prefix+currentDateYear+this.counter[0].organisation},{emitEvent : true});
        this.showLoader = false;
      },
      err=>{
        this._snackbar.open("Error in loading counter",null,{duration : 5000});
        this.showLoader = false;
      }
    )
  }

  isClientIdValid(event : Event)
  {
    this.get_institute_by_client_id(this.organisationForm.get('client_id').value);
  }
  get_institute_by_client_id(client_id : String)
  {
    this.instituteService.get_institute_by_client_id(client_id).subscribe(
      data=>{
         let result = data as Array<any>;
        if(result.length != 0)
        {
          this.checkClientIDValidity = false;
         
        }
        else
        {
          this.checkClientIDValidity = true;
          
        }
      }
    )
  }
  

  
  imageFile : any;
  onSelectAvatar(event) {
    this.avatarprogress = 0;
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      this.imageFile = event.target.files[0]
      reader.onload = (event: any) => {
        this.avatarprogress = Math.round(100 * event.loaded / event.total);
        this.url = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  registerInstituteAdmin()
  {
    let userformData = new FormData()
    userformData.append('avatar',this.imageFile);
    userformData.append('user_id' ,this.client_id.value);
    userformData.append('email' ,this.contact_email.value);
    userformData.append('phone' ,this.contact_phone.value);
    userformData.append('name' ,this.contact_person.value);
    userformData.append('address' ,this.address.value);
    userformData.append('password' ,this.contact_phone.value);

    this.subscriberService.register(userformData).subscribe(
      data=>
      {
        
        if(!(JSON.parse(JSON.stringify(data))['err']))
        {
          
          this.instituteAdminAccess();
        }
        else
        {
          this.message = null;
          this.error =  JSON.parse(JSON.stringify(data))['err'];
          this.showLoader = false;
        }
      },
      err =>
      {
        this.message = null;
        this.error = "Error in adding new subscriber to Edurex Database. Please try after few minutes.";
        this.showLoader =false;
        
      }
    )
    
  }


  instituteAdminAccess()
  {
      let formData = new FormData();
      let validupto : Date;
     
      formData.append('users', this.client_id.value);
      formData.append('institutes',this.organisation_id.value);
      formData.append('role','IADMIN');
      formData.append('valid_upto', '');
      formData.append('approval','user');
      this.roleAccessService.giveRoleAccess(formData).subscribe(
        data=>{
          if(!(JSON.parse(JSON.stringify(data))['err']))
          {
            this.error = null;
            this.message = JSON.parse(JSON.stringify(data))['msg'];
            this._snackbar.open(JSON.parse(JSON.stringify(data))['msg'],null,{duration:5000})
            this.router.navigateByUrl('e-library/institute/institute-management/list/all').then(
              ()=>{
                this.showLoader = false;
              }
            );
            
          }
          else
          {
            this._snackbar.open(JSON.parse(JSON.stringify(data))['err'],null,{duration : 5000});
            this.showLoader=false;
          }
        },
        err=>{
          this._snackbar.open("Error in Giving Access ! Please try after few minutes", null , {duration : 5000} );
          this.showLoader=false;
        }
      )
    
  }
  

  register()
  {
    this.showLoader = true;
   
    let formData = new FormData()
    formData.append('avatar',this.imageFile);
    
    for ( const key of Object.keys(this.organisationForm.value) ) {
      const value = this.organisationForm.value[key];
      formData.append(key, value);
    }

    
    this.instituteService.register(formData).subscribe(
      data=>
      {
        
        if(!(JSON.parse(JSON.stringify(data))['err']))
        {
          this.registerInstituteAdmin();
         
        }
        {
          this.message = null;
          this.error =  JSON.parse(JSON.stringify(data))['err'];
          this.showLoader = false;
        }
        
      },
      err =>
      {
        this.message = null;
        this.error = "Error in adding new Institute to Edurex Database. Please try after few minutes.";
        this.showLoader = false;
      }
    )
    
  }

  

  
}

