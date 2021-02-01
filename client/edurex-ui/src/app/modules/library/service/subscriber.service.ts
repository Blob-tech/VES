import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { config } from "src/conf";

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

  get_subscribers(institute : String)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.get(this.URL + "list/" + institute,{headers : headers});
  }
}
