import { Component, OnInit } from '@angular/core';
import { LibraryCategoryService } from '../../../service/library-category.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InstituteManagementService } from '../../../service/institute-management.service';
import {config} from 'src/conf';

@Component({
  selector: 'app-subscribers',
  templateUrl: './subscribers.component.html',
  styleUrls: ['./subscribers.component.css']
})
export class SubscribersComponent implements OnInit {

  subscriptions=[];
  institutes = [];
  imgUrl = config.host + "organisation/";
  constructor(private libCategoryServices : LibraryCategoryService, private instituteServices : InstituteManagementService,
    private _snackbar : MatSnackBar) { }

  ngOnInit(): void {

    this.getInstituteList();
  }

  getSubscriptionCategories()
  {
    this.libCategoryServices.getSubscriptionCategories().subscribe(
      data => {
        this.subscriptions = data as Array<any>;
      },
      err=>
      {
        this._snackbar.open('Error in loading subscription categories',null,{duration:5000})
      }
    )
  }

  getInstituteList()
  {
    this.instituteServices.get_institutes().subscribe(
      data=>{
        this.institutes = data as Array<any>;
      },
      err => {
        this._snackbar.open("Error in Loading the Institute List. Please try after few minutes!",null,{duration : 5000});
      }
    )
  }

}
