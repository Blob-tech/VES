import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriberService } from 'src/app/modules/library/service/subscriber.service';
import { InstituteManagementService } from 'src/app/modules/library/service/institute-management.service';
import { Institute } from 'src/app/modules/library/modules/institute-management/models/institute';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';import { now } from 'moment';
import { RoleAccessService } from '../../services/role-access.service';
import { SessionStorageService } from '../../services/session-storage.service';
import {config} from 'src/conf';
import { ServerTimeService } from '../../services/server-time.service';



@Component({
  selector: 'app-manage-access',
  templateUrl: './manage-access.component.html',
  styleUrls: ['./manage-access.component.css']
})
export class ManageAccessComponent implements OnInit {

  @Input()
  disabled ?: boolean = false;

  @Input()
  access_id = '';

  @Input()
  user_id ? : string = "";

  @Input()
  mode ?: string= 'institute';

  @Input()
  system_admin ?: boolean = false;

  @Input()
  institute ? : string = "";

  minDate : Date;
  

  accessList = [];
  currentRole=null;
  currentInstitute=null;
  badgeValue='';
  imgUrl = config.host + "organisation_logo/";
  currentDate=null;
  approveAccessRole = 'STUDENT';
  constructor(private formBuilder : FormBuilder, private subscriberServices : SubscriberService,
    private instituteService : InstituteManagementService, private _snacbar : MatSnackBar,
    public dialog: MatDialog, private roleAccessService : RoleAccessService,
    private sessionStorageService : SessionStorageService,private serverTimeService : ServerTimeService)
     {
       this.minDate  = new Date() ;

      }

  ngOnInit(): void {
    if(this.mode == 'institute')
    {
    
      this.getInstituteById(this.institute);
      this.getCurrentRoleAccess(this.access_id,this.institute);
    }
    this.serverTimeService.getServerTime().subscribe(
      data=>{
        this.currentDate=data;
      }
    );
  }

  initializeBadgeValue()
  {
    if(this.currentRole)
    {
      if(this.isRoleExpired(this.currentRole))
      {
        this.badgeValue = 'E';
      }
    }
    else
    {
      this.badgeValue = 'N';
    }
  }

  changeApproveRole(role : string)
  {
    this.approveAccessRole=role;
  }

