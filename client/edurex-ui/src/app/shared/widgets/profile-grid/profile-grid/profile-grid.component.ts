import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/modules/library/modules/subscriber-management/models/subscriber';
import { config } from 'src/conf';
import { FormControl } from '@angular/forms';
import { LibraryCategoryService } from 'src/app/modules/library/service/library-category.service';
import { FileValidator } from 'ngx-material-file-input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { SubscriberService } from 'src/app/modules/library/service/subscriber.service';

@Component({
  selector: 'app-profile-grid',
  templateUrl: './profile-grid.component.html',
  styleUrls: ['./profile-grid.component.css']
})
export class ProfileGridComponent implements OnInit {

  @Input()
  selectedUser : User;

  @Input()
  enabledSubtitle ?: boolean=true ;

  @Input()
  mode ?: string = 'small';

  @Input()
  enabeledEditImage ?:boolean = false;

  @Input()
  enabeledDetails ?: boolean = true;

  @Input()
  enabeledSocialLins ?: boolean = true;

  imgUrl = config.host + "avatar/";
  constructor(private libCategoryServices : LibraryCategoryService, private _snackbar : MatSnackBar,
    public dialog : MatDialog, private subscriberService : SubscriberService) { }

  ngOnInit(): void {

  }

  logo = new FormControl();
  configParams;
  thumbnailprogress = 0;
  url =  "assets/images/user.png" ;
  
  open(content)
  {
    this.url = this.selectedUser.avatar ? this.imgUrl + this.selectedUser.avatar : this.url;
    const dialogRef = this.dialog.open(content);
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

  getConfigParams()
  {
    this.libCategoryServices.getConfigParameters().subscribe(
      data=>{
        if(!JSON.parse(JSON.stringify(data))['err'])
        {
          this.configParams = data[0];
          this.logo.setValidators([FileValidator.maxContentSize(this.configParams.avatar_size*1024*1024)]);
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
}
