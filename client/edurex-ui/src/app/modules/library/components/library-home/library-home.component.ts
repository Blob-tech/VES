import { Component, OnInit, DoCheck } from '@angular/core';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { config } from 'src/conf';
import { SessionStorageService } from 'src/app/shared/services/session-storage.service';
import { InstituteManagementService } from '../../service/institute-management.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-library-home',
  templateUrl: './library-home.component.html',
  styleUrls: ['./library-home.component.css']
})
export class LibraryHomeComponent implements OnInit {

  ins;
  insUrl = config.host + 'organisation_logo/';
  showLoader = true;
  initialInstituteLoad = 20;
  initial_page= 1;
  institutes=[];
  total_ins;
  constructor(private sessionStorageService : SessionStorageService,private instituteService : InstituteManagementService,
    private instituteManagementService : InstituteManagementService,
    private router : Router) { }

  ngOnInit(): void {

    this.ins = this.sessionStorageService.getter('current_institute');
      this.getInstitutes();
      this.get_total_institute_count();
    

  }

  get_total_institute_count()
  {
    this.instituteManagementService.get_all_institute_count().subscribe(
      data=>{
        this.total_ins = data;
      }
    )
  }

  ifNext()
  {
    if((this.total_ins % this.initialInstituteLoad == 0) && (this.total_ins / this.initialInstituteLoad >= this.initial_page) )
    {
      return false;
    }
    if((this.total_ins % this.initialInstituteLoad !=0) && (this.total_ins/this.initialInstituteLoad > this.initial_page ))
    {
      return false;
    }
    return true;
  }


  getInstitutes()
  {
    this.instituteManagementService.get_all_institutes(this.initialInstituteLoad,this.initial_page).subscribe(
      data=>{
        this.institutes = data as Array<any>;
        this.showLoader=false;
      },
      err=>{
        this.showLoader=false;
      }
    )
  }

  next()
  {
    this.initial_page = this.initial_page + 1;
    this.showLoader = true;
    this.getInstitutes();
  }

  previous()
  {
    this.initial_page = this.initial_page -1;
    this.showLoader = true;
    this.getInstitutes();
  }

  goToInstitute(institute_id)
  {
    this.router.navigateByUrl("/e-library/institute/institute-management/view/"+institute_id).then(
      ()=>{
        location.reload();
      }
    )
  }
  // ngDoCheck()
  // {
  //  this.ins = this.sessionStorageService.getter('current_institute');
  // }
 
  

}
