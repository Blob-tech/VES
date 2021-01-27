import { Component, OnInit } from '@angular/core';
import { SubscriberService } from '../../../service/subscriber.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-subscriber-list',
  templateUrl: './subscriber-list.component.html',
  styleUrls: ['./subscriber-list.component.css']
})
export class SubscriberListComponent implements OnInit {

  subscriberList = [];
  noSubs = null;
  constructor(private subscriberService : SubscriberService,private _snacbar : MatSnackBar,
    private route : ActivatedRoute) { }

  ngOnInit(): void {

    this.route.params.subscribe(routeParams => {
      this.getSubscribers(routeParams.cat);
     
    });
  }

  getSubscribers(category : String)
  {
    this.subscriberService.get_subscribers(category).subscribe(
      data=>{
        if(!JSON.parse(JSON.stringify(data))['err'])
        {
          this.subscriberList = data as Array<any>;
          if(this.subscriberList.length == 0)
          {
            this.noSubs = "No Subscriber Found";
          }
        }
        else
        {
          this._snacbar.open(JSON.parse(JSON.stringify(data))['msg'],null,{duration : 5000});
        }
      },
      err=>{
        this._snacbar.open("Error in loading the subscribers");
      }
    )
  }

}
