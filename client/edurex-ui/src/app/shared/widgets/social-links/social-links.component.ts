import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import {MatChipInputEvent} from '@angular/material/chips';
import { SubscriberService } from 'src/app/modules/library/service/subscriber.service';
import { SocialProfile } from 'src/app/modules/profile/profile-view/profile-view.component';


@Component({
  selector: 'app-social-links',
  templateUrl: './social-links.component.html',
  styleUrls: ['./social-links.component.css']
})
export class SocialLinksComponent implements OnInit {

  @Input()
  userID;

  socialLinkList : SocialProfile[] = [];
  userMetas: any;
 


  constructor(private router : Router, private dialog : MatDialog,
    private subscriberServices : SubscriberService) { }

  ngOnInit(): void {
    this.getuserMetas(this.userID);
  }

  getSocialIcon(link : string)  : String
  {
    if(link.toLowerCase().includes('facebook'))
    {
      return 'facebook';
    }
    if(link.toLowerCase().includes('instagram'))
    {
      return 'instagram';
    }
    if(link.toLowerCase().includes('linkedin'))
    {
      return 'linkedin';
    }
    if(link.toLowerCase().includes('behance'))
    {
      return 'behance';
    }
    if(link.toLowerCase().includes('google'))
    {
      return 'google';
    }
    if(link.toLowerCase().includes('twitter'))
    {
      return 'twitter';
    }
    if(link.toLowerCase().includes('whatsapp'))
    {
      return 'whatsapp';
    }
    if(link.toLowerCase().includes('dribbble'))
    {
      return 'dribbble';
    }

    return 'web';

  }

  getuserMetas(user_id : string)
  {
    this.subscriberServices.get_user_metas(user_id).subscribe(
      data=>{
        this.userMetas = data;
        if(this.userMetas != null && this.userMetas.social_profiles != undefined)
          {
            this.socialLinkList = this.userMetas.social_profiles as SocialProfile[];
          }
      },
      err=>
      {
          
      }
    )
  }

  goToSocialLink(url : string)
  {
    window.open(url, "_blank" );
  }

  open(content)
  {
    const dialogRef = this.dialog.open(content);
  }

}
