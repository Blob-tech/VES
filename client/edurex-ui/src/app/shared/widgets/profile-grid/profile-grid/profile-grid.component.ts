import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/modules/library/modules/subscriber-management/models/subscriber';
import { config } from 'src/conf';

@Component({
  selector: 'app-profile-grid',
  templateUrl: './profile-grid.component.html',
  styleUrls: ['./profile-grid.component.css']
})
export class ProfileGridComponent implements OnInit {

  @Input()
  selectedUser : User;

  @Input()
  enabledSubtitle ?: boolean=true ;

  @Input()
  mode ?: string = 'small' ;

  imgUrl = config.host + "avatar/";
  constructor() { }

  ngOnInit(): void {

  }

}
