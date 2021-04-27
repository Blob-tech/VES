import { Component, OnInit, Input, Output, EventEmitter, DoCheck } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NavbarService } from './navbar.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileValidator } from 'ngx-material-file-input';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { config } from "src/conf";
import { threadId } from 'worker_threads';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { SubscriberService } from 'src/app/modules/library/service/subscriber.service';
import { RoleAccessService } from 'src/app/shared/services/role-access.service';
import { duration } from 'moment';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers :[NgbModalConfig,NgbModal],
})
export class NavbarComponent implements OnInit, DoCheck {
  
  themeList :String[] = ["indigo-pink","pink-bluegrey","teal-cyan","yellow-brown","deeppurple-amber","lime-blue","light-green-grey","red-white"]
  constructor(config: NgbModalConfig, private modalService: NgbModal,private formBuilder : FormBuilder,
    private navbarService : NavbarService, private _snackbar : MatSnackBar,private route : Router,
    private localStorageService : LocalStorageService ,private subscriberService : SubscriberService,
    private roleAccessService : RoleAccessService) {
    config.backdrop = 'static';
    config.keyboard = false;

   }

   counterList;
   brand;
   dark_mode;
   imgUrl:String;
   profileUrl : String;
   url = "assets/images/doc.png";
   thumbnailprogress:Number = 0;
   loggedinUser=null;
   loggedinUsername;
   loggedinAvatar;
   profileViewUrl='/';
   roles;
  ngOnInit(): void {

    this.getCounterList();
    this.getSystemBranding();
    this.dark_mode = this.localStorageService.getter("dark-mode") == "true" ? true : false;
    this.imgUrl = config.host + "system/icon.png";
    this.profileUrl = config.host + "avatar/";
    if(this.localStorageService.getter('user') != null)
    {
    this.subscriberService.get_subscriber_by_id(this.localStorageService.getter('user').user_id).subscribe(
      data=>{
        this.loggedinUser = data;
        this.loggedinUsername = data['name'];
        this.loggedinAvatar = data['avatar'];
        this.localStorageService.setter('username',this.loggedinUsername);
        this.localStorageService.setter('avatar',this.loggedinAvatar);
        this.profileViewUrl = '/e-library/profile/self/' + this.loggedinUser.user_id;
      }
    )
    }
    
    
  }

  ngDoCheck()
  {
    this.loggedinUser = this.localStorageService.getter('user');
    this.loggedinUsername = this.localStorageService.getter('username');
    this.loggedinAvatar = this.localStorageService.getter('avatar');
  }

 
  counterForm = this.formBuilder.group( { 
 
    library : ['',Validators.required],
    library_prefix : ['',Validators.required],
    user : ['',Validators.required],
    user_prefix : ['', Validators.required],
    organisation : ['', Validators.required],
    organisation_prefix : ['', Validators.required],
    course : ['', Validators.required],
    course_prefix : ['', Validators.required]
  })

  systemForm = this.formBuilder.group({
    name : ['',Validators.required],
    tagline : ['',[Validators.required]],
    icon_width : ['',[Validators.required]]
  })

  cover = new FormControl('',[Validators.required,FileValidator.maxContentSize(5*1024*1024)]);

   
    get library()
    {
      return this.counterForm.get('library');
    }

    get library_prefix()
    {
      return this.counterForm.get('library_prefix');
    }
    get user()
    {
      return this.counterForm.get('user');
    }
    get user_prefix()
    {
      return this.counterForm.get('user_prefix');
    }

    get organisation()
    {
      return this.counterForm.get('organisation');
    }

    get organisation_prefix()
    {
      return this.counterForm.get('organisation_prefix');
    }

    get course()
    {
      return this.counterForm.get('course');
    } 

    get course_prefix()
    {
      return this.counterForm.get('course_prefix');
    } 


    get name()
    {
      return this.systemForm.get('name');
    }

    
    get tagline()
    {
      return this.systemForm.get('tagline');
    }

    get icon_width()
    {
      return this.systemForm.get('icon_width');
    }

