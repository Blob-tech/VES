import { Component, OnInit} from '@angular/core';
import { InstituteManagementService } from 'src/app/modules/library/service/institute-management.service';
import {config} from 'src/conf';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { RoleAccessService } from 'src/app/shared/services/role-access.service';

@Component({
  selector: 'app-view-institute',
  templateUrl: './view-institute.component.html',
  styleUrls: ['./view-institute.component.css']
})
export class ViewInstituteComponent implements OnInit {

 showLoader = true;
  public current_institute;
 
  
  url = "assets/images/user.png";
  imgUrl = config.host + "organisation_logo/";
  studentCount ="";
  adminCount = "";
  contentCount="";
  constructor(private instituteService : InstituteManagementService, private _snackbar : MatSnackBar,
    private route : ActivatedRoute, private roleAccessService : RoleAccessService) { }

    
  ngOnInit(): void {
    
    this.get_institute(this.route.snapshot.paramMap.get('id'));
    this.getPeopleCount(this.route.snapshot.paramMap.get('id'));
  }

  getPeopleCount(institute_id)
  {
    this.roleAccessService.getPeopleCount(institute_id,"CADMIN").subscribe(
      data=>{
        this.contentCount = JSON.stringify(data);
      },
      err=>{
        this._snackbar.open(JSON.stringify(err),null,{duration:5000});
      }
    )
    this.roleAccessService.getPeopleCount(institute_id,"IADMIN").subscribe(
      data=>{
        this.adminCount = JSON.stringify(data);
      },
      err=>{
        this._snackbar.open(JSON.stringify(err),null,{duration:5000});
      }
    )
    this.roleAccessService.getPeopleCount(institute_id,"STUDENT").subscribe(
      data=>{
        this.studentCount = JSON.stringify(data);
      },
      err=>{
        this._snackbar.open(JSON.stringify(err),null,{duration:5000});
      }
    )
  }


  get_institute(id:String)
  {
    this.showLoader = true;
    this.instituteService.view_institute(id).subscribe(
      data=>{
        this.current_institute = data[0];
        this.url = this.current_institute.avatar ? this.imgUrl + this.current_institute.avatar : "assets/images/insimg.png";
        this.showLoader = false;
      },
      err=>{
        this._snackbar.open("Error in Loading the Institute with id :" + this.route.snapshot.paramMap.get('id'),null,{duration : 5000});
        this.showLoader = false;
      }
    )
  }



}