  removeAccess()
  {
    var res = confirm("Are you sure to remove this user permanently from our organisation ?");
    if(res)
    {
      this.roleAccessService.removeRoleAccess(this.institute,this.access_id).subscribe(
        data=>{
          if(!(JSON.parse(JSON.stringify(data))['err']))
          {
            this._snacbar.open(JSON.stringify(data['msg']),null, {duration : 5000});
            this.getCurrentRoleAccess(this.access_id,this.institute);
          }
          else
          {
            this._snacbar.open("Error in removing access : " + JSON.stringify(data['err']),null, {duration : 5000});
            
          }
        },
        err => {
          this._snacbar.open("Error in removing access :"+ JSON.stringify(err),null, {duration : 5000});
            
        }
      )
    }
  }
  getInstituteById(id : string)
  {
    this.instituteService.view_institute(id).subscribe(
      data=>{
        this.currentInstitute = data[0];
      },
      err=>{
        this._snacbar.open("Error in getting Institute" + err);
      }
    )
  }
  isRoleExpired(role) : boolean
    {
      
      let currentDate = this.currentDate;
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
  
    revokeAccess()
    {
      var res=confirm("Are you sure you want to revoke this user access ?");
      if(res)
      {
        if(!this.system_admin){
        this.roleAccessService.toggleAccess(this.access_id,this.institute,"revoke").subscribe(
          data=>{
            if(!(JSON.parse(JSON.stringify(data))['err']))
            {
              this._snacbar.open(JSON.stringify(data['msg']),null, {duration : 5000});
              this.getCurrentRoleAccess(this.access_id,this.institute);
            }
            else
            {
              this._snacbar.open("Error in revoking access : " + JSON.stringify(data['err']),null, {duration : 5000});
              
            }
          },
          err => {
            this._snacbar.open("Error in revoking access :"+ err,null, {duration : 5000});
              
          }
        )}
        else
        {
          this.roleAccessService.toggleSystemAccess(this.access_id,"revoke").subscribe(
            data=>{
              if(!(JSON.parse(JSON.stringify(data))['err']))
              {
                this._snacbar.open(JSON.stringify(data['msg']),null, {duration : 5000});
                this.getCurrentRoleAccess(this.access_id,this.institute);
              }
              else
              {
                this._snacbar.open("Error in revoking access : " + JSON.stringify(data['err']),null, {duration : 5000});
                
              }
            },
            err => {
              this._snacbar.open("Error in revoking access :"+ err,null, {duration : 5000});
                
            }
          )
        }
      }
    }

    renewAccess()
    {
      var res=confirm("Are you sure you want to renew this user access ?");
      if(res)
      {
        if(!this.system_admin){
        this.roleAccessService.toggleAccess(this.access_id,this.institute,"renew").subscribe(
          data=>{
            if(!(JSON.parse(JSON.stringify(data))['err']))
            {
              this._snacbar.open(JSON.stringify(data['msg']),null, {duration : 5000});
              this.getCurrentRoleAccess(this.access_id,this.institute);
            }
            else
            {
              this._snacbar.open("Error in renewing access : " + JSON.stringify(data['err']),null, {duration : 5000});
              
            }
          },
          err => {
            this._snacbar.open("Error in renewing access :"+ err,null, {duration : 5000});
              
          }
        )}
        else
        {
          this.roleAccessService.toggleSystemAccess(this.access_id,"renew").subscribe(
            data=>{
              if(!(JSON.parse(JSON.stringify(data))['err']))
              {
                this._snacbar.open(JSON.stringify(data['msg']),null, {duration : 5000});
                this.getCurrentRoleAccess(this.access_id,this.institute);
              }
              else
              {
                this._snacbar.open("Error in renewing access : " + JSON.stringify(data['err']),null, {duration : 5000});
                
              }
            },
            err => {
              this._snacbar.open("Error in renewing access :"+ err,null, {duration : 5000});
                
            }
          )
        }
      }
    }


  getCurrentRoleAccess(user_id,institute_id)
  {
    if(!this.system_admin){
    this.roleAccessService.getIndividualRoleAccess(user_id,institute_id).subscribe(
      data=>{
        if(!(JSON.parse(JSON.stringify(data))['err']))
        {
         this.currentRole = data;
         this.initializeBadgeValue();
        }
        else
        {
          this.currentRole=null;
          this._snacbar.open(JSON.stringify(data),null, {duration : 5000});
          
        }
      },
      err => {
        this.currentRole = null;
        this._snacbar.open("Error in retrieving user access "+ err,null, {duration : 5000});
          
      }
    )}
    else
    {
      this.roleAccessService.getSystemAdminAccess(user_id).subscribe(
        data=>{
          if(!(JSON.parse(JSON.stringify(data))['err']))
          {
           this.currentRole = data;
           console.log(this.currentRole);
          }
          else
          {
            this._snacbar.open(JSON.stringify(data),null, {duration : 5000});
            
          }
        },
        err => {
          this._snacbar.open("Error in retrieving user access "+ err,null, {duration : 5000});
            
        }
      )
    }
  }

  getActiveInstituteList(institute_id)
    {
      this.instituteService.get_institutes().subscribe(
        data=>{
          if(!(JSON.parse(JSON.stringify(data))['err']))
          {
            this.accessList = data as Institute[];
            this.accessList = this.accessList.filter(value => { return value.isActivated == true && value.organisation_id == institute_id});
          }
          else
          {
            this._snacbar.open("Error in loading institutes ! "+ data,null, {duration : 5000});
            
          }
        },
        err => {
          this._snacbar.open("Error in loading institutes from edurex database! "+ err,null, {duration : 5000});
            
        })
      // this.accessList = []
      // this.accessList.push(this.sessionStorageService.getter('current_institute'));
      }

    resetAccessList(event)
    {
      if(event.value.trim() == 'SADMIN')
      {
        this.access_list.setValue('');
      }
    }



  accessManagerForm = this.formBuilder.group(
    {
      role : ['',[Validators.required]],
      access_list : [''],
      valid_upto : [''],
    })

    regRequestForm = this.formBuilder.group(
      {
        reg_role:[''],
        reg_valid_upto :['']
      }
    )

  get reg_role()
  {
    return this.regRequestForm.get('reg_role');
  }

  get reg_valid_upto()
  {
    return this.regRequestForm.get('reg_valid_upto');
  }

  get role()
  {
    return this.accessManagerForm.get('role');
  }

  get access_list()
  {
    return this.accessManagerForm.get('access_list');
  }

  get valid_upto()
  {
    return this.accessManagerForm.get('valid_upto');
  }


  open(access_id,content)
  {
      const dialogref = this.dialog.open(content)
  }

  disabledGiveAccess() : boolean
  {
    if((this.role.value.toString() != 'SADMIN' && this.access_list.value.toString() == '')||
    this.role.value.toString() == '')
    {
      return true;
    }
    return false;
  }

  approveAccess()
  {
    this.roleAccessService.approveAccess(this.access_id,this.institute,'admin').subscribe(
      data=>{
        if(!(JSON.parse(JSON.stringify(data))['err']))
        {
          this._snacbar.open(JSON.parse(JSON.stringify(data))['msg'],null,{duration : 5000});
          this.getCurrentRoleAccess(this.access_id,this.institute);
        }
        else
        {
          this._snacbar.open(JSON.parse(JSON.stringify(data))['err'],null,{duration:5000});
        
        }
        
      },
      err=>{
        this._snacbar.open("Error in approving access" + JSON.stringify(err),null,{duration : 5000});
        
      }
    )
    
  }

  giveAccess()
  {
    var res = true;
    if(this.valid_upto.value.toString() == '')
    {
      res=confirm("You haven't select any date upto which the access will remain valid. This will lead to"
      +"the access for lifetime untill the access been manually removed. Are you sure you want to proceed ?");
    }

    if(res == true)
    {
      let formData = new FormData();
      let validupto : Date;
      if(this.valid_upto.value)
      {
        validupto = new Date(this.valid_upto.value);
        validupto.setDate(validupto.getDate()+1);
      }   
      formData.append('users', this.access_id);
      formData.append('institutes',this.access_list.value);
      formData.append('role',this.role.value);
      formData.append('valid_upto',this.valid_upto.value ? validupto.toDateString() : '');
      formData.append('approval','user');
      this.roleAccessService.giveRoleAccess(formData).subscribe(
        data=>{
          if(!(JSON.parse(JSON.stringify(data))['err']))
          {
            this._snacbar.open(JSON.parse(JSON.stringify(data))['msg'],null,{duration : 5000});
            this.getCurrentRoleAccess(this.access_id,this.institute);
          }
          else
          {
            this._snacbar.open(JSON.parse(JSON.stringify(data))['err'],null,{duration : 5000});
          }
        },
        err=>{
          this._snacbar.open("Error in Giving Access ! Please try after few minutes", null , {duration : 5000} );
        }
      )
    }
    
  }
}
