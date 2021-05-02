import { Injectable } from '@angular/core';
import {config} from 'src/conf';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PackageService {

  URL = config.host + "package/";
  constructor(private httpClient : HttpClient) { }

  addPackage(formData)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.post(this.URL+"add",formData,{headers:headers})
  }

  removePackage(package_id)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.put(this.URL + "remove/"+package_id,{headers:headers});
  }

  updatePackage(package_id,formData)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.put(this.URL+"update/"+package_id,formData,{headers:headers});
  }

  getPremium(premium_id)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/jsom");
    return this.httpClient.get(this.URL+"premium/view/"+premium_id,{headers : headers});

  }

  addPremium(formData)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.post(this.URL+"premium/add",formData,{headers:headers})
  }

  updatePremium(formData,premium_id)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.put(this.URL+"premium/update/"+premium_id,formData,{headers:headers})
  }

  removePremium(id : string)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.put(this.URL+"premium/remove/"+id,{headers:headers})
  }

  getPremiumByPackageId(package_id : string)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.get(this.URL + "premium/"+package_id,{headers : headers});
  }

  getPackages()
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.get(this.URL+"all",{headers:headers})
  }
}
