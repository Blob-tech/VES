import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

import { config } from 'src/conf';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  URL = config.host + "search/";

  constructor(private httpClient : HttpClient) { }

  getSearhResult(keyword : string, limit : number)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.get(this.URL+"advance-search/"+keyword+"/"+limit,{headers:headers})
  }
}
