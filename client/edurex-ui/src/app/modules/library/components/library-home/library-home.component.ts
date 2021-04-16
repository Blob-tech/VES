import { Component, OnInit, DoCheck } from '@angular/core';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { config } from 'src/conf';
import { SessionStorageService } from 'src/app/shared/services/session-storage.service';
import { InstituteManagementService } from '../../service/institute-management.service';

@Component({
  selector: 'app-library-home',
  templateUrl: './library-home.component.html',
  styleUrls: ['./library-home.component.css']
})
export class LibraryHomeComponent implements OnInit {

  ins;
  insUrl = config.host + 'organisation_logo/';
  showLoader = true;
  initialInstituteLoad = 12;
  initial_page= 0;
  constructor(private sessionStorageService : SessionStorageService,private instituteService : InstituteManagementService,
    private instituteManagementService : InstituteManagementService) { }

  ngOnInit(): void {

    this.ins = this.sessionStorageService.getter('current_institute');
    if(!this.ins)
    {
      this.getInstitutes();
    }
    this.showLoader=false;

  }

  getInstitutes()
  {
    
  }

  // ngDoCheck()
  // {
  //  this.ins = this.sessionStorageService.getter('current_institute');
  // }
 
  

}
