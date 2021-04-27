import { ChangeDetectionStrategy,Component, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem,CdkDrag} from '@angular/cdk/drag-drop';
import { InstituteManagementService } from 'src/app/modules/library/service/institute-management.service';
import {config} from 'src/conf';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { RoleAccessService } from 'src/app/shared/services/role-access.service';
import { SessionStorageService } from 'src/app/shared/services/session-storage.service';
import { LibraryCategoryService } from 'src/app/modules/library/service/library-category.service';
import { SubscriberService } from 'src/app/modules/library/service/subscriber.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-view-institute',
  templateUrl: './view-institute.component.html',
  styleUrls: ['./view-institute.component.css']
})
export class ViewInstituteComponent implements OnInit {

 showLoader = true;
  public current_institute;
 
  
  url = "assets/images/user.png";
  iconUrl = config.host + "avatar/";
  imgUrl = config.host + "organisation_logo/";
  studentCount ="";
  adminCount = "";
  contentCount="";
  institute_id;
  currentUser;
  valid_upto="";
  na_search="";
  admin_search="";
  cadmin_search="";
  student_search="";
  minDate : Date;
  isLoadMore=true;
  isShowLess=false;
  subscriptionCategories=[];
  initialPage = 1;
  usersPerPage = 5;
  constructor(private instituteService : InstituteManagementService, private _snackbar : MatSnackBar,
    private route : ActivatedRoute, private roleAccessService : RoleAccessService, private sessionStorageService : SessionStorageService,
    private libCategoryService : LibraryCategoryService,private localStorageService : LocalStorageService,
     private subscriberService : SubscriberService) { 
      this.minDate  = new Date() ;
     }

    
  ngOnInit(): void {
    
    this.institute_id=this.route.snapshot.paramMap.get('id');
    this.currentUser = this.localStorageService.getter('user');
    this.get_institute(this.route.snapshot.paramMap.get('id'));
    this.getPeopleCount(this.route.snapshot.paramMap.get('id'));
    this.getPeopleByRole(this.route.snapshot.paramMap.get('id'));
    this.getSubscriptionCategories(this.route.snapshot.paramMap.get('id'));
    
  }

 getPeopleByRole(institute_id)
 {
   this.showLoader=true;
   this.subscriberService.get_user_by_role_institute(institute_id,'IADMIN').subscribe(
     data=>{
       this.admin=data as Array<any>;
       this.searchadmin = this.admin;
     }
   );

   this.subscriberService.get_user_by_role_institute(institute_id,'CADMIN').subscribe(
    data=>{
      this.content_admin=data as Array<any>;
      this.searchcadmin = this.content_admin;
    }
  );

  this.subscriberService.get_user_by_role_institute(institute_id,'STUDENT').subscribe(
    data=>{
      this.student=data as Array<any>;
      this.searchstudent = this.student;
    }
  );

  this.subscriberService.get_unassigned_user(institute_id,this.usersPerPage,this.initialPage).subscribe(
    data=>{
      this.not_assigned = data as Array<any>;
      this.showLoader=false;
    }
  )
 }

 loadMore()
 {
   this.showLoader=true;
   this.initialPage = this.initialPage+1;
   let prelen , afterlen;
   this.subscriberService.get_unassigned_user(this.institute_id,this.usersPerPage,this.initialPage)
   .subscribe(
     data=>{
       prelen = this.not_assigned.length;
       this.not_assigned = data as Array<any>;
        afterlen = this.not_assigned.length;
          if(prelen == afterlen)
    {
      this.isLoadMore=!this.isLoadMore;
      this.isShowLess=!this.isShowLess;
    }
    this.showLoader=false;
        
     }
   )
   
   

 }

 showLess()
 {
   this.showLoader=true;
   this.initialPage = this.initialPage-1;
   this.subscriberService.get_unassigned_user(this.institute_id,this.usersPerPage,this.initialPage)
   .subscribe(
     data=>{
       this.not_assigned = data as Array<any>;
       if(this.initialPage == 1)
   {
     this.isLoadMore = !this.isLoadMore;
     this.isShowLess = !this.isShowLess;
   }
   this.showLoader=false;

     }
   )
   

 }

 



  admin = [];
  searchadmin = [];
  content_admin = [];
  searchcadmin=[];
  not_assigned=[];
  
  student = [];
  searchstudent=[];

