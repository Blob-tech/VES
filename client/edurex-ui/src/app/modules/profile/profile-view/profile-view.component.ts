import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../../library/modules/subscriber-management/models/subscriber';
import { SubscriberService } from '../../library/service/subscriber.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent implements OnInit {

  currentUser : User;
  mode='large';
  constructor(private subscriberServices : SubscriberService, private snackBar : MatSnackBar,
    private route : ActivatedRoute) { }

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
          console.log(this.currentUser);
        }
      },
      err => {
        this.snackBar.open("Error in getting user details" + err , null, {duration : 5000});
      }
    )
  }

}
