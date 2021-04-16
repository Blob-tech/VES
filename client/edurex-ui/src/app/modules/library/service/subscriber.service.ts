import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { config } from "src/conf";
import { User } from '../modules/subscriber-management/models/subscriber';
import { SocialProfile } from '../modules/profile/profile-view/profile-view.component';


@Injectable({
  providedIn: 'root'
})
export class SubscriberService {

  URL = config.host + "user/";
  static loginEventEmitter: EventEmitter<any> = new EventEmitter<any>();
  
  constructor(private httpClient : HttpClient) { }

  register(formData : FormData)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.post(this.URL+"add",formData,{headers : headers});
  }

  login(formData : FormData)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.post(this.URL+"login",formData,{headers : headers});
  }

  set_theme(theme,dark_mode,user_id)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    //console.log(dark_mode);
    return this.httpClient.post(this.URL+"theme/"+theme+"/"+dark_mode +"/" + user_id,{headers : headers});
  }

  getUserCount(institute : String, filter ?: String)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    if(filter == undefined)
    {
      return this.httpClient.get(this.URL+"count/"+institute,{headers : headers})
    }
    else
    {
      return this.httpClient.get(this.URL+"count/"+institute+"/"+filter,{headers : headers})
    }
    
  }

  get_subscribers(institute : String, users_per_page : Number, page : Number)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.get(this.URL + "list/" + institute+"/"
    +users_per_page + "/" + page,{headers : headers});
  }

  get_subscriber_by_id(user_id : string)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.get(this.URL + "view/" + user_id,{headers : headers});
  }

  update_profile_image(logo : FormData,user_id : string)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.put(this.URL+"edit/logo/"+user_id,logo,{headers:headers})
  }

  update_profile_cover(cover : FormData,user_id : string)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.put(this.URL+"edit/cover/"+user_id,cover,{headers:headers})
  }

  update_subscriber(user_id : String,formdata : FormData)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.put(this.URL+"update/"+user_id,formdata,{headers:headers})
  }

  remove_profile_image(user_id : string)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.delete(this.URL+"remove/logo/"+user_id,{headers:headers})
  }

  remove_profile_cover(user_id : string)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.delete(this.URL+"remove/cover/"+user_id,{headers:headers})
  }

  get_subscribers_advance_search(institute : String, searchkey : String, users_per_page : Number, page : Number)
  {
    console.log(searchkey);
    let headers = new HttpHeaders();
    headers.append("Content-Type", "application/json" );
    return this.httpClient.get(this.URL + "list/" + institute + "/" + searchkey +
    "/" + users_per_page + "/" + page,{headers:headers});
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

  get_user_metas(user_id : string)
  {
    let headers = new HttpHeaders();
    headers.append('content-Type','application/json')
    return this.httpClient.get(this.URL + 'usermetas/view/'+user_id,{headers : headers});
  }

  update_social_profile(user_id : string,socialProfile : SocialProfile[])
  {
    let headers = new HttpHeaders();
    headers.append('content-Type','application/json');
    return this.httpClient.post(this.URL + 'social_profiles/add/'+user_id,socialProfile,{headers : headers});
  }

  update_personal_info(user_id : string,formData : FormData)
  {
    let headers = new HttpHeaders();
    headers.append('content-Type','application/json');
    return this.httpClient.post(this.URL + 'personal_info/add/'+user_id,formData,{headers : headers});
  }

  set_visibility(user_id : string,body:any)
  {
    let headers = new HttpHeaders();
    headers.append('content-Type','application/json');
    return this.httpClient.post(this.URL + 'visibility/'+user_id,body,{headers : headers});
  }

}