import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { config } from 'src/conf';

@Injectable({
  providedIn: 'root'
})
export class OtpService {

  URL=config.host;

  constructor(private httpClient : HttpClient) { }

  sendOtp(email)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.get(this.URL+"otp/"+email,{headers:headers})
  }
}
