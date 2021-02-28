import { Component, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, Validators, ValidatorFn, FormGroup } from '@angular/forms';
import { LibraryCategoryService } from '../../../service/library-category.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileValidator } from 'ngx-material-file-input';
import { BookService } from '../../../service/book.service';
import { NavbarService } from 'src/app/components/navbar/navbar.service';
import { Router } from '@angular/router';
import { SubscriberService } from '../../../service/subscriber.service';
import { InstituteManagementService } from '../../../service/institute-management.service';




const resetPassValidator: ValidatorFn = (fg: FormGroup) => {
  const pass = fg.get('password').value;
  const repass = fg.get('resetPassword').value;

  if(pass!= null && repass!=null && pass!=repass)
  {
      fg.get('resetPassword').setErrors({notMatching : true});
  }
  else
  {
    fg.get('resetPassword').setErrors(null);
  }
  return pass !== null && repass !== null && pass == repass
    ? null
    : { range: true };
};


@Component({
  selector: 'app-register-subscriber',
  templateUrl: './register-subscriber.component.html',
  styleUrls: ['./register-subscriber.component.css']
})
export class RegisterSubscriberComponent implements OnInit,OnChanges {

  message = null;
  error = null;
  ishidden = true;
  languages;
  counter;
  filtered_languages = [];
  configParams;
  maxImgSize : number;
  avatarprogress: number;
  docprogress : number;
  url = "assets/images/user.png";
  constructor(private formBuilder : FormBuilder, private libCategoryServices : LibraryCategoryService,
    private _snackbar : MatSnackBar, private router : Router,private subscriberService : SubscriberService,
    private instituteService : InstituteManagementService, private navbar : NavbarService) { }

    
  ngOnInit(): void {
    
    this.getSubscriptionCategories();
    this.getConfigParams();
    this.getCounter();
    this.getActiveInstituteList();
    
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


  institutes = [];
  categories = [];
  hide = true;
  hide2=true;
  subscriptions=[];
  filteredcategories =[];
  subcategories =[];


  subscriberForm = this.formBuilder.group(
    {
      user_id : ['',[Validators.required, Validators.pattern("^[a-zA-Z][a-zA-Z0-9]*$")]],
      name : ['',[Validators.required, Validators.maxLength(200)]],
      email :['',[Validators.required,Validators.pattern("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")]],
      phone :['',[Validators.required]],
      address : ['',[Validators.maxLength(500)]],
      password : ['',[Validators.required,Validators.minLength(8),Validators.maxLength(15),Validators.pattern("^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]*$")]],
      resetPassword : ['',[Validators.required]],
      avatar : ['']//1 MB
    },
    { validator: resetPassValidator}
  )

  get controls() {
    return this.subscriberForm.controls;
  }

  submitDisabled()
  {
    if(this.subscriberForm.status == "VALID")
    {
      return false;
    }
    else
    {
      return true;
    }
  }

  get user_id()
  {
    return this.subscriberForm.get('user_id');
  }
  get name()
  {
    return this.subscriberForm.get('name');
  }
  get email()
  {
    return this.subscriberForm.get('email');
  }
 get phone()
 {
   return this.subscriberForm.get('phone');
 }
 get password()
 {
   return this.subscriberForm.get('password');
 }
 get resetPassword()
 {
   return this.subscriberForm.get('resetPassword');
 }

  get address()
  {
    return this.subscriberForm.get('address');
  }
  get avatar()
  {
    return this.subscriberForm.get('avatar');
  }

  getConfigParams()
  {
    this.libCategoryServices.getConfigParameters().subscribe(
      data=>{
        if(!JSON.parse(JSON.stringify(data))['err'])
        {
          this.configParams = data[0];
          this.subscriberForm.get('avatar').setValidators([FileValidator.maxContentSize(this.configParams.avatar_size*1024*1024)]);
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

  getActiveInstituteList()
  {
    this.instituteService.get_institutes().subscribe(
      data=>{
        if(!(JSON.parse(JSON.stringify(data))['err']))
        {
          this.institutes = data as Array<any>;
          this.institutes = this.institutes.filter(value => {return value.isActivated == true});
          this.institutes.sort((a,b) => a.organisation_name.localeCompare(b.organisation_name));
        }
        else
        {
          this._snackbar.open("Error in loading institutes ! "+ data,null, {duration : 5000});
          
        }
      },
      err => {
        this._snackbar.open("Error in loading institutes from edurex database! "+ err,null, {duration : 5000});
          
      })
  }
  

  getCounter()
  {
    this.navbar.getCounterList().subscribe(
      data=>{
        this.counter = data;
        this.subscriberForm.patchValue({user_id : "USR"+this.counter[0].user},{emitEvent : true});
      },
      err=>{
        this._snackbar.open("Error in loading counter",null,{duration : 5000});
      }
    )
  }

 
  getSubscriptionCategories()
  {
    this.libCategoryServices.getSubscriptionCategories().subscribe(
      data => {
        this.subscriptions = data as Array<any>;
        this.subscriptions.sort((a,b) => a.subscription_category.localeCompare(b.subscription_category));
      },
      err=>
      {
        this._snackbar.open('Error in loading subscription categories',null,{duration:5000})
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
    //console.log(this.subscriberForm);
    let formData = new FormData()
    formData.append('avatar',this.imageFile);
    
    for ( const key of Object.keys(this.subscriberForm.value) ) {
      const value = this.subscriberForm.value[key];
      formData.append(key, value);
    }

    console.log(formData);
    this.subscriberService.register(formData).subscribe(
      data=>
      {
        
        if(!(JSON.parse(JSON.stringify(data))['err']))
        {
          this.error = null;
          this.message = JSON.parse(JSON.stringify(data))['msg'];
          this._snackbar.open(JSON.parse(JSON.stringify(data))['msg'],null,{duration:5000})
          this.router.navigateByUrl('e-library/subscriber/subscriber-management/categories');
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