  drop(event: CdkDragDrop<string[]>) {
    let idx=event.container.data.indexOf(event.previousContainer.data[event.previousIndex]);
      if(idx != -1){
        return;
      }
      if(event.previousContainer.data[event.previousIndex]['user_id'] == this.currentUser.user_id)
      {
        this._snackbar.open("You don't have access to set your own  access permissions");
        return ;
      }
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
      let selectedUser = event.container.data[event.currentIndex]
      if(event.container.id == 'cdk-drop-list-1')
      {
         this.giveAccess(selectedUser['user_id'],this.institute_id,'IADMIN','user');
      }
      else if(event.container.id == 'cdk-drop-list-2')
      {
         this.giveAccess(selectedUser['user_id'],this.institute_id,'CADMIN','user');
      }
      else if(event.container.id == 'cdk-drop-list-3')
      {
         this.giveAccess(selectedUser['user_id'],this.institute_id,'STUDENT','user');
      }
      else if(event.container.id == 'cdk-drop-list-0')
      {
        this.roleAccessService.removeRoleAccess(this.institute_id,selectedUser['user_id']).subscribe(
          data=>{
            if(!(JSON.parse(JSON.stringify(data))['err']))
            {
              this.getPeopleByRole(this.institute_id);
            }
            else
            {
              this._snackbar.open(JSON.parse(JSON.stringify(data))['err'],null,{duration : 5000});
            }
          },
          err=>{
            this._snackbar.open("Error in Removing Access ! Please try after few minutes", null , {duration : 5000} );
          }
        )
      }
      
     
    }
  }

  register()
  {
    var res=confirm("This will send for an approval request to admin of"+
    this.current_institute.organisation_name+". Are you sure ?" );
    if(res)
    {
      this.giveAccess(this.currentUser.user_id,this.current_institute.organisation_id,
        'STUDENT','admin');
    }
  }



  giveAccess(users,institutes,role, approvalTo)
  {
    
      let formData = new FormData();
      let validupto : Date;
      if(this.valid_upto)
      {
        validupto = new Date(this.valid_upto);
        validupto.setDate(validupto.getDate()+1);
      }   
      formData.append('users', users);
      formData.append('institutes',institutes);
      formData.append('role',role);
      formData.append('valid_upto', this.valid_upto ? validupto.toDateString() : '');
      formData.append('approval',approvalTo);
      this.roleAccessService.giveRoleAccess(formData).subscribe(
        data=>{
          if(!(JSON.parse(JSON.stringify(data))['err']))
          {
            this.getPeopleByRole(this.institute_id);
          }
          else
          {
            this._snackbar.open(JSON.parse(JSON.stringify(data))['err'],null,{duration : 5000});
          }
        },
        err=>{
          this._snackbar.open("Error in Giving Access ! Please try after few minutes", null , {duration : 5000} );
        }
      )
    
  }
  

  getSubscriptionCategories(institute_id)
  {
    this.libCategoryService.getSubscriptionCategoriesById(institute_id).subscribe(
      data => {
        this.subscriptionCategories = data as Array<any>;
      },
      err => {
        this._snackbar.open("Error in loading Article Category",null,{duration : 5000});
      }
    )
  }
  getPeopleCount(institute_id)
  {
    this.roleAccessService.getPeopleCount(institute_id,"CADMIN").subscribe(
      data=>{
        this.contentCount = JSON.stringify(data);
      },
      err=>{
        this._snackbar.open(JSON.stringify(err),null,{duration:5000});
      }
    )
    this.roleAccessService.getPeopleCount(institute_id,"IADMIN").subscribe(
      data=>{
        this.adminCount = JSON.stringify(data);
      },
      err=>{
        this._snackbar.open(JSON.stringify(err),null,{duration:5000});
      }
    )
    this.roleAccessService.getPeopleCount(institute_id,"STUDENT").subscribe(
      data=>{
        this.studentCount = JSON.stringify(data);
      },
      err=>{
        this._snackbar.open(JSON.stringify(err),null,{duration:5000});
      }
    )
  }


  get_institute(id:String)
  {
    
    this.instituteService.view_institute(id).subscribe(
      data=>{
        this.current_institute = data[0];
        this.url = this.current_institute.avatar ? this.imgUrl + this.current_institute.avatar : "assets/images/insimg.png";
        
      },
      err=>{
        this._snackbar.open("Error in Loading the Institute with id :" + this.route.snapshot.paramMap.get('id'),null,{duration : 5000});
        
      }
    )
  }

 

  filter(event:Event, role : string)
  {
    const searchkey = (event.target as HTMLInputElement).value.trim();  
    if(role == 'admin'){
    this.admin = this.searchadmin.filter(value=>{
      return (
        value.name.toLowerCase().includes(searchkey.toLowerCase())
        || value.user_id.toLowerCase().includes(searchkey.toLowerCase())
        || value.phone.toLowerCase().includes(searchkey.toLowerCase())
        || value.email.toLowerCase().includes(searchkey.toLowerCase())
        );
    })  }

    if(role == 'cadmin'){
      this.content_admin = this.searchcadmin.filter(value=>{
        return (
          value.name.toLowerCase().includes(searchkey.toLowerCase())
          || value.user_id.toLowerCase().includes(searchkey.toLowerCase())
          || value.phone.toLowerCase().includes(searchkey.toLowerCase())
          || value.email.toLowerCase().includes(searchkey.toLowerCase())
          );
      })  }

      if(role == 'student'){
        this.student = this.searchstudent.filter(value=>{
          return (
            value.name.toLowerCase().includes(searchkey.toLowerCase())
            || value.user_id.toLowerCase().includes(searchkey.toLowerCase())
            || value.phone.toLowerCase().includes(searchkey.toLowerCase())
            || value.email.toLowerCase().includes(searchkey.toLowerCase())
            );
        })  }

        if(role == 'na')
        {
          if(searchkey != ''){
          this.subscriberService.get_unassigned_user_by_search(this.institute_id,searchkey)
          .subscribe(
            data=>{
            this.not_assigned = data as Array<any>;
            }
          )}
          else
          {
            this.subscriberService.get_unassigned_user(this.institute_id,this.usersPerPage,this.initialPage).subscribe(
              data=>{
                this.not_assigned = data as Array<any>;
              }
            )
          }
        }
  }


  





}

