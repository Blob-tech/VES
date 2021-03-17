import { Component, OnInit, DoCheck } from '@angular/core';
import { RoleAccessService } from 'src/app/shared/services/role-access.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { config } from 'src/conf';
import { SubscriberService } from './service/subscriber.service';
import { filter } from 'minimatch';
import { Router } from '@angular/router';
import { Session } from 'inspector';
import { SessionStorageService } from 'src/app/shared/services/session-storage.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {

  roles;
  loggedinUser;
  insUrl;
  userMetas;
  default_ins;
  current_ins;
  current_role;
  showLoader = true;

  constructor(private roleAccessService :RoleAccessService, private localStorageService : LocalStorageService,
    private subscriberService : SubscriberService, private router : Router,private sessionStorageService : SessionStorageService) { }

  ngOnInit(): void {

    this.loggedinUser = this.localStorageService.getter('user');
    this.insUrl = config.host + 'organisation_logo/';
    if(this.loggedinUser)
    {
      this.getAccessRoles(this.loggedinUser.user_id);
    }
    
  }

  
  

  isSysAdmin()
    {
      let sysadmin = this.roles['role'].filter(value => {
       return  value.role == 'SADMIN' && value.user_id == this.loggedinUser.user_id
       
     })
     if(sysadmin.length == 0)
     {
       return false;
     }
     return true;
    }

  getAccessRoles(user_id)
  {
    this.roleAccessService.getRoleAccess(user_id).subscribe(
      data=>{
        if(!JSON.parse(JSON.stringify(data))['err'])
        {
          this.roles = data;
          this.getuserMetas(user_id);
        }
      }
    )
  }

  getuserMetas(user_id : string)
    {
      this.subscriberService.get_user_metas(user_id).subscribe(
        data=>{
          this.userMetas = data;
          this.default_ins = this.roles.ins.filter(value => {
            return value.organisation_id == this.userMetas.default_institute
          })[0];
          if(this.default_ins == undefined)
          {
            let systemAdmin =  this.roles.role.filter(value => {
              return value.role == 'SADMIN'
            });
            if(systemAdmin.length != 0)
            {
              this.default_ins = {
                active : true,
                client_id : 'Admin',
                organisation_name : 'System Admin'
              }
            }
            else {
            this.default_ins = {
              active : false,
              address : '',
              avatar : '',
              client_id : '',
              contact_email : '',
              contact_person : '',
              contact_phone : '',
              date_of_registration : '',
              isActivated : '',
              organisation_id : '',
              organisation_name : '',
            }}
          }
          this.localStorageService.setter('default_institute',this.default_ins );
          if(!this.localStorageService.getter('current_institute')
          || this.localStorageService.getter('current_institute') == undefined
          || this.localStorageService.getter('current_institute') == null)
          {
            this.localStorageService.setter('current_institute', this.default_ins);
          }
          if(this.sessionStorageService.getter('current_institute') == null)
          {
            this.sessionStorageService.setter('current_institute', this.localStorageService.getter('current_institute'));
          }
          this.current_ins = this.sessionStorageService.getter('current_institute');
          this.current_role = this.roles.role.filter(value => {
            return value.institute_id == this.current_ins.organisation_id
          })[0];
          if(this.current_role == undefined)
          {
            this.current_role = this.roles.role.filter(value => {
              return value.role == 'SADMIN'
            })[0];
            if(this.current_role == undefined){
            this.current_role = {
              access_given : '',
              active : false,
              institute_id : '',
              is_activated : false,
              role : '',
              user_id : '',
              valid_upto : '',
            }}
          }
          
          this.localStorageService.setter('current_role',this.current_role);
          if(this.sessionStorageService.getter('current_role') == null)
          {
            this.sessionStorageService.setter('current_role', this.localStorageService.getter('current_role'));
          }
          this.showLoader = false;

        },
        err=>
        {
          this.showLoader = false;
            
        }
      )
    }

    changeCurrentInstitute(ins_id)
    {
      if(ins_id == 'SADMIN')
      {
        this.current_ins = {
          "active" : true,
          "client_id" : "Admin",
          "organisation_name" : "System Admin"
        };
        this.sessionStorageService.setter('current_institute',this.current_ins);
        this.current_role = this.roles.role.filter(value => {
          return value.role == 'SADMIN'
        })[0];
        this.sessionStorageService.setter('current_role',this.current_role);
        this.router.navigateByUrl('/e-library/home');
      }
      else
      {
      this.current_ins = this.roles.ins.filter(value => {
        return value.organisation_id == ins_id
      })[0];
      this.current_role = this.roles.role.filter(value => {
        return value.institute_id == ins_id
      })[0];
      this.sessionStorageService.setter('current_institute',this.current_ins);
      this.sessionStorageService.setter('current_role',this.current_role);
      this.router.navigateByUrl('/e-library/home');
    }
    
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
}
