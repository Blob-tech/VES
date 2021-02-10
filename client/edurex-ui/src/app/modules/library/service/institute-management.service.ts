import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { config } from "src/conf";

@Injectable({
  providedIn: 'root'
})
export class InstituteManagementService {

  URL = config.host + "organisation/";
  constructor(private httpClient : HttpClient) { }

  register(formData : FormData)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.post(this.URL+"add",formData,{headers : headers});
  }

  get_institutes()
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.get(this.URL + "list/all" ,{headers : headers});
  }

  delete_institutes(id : String)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.delete(this.URL + "delete/" + id , {headers : headers});

  }

  deactivate_institutes(state:String,id : String)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type", "application/json");
    return this.httpClient.put(this.URL + "deactivate/"+ state + "/" + id, {headers : headers} );
  }

  view_institute(id: String)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.get(this.URL + "view/" + id , {headers : headers});
  }
}


