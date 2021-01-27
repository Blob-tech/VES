import { Component, OnInit } from '@angular/core';
import { LibraryCategoryService } from '../../../service/library-category.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-subscribers',
  templateUrl: './subscribers.component.html',
  styleUrls: ['./subscribers.component.css']
})
export class SubscribersComponent implements OnInit {

  subscriptions=[];
  constructor(private libCategoryServices : LibraryCategoryService, private _snackbar : MatSnackBar) { }

  ngOnInit(): void {

    this.getSubscriptionCategories();
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

}
