import { Component, OnInit } from '@angular/core';
import { OtpService } from 'src/app/shared/services/otp.service';
import { SubscriberService } from 'src/app/modules/library/service/subscriber.service';
import { NavbarService } from '../navbar/navbar.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  showLoader=false;
  registered_email='';
  otp;
  new_pass;
  otp_size;
  otp_time_limit;
  otp_resend_in;
  otp_success = null;
  otp_failure = null;
  constructor(private otpService : OtpService, private subscriberService : SubscriberService,
    private navBarService : NavbarService) { }

  ngOnInit(): void {
    this.navBarService.getSystemBranding().subscribe(
      data=>{
        this.otp_size = data[0].otp_size
        this.otp_time_limit = data[0].otp_valid_upto*1000
        this.otp_resend_in = data[0].otp_resend_time
      }
    );
  }

  sendOtp()
  {
    let formData = new FormData();
    formData.append("user_id",this.registered_email);
    formData.append("otp_type","forgot-password");
    formData.append("otp_generated_on",Date.now().toString());
    formData.append("otp_valid_upto",(Date.now()+Number(this.otp_time_limit)).toString());
    formData.append("otp",("" + Math.random()).substring(2, Number(this.otp_size)+2));

    this.otpService.sendOtp(formData).subscribe(
      data=>{
        if(!JSON.parse(JSON.stringify(data))['err'])
        {
          this.otp_failure=null;
          this.otp_success="Otp has been sent to your registered email";
        }
        else
        {
          this.otp_failure = JSON.stringify(data['err']);
          this.otp_success = null;
        }
        
      },
      err=>{
        this.otp_failure = "Server Error ! Error in sending otp"
        this.otp_success = null;
      }
    )
  }
}
