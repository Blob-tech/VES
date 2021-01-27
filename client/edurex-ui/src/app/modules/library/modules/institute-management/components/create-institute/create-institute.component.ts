import { Component, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, Validators, ValidatorFn, FormGroup } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { FileValidator } from 'ngx-material-file-input';

import { NavbarService } from 'src/app/components/navbar/navbar.service';
import { Router } from '@angular/router';
import { LibraryCategoryService } from 'src/app/modules/library/service/library-category.service';
import { SubscriberService } from 'src/app/modules/library/service/subscriber.service';
import { InstituteManagementService } from 'src/app/modules/library/service/institute-management.service';







@Component({
  selector: 'app-create-institute',
  templateUrl: './create-institute.component.html',
  styleUrls: ['./create-institute.component.css']
})
export class CreateInstituteComponent implements OnInit {

  message = null;
  error = null;
  ishidden = true;
  languages;
  counter;
  configParams;
  maxImgSize : number;
  avatarprogress: number;
  docprogress : number;
  url = "assets/images/user.png";
  constructor(private formBuilder : FormBuilder, private libCategoryServices : LibraryCategoryService,
    private _snackbar : MatSnackBar, private router : Router,private instituteService :InstituteManagementService,
    private navbar : NavbarService) { }

    
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
      contact_phone :['',[Validators.required]],
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
    if(this.organisationForm.status == "VALID")
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
    this.libCategoryServices.getConfigParameters().subscribe(
      data=>{
        if(!JSON.parse(JSON.stringify(data))['err'])
        {
          this.configParams = data[0];
          this.organisationForm.get('avatar').setValidators([FileValidator.maxContentSize(this.configParams.avatar_size*1024*1024)]);
        }
        else
        {
          this._snackbar.open(JSON.parse(JSON.stringify(data))['err'],null,{duration : 5000})
        }
      },
      err=>{
        this._snackbar.open("Error in Loading Library Config Parameters",null,{duration : 5000})
      }
    )
  }

  getCounter()
  {
    this.navbar.getCounterList().subscribe(
      data=>{
        this.counter = data;
        this.organisationForm.patchValue({organisation_id : "INS"+this.counter[0].organisation},{emitEvent : true});
      },
      err=>{
        this._snackbar.open("Error in loading counter",null,{duration : 5000});
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

  

  register()
  {
    //console.log(this.organisationForm);
    let formData = new FormData()
    formData.append('avatar',this.imageFile);
    
    for ( const key of Object.keys(this.organisationForm.value) ) {
      const value = this.organisationForm.value[key];
      formData.append(key, value);
    }

    console.log(formData);
    this.instituteService.register(formData).subscribe(
      data=>
      {
        
        if(!(JSON.parse(JSON.stringify(data))['err']))
        {
          this.error = null;
          this.message = JSON.parse(JSON.stringify(data))['msg'];
          this._snackbar.open(JSON.parse(JSON.stringify(data))['msg'],null,{duration:5000})
          this.router.navigateByUrl('e-library/institute/institute-management/list/all');
        }
        else
        {
          this.message = null;
          this.error =  JSON.parse(JSON.stringify(data))['err'];
        }
      },
      err =>
      {
        this.message = null;
        this.error = "Error in adding new subscriber to Edurex Database. Please try after few minutes."
      }
    )
    
  }

  

  
}