    ThumbnailFile : any;
  onSelectThumbnail(event) {
    this.thumbnailprogress = 0;
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      this.ThumbnailFile = event.target.files[0]
      reader.onload = (event: any) => {
        this.thumbnailprogress = Math.round(100 * event.loaded / event.total);
        this.url = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }
  

  @Output("toggleDarkness")
  toggleDarkness : EventEmitter<any> = new EventEmitter();

  @Output("setTheme")
  setTheme : EventEmitter<String> = new EventEmitter<String>();

  changeTheme(theme : String)
  {
    
    this.subscriberService.set_theme(theme,this.dark_mode,this.loggedinUser.user_id).subscribe(
      data=>{
        if(!JSON.parse(JSON.stringify(data))['err'])
        {
          this.setTheme.next(theme);
          this.localStorageService.setter('theme',theme);
        }
        else
        {
          this._snackbar.open(JSON.parse(JSON.stringify(data))['err'],null,{duration : 5000});
        }

      },
      err=>{
        this._snackbar.open("Error in setting theme !",null,{duration : 5000});
      }
    )
    
  }


  toggleDarkMode()
  {
      
      this.subscriberService.set_theme(this.localStorageService.getter('theme'),!this.dark_mode,this.loggedinUser.user_id).subscribe(
        data=>{
          if(!JSON.parse(JSON.stringify(data))['err'])
          {
            this.toggleDarkness.emit();
            this.localStorageService.setter('dark_mode',this.dark_mode);
            this.dark_mode = this.localStorageService.getter("dark-mode") == "true" ? true : false;
          }
          else
          {
            this._snackbar.open(JSON.parse(JSON.stringify(data))['err'],null,{duration : 5000});
          }
  
        },
        err=>{
          this._snackbar.open("Error in setting theme !",null,{duration : 5000});
        }
      )
  }

  open(content)
  {
    this.modalService.open(content,{size : 'lg',centered : true})
  }

  getCounterList()
  {
    this.navbarService.getCounterList().subscribe(
      data=>{
      this.counterList = data;
      this.counterForm.patchValue({
        library : this.counterList[0].library,
        library_prefix : this.counterList[0].library_prefix,
        user : this.counterList[0].user,
        user_prefix : this.counterList[0].user_prefix,
        organisation : this.counterList[0].organisation,
        organisation_prefix : this.counterList[0].organisation_prefix,
        course : this.counterList[0].course,
        course_prefix : this.counterList[0].course_prefix},
        {emitEvent : true});
      },
      err=>{
        this._snackbar.open("Error in loading counter", null, {duration : 5000});
      }
    )
  }

  logout()
  {
    localStorage.clear();
    sessionStorage.clear();
    this.route.navigateByUrl('/login').then(()=>{
      window.location.reload();
    });
  }

  getSystemBranding()
  {
    this.navbarService.getSystemBranding().subscribe(
      data=>{
        this.brand = data;
        this.systemForm.patchValue({name : this.brand[0].name,tagline : this.brand[0].tagline,
        icon_width : this.brand[0].icon_width},
          {emitEvent : true});
        },
        err=>{
          this._snackbar.open("Error in loading brand", null, {duration : 5000});
        }
      
    )
  }

  updateCounter(value : String, param : String)
  {
    var res = confirm("These will lead to duplicate ID and conflict in Entity Creation. Are you sure you want to update the counter value");
    if(res)
    {
    this.navbarService.updateCounter(value,param).subscribe(

      data=>{
        if(!JSON.parse(JSON.stringify(data))['err'])
        {
          this.getCounterList();
          this._snackbar.open(JSON.parse(JSON.stringify(data))['msg'],null,{duration : 5000});
          this.modalService.dismissAll();
        }
        else
        {
          this._snackbar.open(JSON.parse(JSON.stringify(data))['err'],null,{duration : 5000});
        }
      },
      err=>{
        this._snackbar.open("Error in updating  counter ",null,{duration : 500});
      }
    )
  }
}
  
  updateBrand()
  {
    var res = confirm("Are you sure you want to change company logo");
    if(res)
    {
    this.navbarService.updateBrand(this.name.value,this.tagline.value,this.icon_width.value).subscribe(

      data=>{
        if(!JSON.parse(JSON.stringify(data))['err'])
        {
          this.getSystemBranding();
          this._snackbar.open(JSON.parse(JSON.stringify(data))['msg'],null,{duration : 5000});
          this.modalService.dismissAll();
        }
        else
        {
          this._snackbar.open(JSON.parse(JSON.stringify(data))['err'],null,{duration : 5000});
        }
      },
      err=>{
        this._snackbar.open("Error in updating system branding ",null,{duration : 500});
      }

    )
    }
  }



  save_icon()
  {
    var res=confirm("Are you sure you want to change Brand icon ?")
    if(res)
    {
    let formData = new FormData()
    formData.append('icon',this.ThumbnailFile);
    this.navbarService.updateicon(formData).subscribe(

      data=>{
      if(!JSON.parse(JSON.stringify(data))['err'])
        {
          
          this._snackbar.open("Brand Icon updated successfully",null,{duration : 5000});
          this.modalService.dismissAll();
          window.location.reload();
        }
        else
        {
          this._snackbar.open(JSON.parse(JSON.stringify(data))['err'],null,{duration : 5000});
        }
      },
      err=>{
        this._snackbar.open("Error in updating Icon' ",null,{duration : 500});
      }
    )
    }
  }


}
