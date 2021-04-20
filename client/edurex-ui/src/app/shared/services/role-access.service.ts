import { Injectable, OnInit } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { config } from 'src/conf';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class RoleAccessService implements OnInit{

  URL = config.host + "role/";

  constructor(private httpClient : HttpClient, private localStorageService : LocalStorageService)
  {

  }


  ngOnInit(): void {

  }

  giveRoleAccess(formData : FormData)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.post(this.URL+"access/add/",formData,{headers:headers})
  }

  getRoleAccess(user_id : string)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.get(this.URL+"institute/access/"+user_id,{headers:headers})
  }

  toggleAccess(user_id,institute_id,access)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.put(this.URL+"toggle_access/"+user_id+"/"+institute_id+"/"+access,{headers:headers});

  }

  toggleSystemAccess(user_id,access)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.put(this.URL+"toggle_system_access/"+user_id+"/"+access,{headers:headers});

  }

  getPeopleCount(institute_id : string,role : string)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.get(this.URL+"people_count/"+institute_id+"/"+role,{headers:headers});
  }

  approveAccess(user_id : string, institute_id : string , approver : string )
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.put(this.URL+"approve/"+ user_id +"/"+institute_id+"/"+approver,{headers:headers});
  }
  getIndividualRoleAccess(user_id : string, institute_id : string)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.get(this.URL+"individual_access/"+user_id+"/"+institute_id,{headers:headers});
  }

  getSystemAdminAccess(user_id:string)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.get(this.URL+"system_access/"+user_id,{headers:headers});
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
  
    isLoggedinUser(user_id)
    {
      if(this.localStorageService.getter('user').user_id == user_id)
      {
        return true;
      }
      return false;
    }

  isValidRole(role,user_id : string,type: string) : boolean
  {
    this.getRoleAccess(user_id).subscribe(
      data=>{
        if(!JSON.parse(JSON.stringify(data))['err'])
        {
          let currentRole = data['role'];
          currentRole = currentRole.filter(value => {
            return value == role;
          })[0];
          if(currentRole != null){
          switch(type)
          {
            case 'SADMIN' :{
                if(currentRole.role == 'SADMIN' && this.isRoleExpired(currentRole))
                {
                  return true;
                }
                break;}
            case 'IADMIN' : {
              if(currentRole.role == 'IADMIN' && this.isRoleExpired(currentRole))
              {
                console.log(currentRole.role);
                console.log(this.isRoleExpired(currentRole));
                return true;
              }
              break;}
            case 'CADMIN' : {
                if(currentRole.role == 'CADMIN' && this.isRoleExpired(currentRole))
                {
                  return true;
                }
                break;}
             case 'STUDENT' : {
                if(currentRole.role == 'STUDENT' && this.isRoleExpired(currentRole))
                {
                  return true;
                }
                break;
              }
          }}
          
          return false;
        }
        else
        {
          return false;
        }
      },
      err=>
      {
        return false;
      }
    );

    return false;

  }
  
}
