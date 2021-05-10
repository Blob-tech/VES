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

  addPremium(formData)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.post(this.URL+"premium/add",formData,{headers:headers})
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
    return this.httpClient.get(this.URL+"all",{headers:headers});
  }

  getPackageById(package_id)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.get(this.URL+"view/"+package_id,{headers : headers});
  }
}
