import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { config } from 'src/conf';

@Injectable({
  providedIn: 'root'
})
export class OtpService {

  URL=config.host;

  constructor(private httpClient : HttpClient) { }

  sendOtp(otpForm)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.post(this.URL+"otp/insert",otpForm,{headers:headers});
  }

  validateOtp(otpForm)
  {
    let headers =new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.post(this.URL + "otp/validate",otpForm,{headers:headers});
  }


}
