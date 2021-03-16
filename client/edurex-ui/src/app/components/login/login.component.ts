import { Component, OnInit, Directive, Output, EventEmitter, HostListener } from '@angular/core';
import {FormControl, Validators, FormBuilder} from '@angular/forms';
import { NavbarService } from '../navbar/navbar.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { config } from "src/conf";
import { SubscriberService } from 'src/app/modules/library/service/subscriber.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { Router } from '@angular/router';
import { RoleAccessService } from 'src/app/shared/services/role-access.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  capslockOn : Boolean ;
  inValidLoginMessage = null ;
@HostListener('click', ['$event']) 
onClick(event){
  if (event.getModifierState && event.getModifierState('CapsLock')) {
    this.capslockOn = true;
   } else {
    this.capslockOn = false;
   }
  }
 
 @HostListener('keydown', ['$event'])
 onKeyDown(event){
 if (event.getModifierState && event.getModifierState('CapsLock')) {
   this.capslockOn = true;
   } else {
    this.capslockOn = false;
   }
 }
 
 @HostListener('keyup', ['$event'])
  onKeyUp(event){
  if (event.getModifierState && event.getModifierState('CapsLock')) {
   this.capslockOn = true;
  } else {
   this.capslockOn = false;
  }
 }
 

  constructor(private navbarService : NavbarService,private snackbar : MatSnackBar,
    private formBuilder : FormBuilder, private subscriberService : SubscriberService,
    private localStorageService : LocalStorageService,private router : Router, 
    private roleAccessService : RoleAccessService ) { }

  hide = true;
  capsOn;
  brand ;
  roles;
  current_role;
  iconUrl = config.host + "system/icon.png";
  userid = new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]);
  passwd = new FormControl('',Validators.required);
  ngOnInit(): void {

    this.getBranding();
    this.inValidLoginMessage = null;
  }

  loginForm = this.formBuilder.group(
    {
      username : ['', Validators.required],
      pass : ['', Validators.required],
    }
  );

  get username()
  {
    return this.loginForm.get('username');
  }

  get pass()
  {
    return this.loginForm.get('pass');
  }

  login()
  {
    let formData = new FormData();
    formData.append("username",this.loginForm.get('username').value);
    formData.append("password",this.loginForm.get('pass').value);
    this.subscriberService.login(formData).subscribe(data=>{
      if(!JSON.parse(JSON.stringify(data))['err']){
      this.inValidLoginMessage=null;
      this.localStorageService.setter("user",data);
      this.localStorageService.setter("theme",data['theme']);
      //this.localStorageService.setter("dark-mode",JSON.parse(JSON.stringify(data))['dark_mode']);
      this.localStorageService.setter("username",data['name']);
      this.localStorageService.setter("avatar",data['avatar']);
      this.router.navigateByUrl('/e-library/home').then(()=>
        window.location.reload()
      );

      }
      else
      {
        this.inValidLoginMessage = JSON.parse(JSON.stringify(data))['err'];
      }
    },
    err=>{
      if(err.status == 403)
      {
        this.inValidLoginMessage = "Your account has been deactivated ! Please contact System Administrator";
      }
      else if(err.status == 423)
      {
        this.inValidLoginMessage="Your account has been Locked ! Please contact the System Administrator";
      }
      else if(err.status == 401)
      {
        this.inValidLoginMessage = "Invalid Credentials ! Either Username or Password is invalid";
      }

    })
  }

  getUserIdErrorMessage() {
    if (this.userid.hasError('required')) {
      return 'You must enter a value';
    }

    return this.userid.hasError('pattern') ? 'Not a valid or registered mobile number' : '';
  }

  getPasswordErrorMessage()
  {
    if (this.passwd.hasError('required')) {
      return 'You must enter a value';
    }

  }

  getBranding()
  {
    this.navbarService.getSystemBranding().subscribe(
      data=>{
        if(!JSON.parse(JSON.stringify(data))['err'])
        {
          this.brand = data as Array<any>;
        }
        else
        {
          this.snackbar.open(JSON.parse(JSON.stringify(data))['err'],null,{duration : 5000});
        }
      },
      err=>{
        this.snackbar.open("Error in Loading System Branding", null, {duration : 5000});
      }
    )
  }

  capLock(e){
    let kc = e.keyCode?e.keyCode:e.which;
    let sk = e.shiftKey?e.shiftKey:((kc == 16)?true:false);
    if(((kc >= 65 && kc <= 90) && !sk)||((kc >= 97 && kc <= 122) && sk))
     document.getElementById('capsLock').style.visibility = 'visible';
    else
     document.getElementById('capsLock').style.visibility = 'hidden';
   }
}


// @Directive({ selector: '[capsLock]' })
// export class TrackCapsDirective {
//   @Output('capsLock') capsLock = new EventEmitter<Boolean>();

//   @HostListener('window:keydown', ['$event'])
//   onKeyDown(event: KeyboardEvent): void {
//     this.capsLock.emit(event.getModifierState && event.getModifierState('CapsLock'));
//   }
//   @HostListener('window:keyup', ['$event'])
//   onKeyUp(event: KeyboardEvent): void {
//     this.capsLock.emit(event.getModifierState && event.getModifierState('CapsLock'));
//   }

// }
