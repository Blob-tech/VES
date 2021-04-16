import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { config } from "src/conf";
import { Institute } from '../modules/institute-management/models/institute';

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


 get_all_institutes(org_per_page,page)
 {
  let headers = new HttpHeaders();
  headers.append("Content-Type","application/json");
  return this.httpClient.get(this.URL + "/list/all/"+org_per_page+"/"+page);

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

  get_institute_by_client_id(client_id : String)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.get(this.URL + "view_by_client_id/" + client_id, {headers : headers});
  }

 update_institute( form : FormData, id : String)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.put(this.URL+"edit/"+id,form,{headers:headers});
  }

  edit_institute_logo(logo : FormData, id : String)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.put(this.URL+"edit/logo/"+id,logo,{headers:headers})
  }

  delete_many_institutes(institutes : Institute[])
  {
    let headers = new HttpHeaders();
    headers.append('content-Type','application/json');

    return this.httpClient.put(this.URL + 'bulkactions/delete/'+ institutes.length,institutes,{headers : headers})
  }

  deactivate_many_institutes(institutes : Institute[], state : Boolean)
  {
    let headers = new HttpHeaders();
    headers.append('content-Type','application/json');

    return this.httpClient.put(this.URL + 'bulkactions/deactivate/'+ state + '/' +institutes.length,institutes,{headers : headers})
  }
}


