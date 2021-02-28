import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { config } from "src/conf";
import { User } from '../modules/subscriber-management/models/subscriber';

@Injectable({
  providedIn: 'root'
})
export class SubscriberService {

  URL = config.host + "user/";
  constructor(private httpClient : HttpClient) { }

  register(formData : FormData)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.post(this.URL+"add",formData,{headers : headers});
  }

  getUserCount(institute : String)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.get(this.URL+"count/"+institute,{headers : headers})
  }

  get_subscribers(institute : String, users_per_page : Number, page : Number)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.get(this.URL + "list/" + institute+"/"
    +users_per_page + "/" + page,{headers : headers});
  }

  deactivate_subscribers(state:String,id : String)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type", "application/json");
    return this.httpClient.put(this.URL + "deactivate/"+ state + "/" + id, {headers : headers} );
  }

  delete_subscribers(id:String)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type", "application/json");
    return this.httpClient.delete(this.URL + "delete/"+ id, {headers : headers} );
  }

  delete_many_subscriber(users : User[])
  {
    let headers = new HttpHeaders();
    headers.append('content-Type','application/json');

    return this.httpClient.put(this.URL + 'bulkactions/delete/'+ users.length,users,{headers : headers})
  }

  deactivate_many_users(users : User[], state : Boolean)
  {
    let headers = new HttpHeaders();
    headers.append('content-Type','application/json');

    return this.httpClient.put(this.URL + 'bulkactions/deactivate/'+ state + '/' +users.length,users,{headers : headers})
  }
}
