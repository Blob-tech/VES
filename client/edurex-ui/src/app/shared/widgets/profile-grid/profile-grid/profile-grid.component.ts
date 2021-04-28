import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/modules/library/modules/subscriber-management/models/subscriber';
import { config } from 'src/conf';
import { FormControl, FormBuilder } from '@angular/forms';
import { LibraryCategoryService } from 'src/app/modules/library/service/library-category.service';
import { FileValidator } from 'ngx-material-file-input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { SubscriberService } from 'src/app/modules/library/service/subscriber.service';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { RoleAccessService } from 'src/app/shared/services/role-access.service';
import { NavbarService } from 'src/app/components/navbar/navbar.service';

@Component({
  selector: 'app-profile-grid',
  templateUrl: './profile-grid.component.html',
  styleUrls: ['./profile-grid.component.css']
})
export class ProfileGridComponent implements OnInit {

  @Input()
  selectedUser : User;

  @Input()
  bio : string ='';

  @Input()
  enabledSubtitle ?: boolean=true ;

  @Input()
  mode ?: string = 'small';

  @Input()
  enabeledEditImage ?:boolean = false;

  @Input()
  enabeledDetails ?: boolean = true;

  @Input()
  enabeledBio ?: boolean =true;

  @Input()
  enabeledSocialLinks ?: boolean = true;

  @Input()
  viewMode ?:  string = 'self';

  imgUrl = config.host + "avatar/";
  coverUrl = config.host + "cover/";
  constructor(private libCategoryServices : LibraryCategoryService, private _snackbar : MatSnackBar,
    public dialog : MatDialog, private subscriberService : SubscriberService, private router : Router,
    private formBuilder : FormBuilder,private locaStorageService : LocalStorageService,
    private roleAccessService : RoleAccessService, private navbarService : NavbarService) { }

  ngOnInit(): void {

    this.getConfigParams();

  }

  //logo = new FormControl();
  configParams;
  thumbnailprogress = 0;
  url =  "assets/images/user.png" ;
  coverurl = "assets/images/default-cover.jpg";
  
  isLoggedinUser()
  {
    return this.roleAccessService.isLoggedinUser(this.selectedUser.user_id);
  }

  open(content)
  {
    this.url = this.selectedUser.avatar ? this.imgUrl + this.selectedUser.avatar : this.url;
    this.coverurl = this.selectedUser.cover ? this.coverUrl + this.selectedUser.cover : this.coverurl;
    const dialogRef = this.dialog.open(content);
  }

  updateLogoForm = this.formBuilder.group({
    logo : [''],
    cover : ['']
  })

  get logo()
  {
    return this.updateLogoForm.get('logo');
  }

  get cover()
  {
    return this.updateLogoForm.get('cover');
  }
 
  
  imageFile : any
  onSelectThumbnail(event)
  {
    this.thumbnailprogress = 0;
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      this.imageFile = event.target.files[0]
      reader.onload = (event: any) => {
        this.thumbnailprogress = Math.round(100 * event.loaded / event.total);
        this.url = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
    }

  }

  coverFile : any
  onSelectCover(event)
  {
    this.thumbnailprogress = 0;
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      this.coverFile = event.target.files[0]
      reader.onload = (event: any) => {
        this.thumbnailprogress = Math.round(100 * event.loaded / event.total);
        this.coverurl = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
    }

  }


