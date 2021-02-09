import { Component, OnInit, ViewChild, Input } from '@angular/core';
import {config} from 'src/conf';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavbarService } from 'src/app/components/navbar/navbar.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { InstituteManagementService } from 'src/app/modules/library/service/institute-management.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource} from '@angular/material/table';
import { Institute } from '../../models/institute';
import { SelectionModel } from '@angular/cdk/collections';



@Component({
    selector: 'app-institute-list',
    templateUrl: './institute-list.component.html',
    styleUrls: ['./institute-list.component.css'],
  })
  export class InstituteListComponent implements OnInit {

    institutes = [];
    noInstitute = null;
    imgUrl = config.host + "organisation_logo/";

    displayedColumns: string[] = ['select','organisation_id', 'organisation_name', 'actions'];
   
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    dataSource: MatTableDataSource<Institute>;
    


   constructor(private formBuilder : FormBuilder,private _snackbar : MatSnackBar, private router : Router,
    private instituteService : InstituteManagementService,
    private navbar : NavbarService) {
      
     }

    ngOnInit()
    {
        this.getInstituteList();
    }

    selectedInstitute : Institute=
  {
    organisation_id : "",
    client_id : "",
    organisation_name : "" ,
    contact_email : "",
    contact_phone : "",
    contact_name : "",
    contact_person : "",
    address : "",
    avatar : "",
    date_of_registration : "",
    active : true,
    is_activated : true
  };

    @Input()
    selection = new SelectionModel<Institute>(true, []);
  
    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }
  
    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
      this.isAllSelected() ?
          this.selection.clear() :
          this.dataSource.data.forEach(row => this.selection.select(row));
    }
  
    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: Institute): string {
      if (!row) {
        return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
      }
      return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.organisation_id + 1}`;
    }

    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  

    getInstituteList()
    {
      this.instituteService.get_institutes().subscribe(
        data=>{
          if(!(JSON.parse(JSON.stringify(data))['err']))
          {
            this.institutes = data as Institute[];
            if(this.institutes.length == 0)
            {
              this.noInstitute = "No Record Found ! Please click on create icon to register an institute"
            }
            this.dataSource = new MatTableDataSource<Institute>(this.institutes);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
          }
          else
          {
            this._snackbar.open("Error in loading institutes ! "+ data,null, {duration : 5000});
            
          }
        },
        err => {
          this._snackbar.open("Error in loading institutes from edurex database! "+ err,null, {duration : 5000});
            
        })
      }

      delete_institute(id : String)
      {
        var res = confirm("Are you sure want to delete this institution ?");
        if( res == true) {
        this.instituteService.delete_institutes(id).subscribe(
          data=>
          { 
            this._snackbar.open(JSON.parse(JSON.stringify(data))['msg'],null,{duration:5000});
            this.getInstituteList();
          },
          err=>
          {
            this._snackbar.open("Error in deleting institute from the organisation. Please try after few minutes"+JSON.stringify(err),null, {duration : 50000});
          }

        )
      }
    }
    }