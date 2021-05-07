import { Component, OnInit } from '@angular/core';
import { OtpService } from 'src/app/shared/services/otp.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  showLoader=false;
  registered_email='';
  constructor(private otpService : OtpService) { }

  ngOnInit(): void {
  }

  sendOtp()
  {
    this.otpService.sendOtp(this.registered_email).subscribe(
      data=>{
        console.log(data);
      },
      err=>{
        console.log(err);
      }
    )
  }
}
