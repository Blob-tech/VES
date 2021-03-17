import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { User } from '../../library/modules/subscriber-management/models/subscriber';
import { SubscriberService } from '../../library/service/subscriber.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { MatAccordion } from '@angular/material/expansion';
import { FormBuilder, Validators } from '@angular/forms';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { SocialLinksComponent } from 'src/app/shared/widgets/social-links/social-links.component';
import { LibraryCategoryService } from '../../library/service/library-category.service';
import { RoleAccessService } from 'src/app/shared/services/role-access.service';
import { config } from 'src/conf';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';



export interface SocialProfile
{
  link_url : string;
}

export interface PersonaInterest
{
  interest : string;
}


@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent implements OnInit {

  currentUser ;
  mode='large';
  userMetas : any;
  newSocialLink = '';
  maxDate : Date;
  instituteList = [];
  imgUrl = config.host + "organisation_logo/";
  dark_mode;


  visibilitySettings = {

  viewBasicInfo  : true,
  viewPersonalDetails : true,
  viewInstitute : true,
  viewSubscriptions : true,
  viewSocialProfile : true,
  viewProfileImage : true,

  }


  socialLinks: SocialProfile[] = [];
  personalInterests : PersonaInterest[] = [];
  user_gender : string;
  showLoader = true;
 
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  roleList: any;
  constructor(private subscriberServices : SubscriberService, private snackBar : MatSnackBar,
    private route : ActivatedRoute,private formBuilder : FormBuilder, private router : Router,
    private libCategoryService : LibraryCategoryService,private roleAccessService : RoleAccessService,
    private localStorageService : LocalStorageService) { }

  ngOnInit(): void {

    this.showLoader=true;
    this.maxDate = new Date();
    this.dark_mode = this.localStorageService.getter("dark-mode") == "true" ? true : false;
    
    
    this.route.params.subscribe(routeParams => {
      this.getCurrentUser(routeParams.user_id);
      this.getuserMetas(routeParams.user_id);
      this.getInstituteAndRole(routeParams.user_id);
    })
    
  }

  toggleVisibility(param:string)
  {
    if(param == 'basic_info')
    {
      this.visibilitySettings.viewBasicInfo = !this.visibilitySettings.viewBasicInfo;
    }
    else if(param == 'personal_details')
    {
      this.visibilitySettings.viewPersonalDetails = !this.visibilitySettings.viewPersonalDetails;
    }
    else if(param == 'institutes')
    {
      this.visibilitySettings.viewInstitute = !this.visibilitySettings.viewInstitute;
    }
    else if( param == 'subscriptions')
    {
      this.visibilitySettings.viewSubscriptions = !this.visibilitySettings.viewSubscriptions;
    }
    else if(param == 'social_profile')
    {
      this.visibilitySettings.viewSocialProfile = !this.visibilitySettings.viewSocialProfile;
    }
    else if(param == 'profile_image')
    {
      this.visibilitySettings.viewProfileImage = !this.visibilitySettings.viewProfileImage;
    }
    this.subscriberServices.set_visibility(this.currentUser.user_id,this.visibilitySettings)
      .subscribe(
        data=>{
          if(!JSON.parse(JSON.stringify(data))['err'])
          {
            this.snackBar.open(JSON.parse(JSON.stringify(data))['msg'],null,{duration : 5000});
          }
          else
          {
            this.snackBar.open(JSON.parse(JSON.stringify(data))['err'],null,{duration : 5000});
          }
          
        },
        err=>{
          this.snackBar.open("Error in setting Visibility",null,{duration : 5000});
        }
      )
  }

  @Output("toggleDarkness")
  toggleDarkness : EventEmitter<any> = new EventEmitter();

  @Output("setTheme")
  setTheme : EventEmitter<String> = new EventEmitter<String>();

  changeTheme(theme : String)
  {
    this.setTheme.next(theme);
  }


  toggleDarkMode()
  {
      this.toggleDarkness.emit();
  }

  @ViewChild(MatAccordion) accordion: MatAccordion;
  getCurrentUser(user_id : string)
  {
    this.subscriberServices.get_subscriber_by_id(user_id).subscribe(
      data=>{
        if(!(JSON.parse(JSON.stringify(data))['err']))
        {
          
          this.currentUser = data as User;
          this.basicInfoForm.patchValue({
            name : this.currentUser.name,
            email : this.currentUser.email,
            phone : this.currentUser.phone,
            address : this.currentUser.address,
          },{emitEvent : true});
        }
        this.showLoader = false;
       
      },
      err => {
        this.snackBar.open("Error in getting user details" + err , null, {duration : 5000});
        this.showLoader=false
      }
      
    )
  }

  basicInfoForm = this.formBuilder.group(
    {
      name : ['',[Validators.required, Validators.maxLength(200)]],
      email :['',[Validators.required,Validators.pattern("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")]],
      phone :['',[Validators.required, Validators.pattern("^[0-9]{10}$")]],
      address : ['',[Validators.maxLength(500)]],
    },
  );
  personalDetailsForm = this.formBuilder.group(
    {
      bio : ['', [Validators.maxLength(500)]],
      gender :[''],
      dob : [''],
      interested_in : [''],
    }
  )

  

  get name()
  {
    return this.basicInfoForm.get('name');
  }

  get email()
  {
    return this.basicInfoForm.get('email');
  }

  get phone()
  {
    return this.basicInfoForm.get('phone');
  }

  get address()
  {
    return this.basicInfoForm.get('address');
  }

  get bio()
  {
    return this.personalDetailsForm.get('bio');
  }

  get gender()
  {
    return this.personalDetailsForm.get('gender');
  }

  get interested_in()
  {
    return this.personalDetailsForm.get('interested_in');
  }

  get dob()
  {
    return this.personalDetailsForm.get('dob');
  }


  updateBasicInfoDisabled()
  {
    if(this.basicInfoForm.status == "VALID")
    {
      return false;
    }
    else
    {
      return true;
    }
  }
  

  updateBasicInfo()
  {
    let formData = new FormData()
    
    this.showLoader = true;
    for ( const key of Object.keys(this.basicInfoForm.value) ) {
      const value = this.basicInfoForm.value[key];
      formData.append(key, value);
    }

    this.subscriberServices.update_subscriber(this.currentUser.user_id,formData).subscribe(
      data=>{
        if(!(JSON.parse(JSON.stringify(data))['err']))
        {
          this.showLoader = true;
          this.localStorageService.setter('username',this.name.value);
          this.route.params.subscribe(routeParams => {
            this.getCurrentUser(routeParams.user_id);
          })
          this.snackBar.open(JSON.parse(JSON.stringify(data))['msg'],null,{duration : 5000});
          this.showLoader = false;
        }
        else
        {
          this.snackBar.open(JSON.parse(JSON.stringify(data))['err'],null,{duration : 5000});
        }
        this.showLoader = false;
      },
      err=>{
        this.snackBar.open("Error in updating the basic info of " + this.currentUser.name,null,{duration : 5000})
        this.showLoader = false;
      }
    )
  }

  addSocialLink(): void {
    let value = this.newSocialLink;
    if(value != '')
    {
    this.socialLinks.push({link_url : value.trim()});
    this.newSocialLink = '';
    }

  }

  addInterest(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.personalInterests.push({interest: value.trim()});
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeInterest(interest: PersonaInterest): void {
    const index = this.personalInterests.indexOf(interest);

    if (index >= 0) {
      this.personalInterests.splice(index, 1);
    }
  }

  removeSocialLink(link: SocialProfile): void {
    const index = this.socialLinks.indexOf(link);

    if (index >= 0) {
      this.socialLinks.splice(index, 1);
    }
  }

    dropSocialLink(event: CdkDragDrop<SocialProfile[]>) {
      moveItemInArray(this.socialLinks, event.previousIndex, event.currentIndex);
    }

    getuserMetas(user_id : string)
    {
      this.showLoader=true;
      this.subscriberServices.get_user_metas(user_id).subscribe(
        data=>{
          this.userMetas = data;
          if(this.userMetas != null && this.userMetas.social_profiles != undefined)
          {
            this.socialLinks = this.userMetas.social_profiles as SocialProfile[];
          }
          if(this.userMetas != null && this.userMetas.personal_info != undefined)
          {
            this.user_gender = this.userMetas.personal_info.gender ? this.userMetas.personal_info.gender : '';
            this.personalInterests = this.userMetas.personal_info.interested_in ? JSON.parse(this.userMetas.personal_info.interested_in) as PersonaInterest[]: [];
            this.personalDetailsForm.patchValue({
              bio : this.userMetas.personal_info.bio ? this.userMetas.personal_info.bio : '',
              dob : this.userMetas.personal_info.dob ? 
              JSON.stringify(JSON.parse(this.userMetas.personal_info.dob)).split('T')[0].substr(1) : ''
            })
          }
          if(this.userMetas !=null && this.userMetas.settings.visibility != undefined)
          {
            this.visibilitySettings = this.userMetas.settings.visibility;
          }
          this.showLoader = false;
        },
        err=>
        {
            this.showLoader = false;
        }
      )
    }

    isDefaultInstitute(organisation_id) : Boolean
    {
      if(this.localStorageService.getter('default_institute') != null)
      {
        if(this.localStorageService.getter('default_institute').organisation_id == organisation_id)
        {
          return true;
        }
      }
      return false;

    }
    saveSocialProfile()
    {
      this.showLoader = true;
      this.subscriberServices.update_social_profile(this.currentUser.user_id,this.socialLinks).subscribe(
        data=>{
          if(!(JSON.parse(JSON.stringify(data))['err']))
          {
            
            this.snackBar.open(JSON.parse(JSON.stringify(data))['msg'],null,{duration : 5000});
            location.reload();
          }
          else
          {
            this.snackBar.open(JSON.parse(JSON.stringify(data))['err'],null,{duration : 5000});
          }
          this.showLoader = false;
        },
        err=>{
          this.snackBar.open("Error in updating Social Profiles",null,{duration : 5000});
          this.showLoader = false;
        }
      )
    }

    savePersonalInfo()
    {
      let formData = new FormData();
      let dateofbirth;
      if(this.dob.value)
      {
        dateofbirth = new Date(this.dob.value.toString());
        dateofbirth.setDate(dateofbirth.getDate()+1);
      }
      formData.append('bio' , this.bio.value);
      formData.append('gender',this.user_gender);
      formData.append('dob',this.dob.value  ? JSON.stringify(dateofbirth): '');
      formData.append('interested_in',JSON.stringify(this.personalInterests));
      this.subscriberServices.update_personal_info(this.currentUser.user_id,formData).subscribe(
        data=>{
          if(!(JSON.parse(JSON.stringify(data))['err']))
          {
            this.snackBar.open(JSON.parse(JSON.stringify(data))['msg'],null,{duration : 5000});
          }
          else
          {
            this.snackBar.open(JSON.parse(JSON.stringify(data))['err'],null,{duration:5000});
          }
        },
        err=>{
          this.snackBar.open("Error in updating Personal Info : " + err,null,{duration : 5000});
        }
      )
    }


    getInstituteAndRole(user_id : string)
    {
      this.roleAccessService.getRoleAccess(user_id).subscribe(
        data=>{
          if(!(JSON.parse(JSON.stringify(data))['err']))
          {
            this.instituteList = data['ins'];
            this.roleList = data['role'];
          }
          else
          {
            this.snackBar.open(JSON.parse(JSON.stringify(data))['err'],null,{duration:5000});
          }
          //this.showLoader=false;
        },
        err=>{
          this.snackBar.open("Error in Loading Institutes" + err,null,{duration : 5000});
          //this.showLoader=false;
        }
       
         
        
      )
    }

    getRoles(institute_id : string) 
    {
      let instRole = this.roleList.filter(value => {
        return value.institute_id == institute_id &&  value.user_id == this.currentUser.user_id;
      })

      return instRole;
    }

    isRoleExpired(role) : boolean
    {
      let currentDate = new Date().toDateString();
      if(role.valid_upto == '' || role.valid_upto == null)
      {
        return false;
      }
      if(new Date(currentDate.split('T')[0]) > new Date(role.valid_upto.split('T')[0]))
      {
        return true;
      }
      return false;
    }

    isSysAdmin()
    {
     let sysadmin = this.roleList.filter(value => {
       return  value.role == 'SADMIN' && value.user_id == this.currentUser.user_id
       
     })
     return sysadmin;
    }
   

}
