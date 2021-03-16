import { Component, OnInit, DoCheck } from '@angular/core';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { config } from 'src/conf';

@Component({
  selector: 'app-library-home',
  templateUrl: './library-home.component.html',
  styleUrls: ['./library-home.component.css']
})
export class LibraryHomeComponent implements OnInit,DoCheck {

  ins;
  insUrl = config.host + 'organisation_logo/';
  constructor(private localSrorageService : LocalStorageService) { }

  ngOnInit(): void {

    this.ins = this.localSrorageService.getter('current_institute');

  }

  ngDoCheck()
  {
    this.ins = this.localSrorageService.getter('current_institute');
  }


}
