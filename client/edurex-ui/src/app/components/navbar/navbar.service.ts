import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { config } from "src/conf";

@Injectable({
  providedIn: 'root'
})
export class NavbarService {

  URL = config.host;
  constructor(private http : HttpClient) 
  {

   }

   getSystemBranding()
   {
     let headers=new HttpHeaders();
     headers.append("Content-Type","application/json");
     return this.http.get(this.URL+"system/get/",{headers:headers})
     
   }

   updateBrand(name : String, tagline : String, icon_width : String)
   {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.http.get(this.URL+"system/update/"+name+"/"+tagline + "/" + icon_width,{headers:headers});
   }
   
   getCounterList()
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.http.get(this.URL+"counter/list/",{headers:headers})
  }

  updateCounter(value : String, parameter : String)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.http.put(this.URL+"counter/"+value+"/"+parameter,{headers:headers})
  }

  updateicon(formData : FormData)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.http.put(this.URL+"system/update/icon/",formData,{headers:headers})
  }
}