  getConfigParams()
  {
    this.navbarService.getSystemBranding().subscribe(
   // this.libCategoryServices.getConfigParameters().subscribe(
      data=>{
        if(!JSON.parse(JSON.stringify(data))['err'])
        {
          this.configParams = data[0];
          this.updateLogoForm.get('logo').setValidators([FileValidator.maxContentSize(this.configParams.avatar_size*1024*1024)]);
          this.updateLogoForm.get('cover').setValidators([FileValidator.maxContentSize(this.configParams.cover_size*1024*1024)]);
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

  viewProfile(user_id : string)
  {
    if(this.mode == 'small')
    {
      this.router.navigateByUrl("/e-library/profile/public/"+user_id);
    }
    
  }

  save_profile_image()
  {
    let formData = new FormData()
    formData.append('logo',this.imageFile);
    this.subscriberService.update_profile_image(formData,this.selectedUser.user_id.toString().trim()).subscribe(
      data=>{
        if(JSON.parse(JSON.stringify(data))['msg'])
        {
          this._snackbar.open(JSON.parse(JSON.stringify(data))['msg'],null,{duration:5000});
          this.subscriberService.get_subscriber_by_id(this.selectedUser.user_id).subscribe(
            data=>{
              if(!JSON.parse(JSON.stringify(data))['err'])
              {
                this.selectedUser = data as User;
                this.locaStorageService.setter('avatar',data['avatar']);
              }
              else
              {
                this._snackbar.open(JSON.parse(JSON.stringify(data))['err'],null,{duration:5000});
              }
              
            },
            err=>
            {
              this._snackbar.open("Error in updating profile image : " + err,null,{duration:5000});
            }
          )
        }
        else
        {
          this._snackbar.open(JSON.parse(JSON.stringify(data))['err'],null,{duration:5000});       
        }
      },
      err => {
        this._snackbar.open("Error in updating profile image : " + err,null,{duration:5000});
      } 

    )
  }

  save_profile_cover()
  {
    let formData = new FormData()
    formData.append('cover',this.coverFile);
    this.subscriberService.update_profile_cover(formData,this.selectedUser.user_id.toString().trim()).subscribe(
      data=>{
        if(JSON.parse(JSON.stringify(data))['msg'])
        {
          this._snackbar.open(JSON.parse(JSON.stringify(data))['msg'],null,{duration:5000});
          this.subscriberService.get_subscriber_by_id(this.selectedUser.user_id).subscribe(
            data=>{
              if(!JSON.parse(JSON.stringify(data))['err'])
              {
                this.selectedUser = data as User;
              }
              else
              {
                this._snackbar.open(JSON.parse(JSON.stringify(data))['err'],null,{duration:5000});
              }
              
            },
            err=>
            {
              this._snackbar.open("Error in updating profile image : " + err,null,{duration:5000});
            }
          )
        }
        else
        {
          this._snackbar.open(JSON.parse(JSON.stringify(data))['err'],null,{duration:5000});       
        }
      },
      err => {
        this._snackbar.open("Error in updating profile image : " + err,null,{duration:5000});
      } 

    )
  }

  remove_profile_image()
  {
    var res = confirm("Are you sure you want to remove the profile image ?");
    {
      if(res == true)
      {
        this.subscriberService.remove_profile_image(this.selectedUser.user_id).subscribe(
          data=>{
            if(!JSON.parse(JSON.stringify(data))['err'])
              {
                this.subscriberService.get_subscriber_by_id(this.selectedUser.user_id).subscribe(
                  data=>{
                    if(!JSON.parse(JSON.stringify(data))['err'])
                    {
                      this.selectedUser = data as User;
                      this.locaStorageService.setter('avatar',data['avatar']);
                    }
                    else
                    {
                      this._snackbar.open(JSON.parse(JSON.stringify(data))['err'],null,{duration:5000});
                    }
                  },
                  err=>{
                    this._snackbar.open("Error in removing profile image : " + err,null,{duration:5000});
                  })
              }
              else
              {
                this._snackbar.open(JSON.parse(JSON.stringify(data))['err'],null,{duration:5000});
              }

          }
        )
      }
    }
  }

  remove_profile_cover()
  {
    var res = confirm("Are you sure you want to remove the profile cover ?");
    {
      if(res == true)
      {
        this.subscriberService.remove_profile_cover(this.selectedUser.user_id).subscribe(
          data=>{
            if(!JSON.parse(JSON.stringify(data))['err'])
              {
                this.subscriberService.get_subscriber_by_id(this.selectedUser.user_id).subscribe(
                  data=>{
                    if(!JSON.parse(JSON.stringify(data))['err'])
                    {
                      this.selectedUser = data as User;
                    }
                    else
                    {
                      this._snackbar.open(JSON.parse(JSON.stringify(data))['err'],null,{duration:5000});
                    }
                  },
                  err=>{
                    this._snackbar.open("Error in removing profile cover : " + err,null,{duration:5000});
                  })
              }
              else
              {
                this._snackbar.open(JSON.parse(JSON.stringify(data))['err'],null,{duration:5000});
              }

          }
        )
      }
    }
  }
}
