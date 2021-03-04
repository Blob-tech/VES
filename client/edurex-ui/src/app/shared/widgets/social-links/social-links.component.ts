import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-social-links',
  templateUrl: './social-links.component.html',
  styleUrls: ['./social-links.component.css']
})
export class SocialLinksComponent implements OnInit {

  @Input()
  socialLinkList = ["https://www.instagram.com/digiartlicks/","https://www.facebook.com",
  "dribbble.com/ah","linkedin.com/ajk",'abehance.net','google.com','whatsapp','twittergjsl','dtrjyfgjuh'];


  constructor(private router : Router, private dialog : MatDialog) { }

  ngOnInit(): void {
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

  goToSocialLink(url : string)
  {
    window.open(url, "_blank");
  }

  open(content)
  {
    const dialogRef = this.dialog.open(content);
  }

}
