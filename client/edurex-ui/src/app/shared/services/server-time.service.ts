import { Injectable } from '@angular/core';
import {config} from 'src/conf';
import { HttpHeaders, HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ServerTimeService {

  URL = config.host;
  constructor(private httpClient : HttpClient) {

   }

   
   getServerTime()
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.get(this.URL+"server_time",{headers:headers});
  }

}
