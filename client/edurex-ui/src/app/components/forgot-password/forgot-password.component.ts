import { Component, OnInit, OnChanges, DoCheck } from '@angular/core';
import { OtpService } from 'src/app/shared/services/otp.service';
import { SubscriberService } from 'src/app/modules/library/service/subscriber.service';
import { NavbarService } from '../navbar/navbar.service';
import { MatDialog } from '@angular/material/dialog';
import { Subscription,interval } from 'rxjs';
import { FormControl, ValidatorFn, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SessionStorageService } from 'src/app/shared/services/session-storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';



const resetPassValidator: ValidatorFn = (fg: FormGroup) => {
  const pass = fg.get('password').value;
  const repass = fg.get('resetPassword').value;

  if(pass!= null && repass!=null && pass!=repass)
  {
      fg.get('resetPassword').setErrors({notMatching : true});
  }
  else
  {
    fg.get('resetPassword').setErrors(null);
  }
  return pass !== null && repass !== null && pass == repass
    ? null
    : { range: true };
};

@Component({
  selector: 'change-password-dialog',
  templateUrl: 'change-password.component.html',
})
export class ChangePasswordDialogComponent {

  constructor(private formBuilder : FormBuilder,private subscriberService : SubscriberService,
    private sessionStorageService : SessionStorageService, private snackbar : MatSnackBar)
  {

  }
  hide=true;
  hide2=true;

  changePassForm = this.formBuilder.group(
    {
      password : ['',[Validators.required,Validators.minLength(8),Validators.maxLength(15),Validators.pattern("^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]*$")]],
      resetPassword : ['',[Validators.required]],
    },
    { validator: resetPassValidator}
  )

  get password()
  {
    return this.changePassForm.get('password');
  }

  get resetPassword()
  {
    return this.changePassForm.get('resetPassword');
  }

  public changePass()
  {
    let chngPassForm = new FormData();
    chngPassForm.append('email',this.sessionStorageService.getter('email'));
    chngPassForm.append('new_password',this.password.value);
    this.subscriberService.change_password_by_otp(chngPassForm).subscribe(
      data=>{
        if(!JSON.parse(JSON.stringify(data))['err'])
        {
          sessionStorage.clear();
          this.snackbar.open('Password has been changed successfully. Please try to login',null,{duration : 5000});
        }
        else
        {
          sessionStorage.clear();
          this.snackbar.open(JSON.parse(JSON.stringify(data))['err'],null,{duration : 5000});

        }
      },
      err=>{
        sessionStorage.clear();
        this.snackbar.open('Error in Changing Password. Please try after sometime',null,{duration : 5000});
      }
    )
    
  }

  
}

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit,DoCheck {

  showLoader=false;
  registered_email='';
  private changePass= 'changePass';
  dialogRef: any;
  private subscription: Subscription;
  otp='';
  showChangePassword:boolean=false;
  isSendOtp : boolean = false;
  new_pass;
  otp_size;
  otp_time_limit;
  otp_resend_in;
  otp_resend_in_millis;
  timeDifference;
  otp_generated_on;
  otp_success = null;
  otp_failure = null;
  milliSecondsInASecond = 1000;
  SecondsInAMinute  = 60;
  otpControl;
  
  constructor(private otpService : OtpService, private subscriberService : SubscriberService,
    private navBarService : NavbarService, private dialog : MatDialog,private sessionStorageService : SessionStorageService,
    private formBuilder : FormBuilder) { 
      this.otpControl = new FormControl();
    }

  ngOnInit(): void {
    this.navBarService.getSystemBranding().subscribe(
      data=>{
        this.otp_size = data[0].otp_size
        this.otp_time_limit = data[0].otp_valid_upto*1000
        this.otp_resend_in = data[0].otp_resend_time
        this.otp_resend_in_millis = this.otp_resend_in*1000
      }
    );
    
  }


  openChangePassword()
  {
    this.dialogRef = this.dialog.open(ChangePasswordDialogComponent,
      {
        width: '500px'
      });
  }

  ngDoCheck()
  {
    if(this.otp_resend_in <= 0)
    {
      this.subscription.unsubscribe();
      this.isSendOtp=false;
      this.otp_resend_in = Math.floor(this.otp_resend_in_millis/1000);
    }
  }

  

  isVerifyDisabled():boolean
  {
    if(this.otp == '' || this.otp.length > Number(this.otp_size))
    {
      return true;
    }
    return false;
  }
  validateOtp()
  {
    let formData = new FormData();
    formData.append("user_id",this.registered_email);
    formData.append("otp_type","forgot-password");
    formData.append("otp",this.otp);
    formData.append("otp_valid_upto",Date.now().toString());

    this.otpService.validateOtp(formData).subscribe(
      data=>{
        if(!JSON.parse(JSON.stringify(data))['err'])
        {
          this.otp="";
          this.otp_failure=null;
          this.otp_success=JSON.stringify(data['msg']);
          this.showChangePassword=true;
          this.sessionStorageService.setter('email',this.registered_email);
          this.openChangePassword();
        }
        else
        {
          this.otp="";
          this.otp_failure = JSON.stringify(data['err']);
          this.otp_success = null;
        }
        
      },
      err=>{
        this.otp="";
        this.otp_failure = "Server Error ! Error in sending otp"
        this.otp_success = null;
      }     
    )
  }

  enableDisableSendOtp() : boolean
  {
    return this.isSendOtp;
  }

  private getTimeDifference () {
    this.timeDifference =  (this.otp_generated_on + this.otp_resend_in_millis) - Date.now();
    this.allocateTimeUnits(this.timeDifference);
}

  private allocateTimeUnits (timeDifference) {
    this.otp_resend_in = Math.floor(timeDifference/1000);
    
}

  sendOtp()
  {
    this.showChangePassword=false;
    let formData = new FormData();
    formData.append("user_id",this.registered_email);
    formData.append("otp_type","forgot-password");
    this.otp_generated_on = Date.now();
    formData.append("otp_generated_on",this.otp_generated_on.toString());
    formData.append("otp_valid_upto",(Date.now()+Number(this.otp_time_limit)).toString());
    formData.append("otp",("" + Math.random()).substring(2, Number(this.otp_size)+2));

    this.otpService.sendOtp(formData).subscribe(
      data=>{
        if(!JSON.parse(JSON.stringify(data))['err'])
        {
          this.otp_failure=null;
          this.isSendOtp = true;
          this.otp_success="Otp has been sent to your registered email";
          this.subscription = interval(1000)
           .subscribe(x => { this.getTimeDifference(); });
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
