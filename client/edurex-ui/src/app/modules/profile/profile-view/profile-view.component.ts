import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../../library/modules/subscriber-management/models/subscriber';
import { SubscriberService } from '../../library/service/subscriber.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { MatAccordion } from '@angular/material/expansion';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent implements OnInit {

  currentUser : User;
  mode='large';
  constructor(private subscriberServices : SubscriberService, private snackBar : MatSnackBar,
    private route : ActivatedRoute,private formBuilder : FormBuilder) { }

  ngOnInit(): void {
    this.route.params.subscribe(routeParams => {
      this.getCurrentUser(routeParams.user_id);
    })
  }

  @ViewChild(MatAccordion) accordion: MatAccordion;
  getCurrentUser(user_id : string)
  {
    this.subscriberServices.get_subscriber_by_id(user_id).subscribe(
      data=>{
        if(!(JSON.parse(JSON.stringify(data))['err']))
        {
          
          this.currentUser = data as User;
          this.basicInfoForm.patchValue({
            name : this.currentUser.name,
            email : this.currentUser.email,
            phone : this.currentUser.phone,
            address : this.currentUser.address,
          },{emitEvent : true});
        }
      },
      err => {
        this.snackBar.open("Error in getting user details" + err , null, {duration : 5000});
      }
    )
  }

  basicInfoForm = this.formBuilder.group(
    {
      name : ['',[Validators.required, Validators.maxLength(200)]],
      email :['',[Validators.required,Validators.pattern("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")]],
      phone :['',[Validators.required, Validators.pattern("^[0-9]{10}$")]],
      address : ['',[Validators.maxLength(500)]],
    },
  );

  personalDetailsForm = this.formBuilder.group(
    {
      bio : ['', [Validators.maxLength(500)]]
    }
  )

  get name()
  {
    return this.basicInfoForm.get('name');
  }

  get email()
  {
    return this.basicInfoForm.get('email');
  }

  get phone()
  {
    return this.basicInfoForm.get('phone');
  }

  get address()
  {
    return this.basicInfoForm.get('address');
  }

  get bio()
  {
    return this.personalDetailsForm.get('bio');
  }

  updateBasicInfoDisabled()
  {
    if(this.basicInfoForm.status == "VALID")
    {
      return false;
    }
    else
    {
      return true;
    }
  }


  updateBasicInfo()
  {
    let formData = new FormData()
    
    
    for ( const key of Object.keys(this.basicInfoForm.value) ) {
      const value = this.basicInfoForm.value[key];
      formData.append(key, value);
    }

    this.subscriberServices.update_subscriber(this.currentUser.user_id,formData).subscribe(
      data=>{
        if(!(JSON.parse(JSON.stringify(data))['err']))
        {
          this.route.params.subscribe(routeParams => {
            this.getCurrentUser(routeParams.user_id);
          })
          this.snackBar.open(JSON.parse(JSON.stringify(data))['msg'],null,{duration : 5000});
        }
        else
        {
          this.snackBar.open(JSON.parse(JSON.stringify(data))['err'],null,{duration : 5000});
        }
      },
      err=>{
        this.snackBar.open("Error in updating the basic info of " + this.currentUser.name,null,{duration : 5000})
      }
    )
  }

}
