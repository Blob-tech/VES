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

  getPackages()
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.get(this.URL+"all",{headers:headers})
  }
}
