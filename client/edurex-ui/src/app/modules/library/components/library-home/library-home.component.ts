import { Component, OnInit, DoCheck } from '@angular/core';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { config } from 'src/conf';
import { SessionStorageService } from 'src/app/shared/services/session-storage.service';

@Component({
  selector: 'app-library-home',
  templateUrl: './library-home.component.html',
  styleUrls: ['./library-home.component.css']
})
export class LibraryHomeComponent implements OnInit,DoCheck {

  ins;
  insUrl = config.host + 'organisation_logo/';
  showLoader = true;
  constructor(private sessionStorageService : SessionStorageService) { }

  ngOnInit(): void {

    this.ins = this.sessionStorageService.getter('current_institute');
    this.showLoader=false;

  }

  ngDoCheck()
  {
    this.ins = this.sessionStorageService.getter('current_institute');
  }


}
