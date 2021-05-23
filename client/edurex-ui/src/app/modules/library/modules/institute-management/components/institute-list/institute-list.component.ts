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
import { NgbModalConfig,NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { sync } from 'glob';
import { trigger, state, style, animate, transition } from '@angular/animations';



@Component({
    selector: 'app-institute-list',
    templateUrl: './institute-list.component.html',
    styleUrls: ['./institute-list.component.css'],
    providers :[NgbModalConfig,NgbModal],
    animations: [
      trigger('detailExpand', [
        state('collapsed', style({height: '0px', minHeight: '0'})),
        state('expanded', style({height: '*'})),
        transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      ]),
    ],
  })
  export class InstituteListComponent implements OnInit {

    institutes = [];
    noInstitute = null;
    imgUrl = config.host + "organisation_logo/";
    bulkaction ='';
    only_active = false;
    showLoader = true;

    displayedColumns: string[] = ['select','organisation_id', 'organisation_name','actions', 'status'];
   
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    dataSource: MatTableDataSource<Institute>;
    


   constructor(conf: NgbModalConfig,private formBuilder : FormBuilder,private _snackbar : MatSnackBar, private router : Router,
    private instituteService : InstituteManagementService,private modalService: NgbModal,
    private navbar : NavbarService) {
      conf.backdrop = 'static';
      conf.keyboard = false;
     }

    ngOnInit()
    {
        this.getInstituteList();
    }

    currentInstitute : any;

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
  
    getActiveInstituteList()
    {
      this.showLoader = true;
      this.instituteService.get_institutes().subscribe(
        data=>{
          if(!(JSON.parse(JSON.stringify(data))['err']))
          {
            this.institutes = data as Institute[];
            this.institutes = this.institutes.filter(value => { return value.isActivated == true});
            console.log(this.institutes);
            if(this.institutes.length == 0)
            {
              this.noInstitute = "No Active Record Found ! Please Reload the page to get a list of All Institute/Organisation"
            }
            this.dataSource = new MatTableDataSource<Institute>(this.institutes);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.showLoader = false;
          }
          else
          {
            this._snackbar.open("Error in loading institutes ! "+ data,null, {duration : 5000});
            this.showLoader =false
            
          }
        },
        err => {
          this._snackbar.open("Error in loading institutes from edurex database! "+ err,null, {duration : 5000});
            
        })
      }

    getInstituteList()
    {
      this.showLoader=true;
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
            this.showLoader=false;
          }
          else
          {
            this._snackbar.open("Error in loading institutes ! "+ data,null, {duration : 5000});
            this.showLoader=false;
          }
        },
        err => {
          this._snackbar.open("Error in loading institutes from edurex database! "+ err,null, {duration : 5000});
          this.showLoader = false;  
        })
      }

      deactivate_institute(state:string,id : string)
      {
        this.instituteService.deactivate_institutes(state,id).subscribe(
          data=>{
            if(!(JSON.parse(JSON.stringify(data))['err']))
            {
              this._snackbar.open(data['msg'],null,{duration : 5000});
              if(this.only_active)
              {
                this.getActiveInstituteList();
              }
            }
            else
            {
              this._snackbar.open(data['err'],null,{duration : 5000});
            }

          },
          err=>{
            this._snackbar.open("Error ! " + JSON.stringify(err), null , {duration : 50000});

          }
        )
      }

      view_institute(content,organisation_id : string)
      {
        this.instituteService.view_institute(organisation_id).subscribe(
          data=> {
            if(!(JSON.parse(JSON.stringify(data))['err']))
            {
              this.currentInstitute = data[0] ;
              this.open(content);
            }
          },
          err=>
          {
            this._snackbar.open("Error in loading this institute ! "+ err,null, {duration : 5000});
          }
        )
       
        this.open(content);
      }

      open(content)
      {
        this.modalService.open(content,{size : 'lg',centered : true})
      }

      only_active_institute()
      {
        if(this.only_active == true)
        {
          this.getInstituteList();
          
          
        }
        else
        {
          this.getActiveInstituteList();
          
        }

      }

      bulk_action(op : String)
      {
        if(op == "DELETE")
        {
          var res = confirm("Are you sure want to delete " + this.selection.selected.length  + " institutes/organisations ? Alert ! It will permanently delete the institute and " +
        "all its related contents. Hence it is always advisable to deactivate the institute for future referrence. ");
        if( res == true) {
        this.instituteService.delete_many_institutes(this.selection.selected).subscribe(
          data=>
          { 
            this._snackbar.open(JSON.parse(JSON.stringify(data))['msg'],null,{duration:5000});
            this.getInstituteList();
          },
          err=>
          {
            this._snackbar.open("Error in deleting institute/organisation. Please try after few minutes"+JSON.stringify(err),null, {duration : 50000});
          }

        )
      }
        }
        else if(op == "DEACTIVATE")
        {
          var res = confirm("Are you sure want to deactivate " + this.selection.selected.length  + " institutes/organisations ?");
        if( res == true) {
        this.instituteService.deactivate_many_institutes(this.selection.selected,false).subscribe(
          data=>
          { 
            this._snackbar.open(JSON.parse(JSON.stringify(data))['msg'],null,{duration:5000});
            this.getInstituteList();
            location.reload();
          },
          err=>
          {
            this._snackbar.open("Error in deactivating institute/organisation. Please try after few minutes"+JSON.stringify(err),null, {duration : 50000});
          }

        )
      }

        }

        else if(op == "ACTIVATE")
        {
          var res = confirm("Are you sure want to activate " + this.selection.selected.length  + " institutes/organisations ?");
        if( res == true) {
        this.instituteService.deactivate_many_institutes(this.selection.selected,true).subscribe(
          data=>
          { 
            this._snackbar.open(JSON.parse(JSON.stringify(data))['msg'],null,{duration:5000});
            this.getInstituteList();
            location.reload();
          },
          err=>
          {
            this._snackbar.open("Error in activating institute/organisation. Please try after few minutes"+JSON.stringify(err),null, {duration : 50000});
          }

        )
      }

        }
      }

      delete_institute(id : String)
      {
        var res = confirm("Are you sure want to delete this institution ? Alert ! It will permanently delete the institute and " +
        "all its related contents. Hence it is always advisable to deactivate the institute for future referrence. ");
        if( res == true) {
        this.instituteService.delete_institutes(id).subscribe(
          data=>
          { 
            this._snackbar.open(JSON.parse(JSON.stringify(data))['msg'],null,{duration:5000});
            this.getInstituteList();
            location.reload();
          },
          err=>
          {
            this._snackbar.open("Error in deleting institute from the organisation. Please try after few minutes"+JSON.stringify(err),null, {duration : 50000});
          }

        )
      }
    }
    }