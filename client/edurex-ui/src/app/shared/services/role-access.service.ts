import { Injectable, OnInit } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { config } from 'src/conf';

@Injectable({
  providedIn: 'root'
})
export class RoleAccessService implements OnInit{

  URL = config.host + "role/";

  constructor(private httpClient : HttpClient)
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

  
}
