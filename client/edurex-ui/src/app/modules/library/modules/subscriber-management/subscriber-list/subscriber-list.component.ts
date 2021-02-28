import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { SubscriberService } from '../../../service/subscriber.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import {config} from 'src/conf';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { User } from '../models/subscriber';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { LibraryCategoryService } from '../../../service/library-category.service';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { InstituteManagementService } from '../../../service/institute-management.service';
import { Institute } from '../../institute-management/models/institute';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

@Component({
  selector: 'app-subscriber-list',
  templateUrl: './subscriber-list.component.html',
  styleUrls: ['./subscriber-list.component.css']
})
export class SubscriberListComponent implements OnInit {

  subscriberList = [];
  institutes = [];
  noSubs = null;
   // MatPaginator Inputs
   length = 10;
   pageSize = 5;
   pageSizeOptions: number[] = [5, 10, 25, 100];
   pageIndex = 0;
   userView = 'LIST' ;
   bulkaction='';
   imgUrl = config.host + "avatar/";
   onlyActive=false;
   bulckaction='';
   configParams;


   visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredInstitutes: Observable<Institute[]>;
  selectedInstitutes = [];
  

  @ViewChild('insInput') insInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
   
   displayedColumns: string[] = ['select','user_id', 'user_name', 'email', 'phone', 'actions', 'access', 'status'];
   
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    
   dataSource: MatTableDataSource<User>;
  

  constructor(private subscriberService : SubscriberService,private _snacbar : MatSnackBar,
    private instituteService : InstituteManagementService,
    private route : ActivatedRoute,public dialog: MatDialog,private formBuilder : FormBuilder,
    private localStorageService : LocalStorageService, private libraryCategoryService : LibraryCategoryService)
     {
      this.getFilteredInstitutes();
      }

  ngOnInit(): void {

    this.getActiveInstituteList();
    this.getConfigParams();
    this.route.params.subscribe(routeParams => {
      this.getUserCount(routeParams.cat);
      this.getActiveSubscribers(routeParams.cat,this.pageSize,this.pageIndex+1,this.onlyActive);
     
    });
  }

  getFilteredInstitutes()
  {
    this.filteredInstitutes = this.institute.valueChanges.pipe(
      startWith(null),
      map((ins: Institute | null) => ins ? this._filter(ins) : this.institutes.slice()));
  }

  selectedUser : User =
  {
    user_id : '',
    email : '',
    phone : '',
    name :  '',
    address : '',
    password : '',
    avatar : '',
    date_of_registration : new Date(),
    active : true,
    isActivated : true,
    dark_mode : false,
    theme : 'lime-blue',
    isVerified : true
  }

  @Input()
    selection = new SelectionModel<User>(true, []);
  
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
    checkboxLabel(row?: User): string {
      if (!row) {
        return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
      }
      return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.user_id + 1}`;
    }

    // MatPaginator Output
  pageEvent: PageEvent;

  handlePageEvent(event: PageEvent) {
    this.length = event.length;
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.route.params.subscribe(routeParams => {
      this.getUserCount(routeParams.cat);
      this.getActiveSubscribers(routeParams.cat,this.pageSize,this.pageIndex+1,this.onlyActive);
     
    });
     
    // });
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  accessManagerForm = this.formBuilder.group(
    {
      role : ['',[Validators.required]],
      institute : ['',[Validators.required]],
      valid_upto : [''],
    })

  get role()
  {
    return this.accessManagerForm.get('role');
  }

  get institute()
  {
    return this.accessManagerForm.get('institute');
  }

  get valid_upto()
  {
    return this.accessManagerForm.get('valid_upto');
  }

  getUserCount(institute)
  {
      this.subscriberService.getUserCount(institute).subscribe(
        data=>{
          this.length = Number(data);
        },
        err=>{
          this._snacbar.open("Error in loading the list of books",null,{duration:5000});
      }
      )
  }

  

  open(user,content) {
    this.selectedUser = user;
    const dialogRef = this.dialog.open(content);
  }

  getActiveInstituteList()
    {
      this.instituteService.get_institutes().subscribe(
        data=>{
          if(!(JSON.parse(JSON.stringify(data))['err']))
          {
            this.institutes = data as Institute[];
            this.institutes = this.institutes.filter(value => { return value.isActivated == true});
          }
          else
          {
            this._snacbar.open("Error in loading institutes ! "+ data,null, {duration : 5000});
            
          }
        },
        err => {
          this._snacbar.open("Error in loading institutes from edurex database! "+ err,null, {duration : 5000});
            
        })
      }
    
  getActiveSubscribers(institute,users_per_page, page,onlyActive)
  {
    this.subscriberService.get_subscribers(institute,users_per_page,page).subscribe(
      data=>{
        if(!JSON.parse(JSON.stringify(data))['err'])
        {
          this.subscriberList = data as Array<any>;
          if(this.onlyActive == true)
          {
            this.subscriberList = this.subscriberList.filter(value => {return value.isActivated == true});
          }
          this.dataSource = new MatTableDataSource<User>(this.subscriberList);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          if(this.subscriberList.length == 0)
          {
            this.noSubs = "Alert ! No User Found. Please register an User for" + institute;
          }
        }
        else
        {
          this._snacbar.open(JSON.parse(JSON.stringify(data))['err'],null,{duration : 5000});
        }
      },
      err=>{
        this._snacbar.open("Error in loading the subscribers");
      }
    )
  }

  only_active_user()
      {
        this.route.params.subscribe(routeParams => {
          this.getUserCount(routeParams.cat);
          this.getActiveSubscribers(routeParams.cat,this.pageSize,this.pageIndex+1,this.onlyActive);
         
        });
        

      }

  deactivate_user(state:string,id : string)
      {
        this.subscriberService.deactivate_subscribers(state,id).subscribe(
          data=>{
            if(!(JSON.parse(JSON.stringify(data))['err']))
            {
              this._snacbar.open(data['msg'],null,{duration : 5000});
              this.route.params.subscribe(routeParams => {
                this.getUserCount(routeParams.cat);
                this.getActiveSubscribers(routeParams.cat,this.pageSize,this.pageIndex+1,this.onlyActive);
               
              });
            }
            else
            {
              this._snacbar.open(data['err'],null,{duration : 5000});
            }

          },
          err=>{
            this._snacbar.open("Error ! " + JSON.stringify(err), null , {duration : 50000});

          }
        )
      }

      delete_user(id : string)
      {
        var res=confirm("Are you sure , you want to delete this user ? Alert ! It is alays suggested to deactivate an user"+
        "for future retrieval. Deleting will result in permanent deletion of data");
        if(res == true)
        {
          console.log("Agni");
        this.subscriberService.delete_subscribers(id).subscribe(
          data=>{
            if(!(JSON.parse(JSON.stringify(data))['err']))
            {
              this._snacbar.open(data['msg'],null,{duration : 5000});
              this.route.params.subscribe(routeParams => {
                this.getUserCount(routeParams.cat);
                this.getActiveSubscribers(routeParams.cat,this.pageSize,this.pageIndex+1,this.onlyActive);
                location.reload();
              });
            }
            else
            {
              this._snacbar.open(data['err'],null,{duration : 5000});
            }

          },
          err=>{
            this._snacbar.open("Error ! " + JSON.stringify(err), null , {duration : 50000});

          }
        )
      }
    }

    bulk_action(op : String)
      {
        if(op == "DELETE")
        {
          var res = confirm("Are you sure want to delete " + this.selection.selected.length  + " Users ? Alert ! It will permanently delete the users and " +
        "all its related contents. Hence it is always advisable to deactivate the user for future referrence. ");
        if( res == true) {
        this.subscriberService.delete_many_subscriber(this.selection.selected).subscribe(
          data=>
          { 
            this._snacbar.open(JSON.parse(JSON.stringify(data))['msg'],null,{duration:5000});
            this.route.params.subscribe(routeParams => {
              this.getUserCount(routeParams.cat);
              this.getActiveSubscribers(routeParams.cat,this.pageSize,this.pageIndex+1,this.onlyActive);
            });
          },
          err=>
          {
            this._snacbar.open("Error in deleting Users. Please try after few minutes"+JSON.stringify(err),null, {duration : 50000});
          }

        )
      }
    }
    else if(op == "DEACTIVATE")
        {
          var res = confirm("Are you sure want to deactivate " + this.selection.selected.length  + " Users ?");
        if( res == true) {
        this.subscriberService.deactivate_many_users(this.selection.selected,false).subscribe(
          data=>
          { 
            this._snacbar.open(JSON.parse(JSON.stringify(data))['msg'],null,{duration:5000});
            this.route.params.subscribe(routeParams => {
              this.getUserCount(routeParams.cat);
              this.getActiveSubscribers(routeParams.cat,this.pageSize,this.pageIndex+1,this.onlyActive);
            });
          },
          err=>
          {
            this._snacbar.open("Error in deactivating users. Please try after few minutes"+JSON.stringify(err),null, {duration : 50000});
          }

        )
      }

        }

        else if(op == "ACTIVATE")
        {
          var res = confirm("Are you sure want to activate " + this.selection.selected.length  + " institutes/organisations ?");
        if( res == true) {
        this.subscriberService.deactivate_many_users(this.selection.selected,true).subscribe(
          data=>
          { 
            this._snacbar.open(JSON.parse(JSON.stringify(data))['msg'],null,{duration:5000});
            this.route.params.subscribe(routeParams => {
              this.getUserCount(routeParams.cat);
              this.getActiveSubscribers(routeParams.cat,this.pageSize,this.pageIndex+1,this.onlyActive);
            });
          },
          err=>
          {
            this._snacbar.open("Error in activating Users. Please try after few minutes"+JSON.stringify(err),null, {duration : 50000});
          }

        )
      }
    }


  }

  toggle_view()
  {
    if(this.userView == 'GRID')
    {
      this.userView = 'LIST';
      this.localStorageService.setter('default-user-view',this.userView);
    }
    else
    {
      this.userView = 'GRID';
      this.localStorageService.setter('default-user-view', this.userView);
    }
  }

  getConfigParams()
  {
    this.libraryCategoryService.getConfigParameters().subscribe(
      data=>{
        if(!JSON.parse(JSON.stringify(data))['err'])
        {
          this.configParams = data[0];
          if(this.localStorageService.getter('default-user-view') == null)
          {
            this.userView = this.configParams.default_book_view;
          }
          else
          {
            this.userView = this.localStorageService.getter('default-user-view');
          }
        }
        else
        {
          this._snacbar.open(JSON.parse(JSON.stringify(data))['err'],null,{duration : 5000})
        }
      },
      err=>{
        this._snacbar.open("Error in Loading Library Config Parameters",null,{duration : 5000})
      }
    )
  }

  

  
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our Institute
    if ((value || '').trim()) {
      this.selectedInstitutes.push(value);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.institute.setValue(null);
  }

  remove(ins: Institute): void {
    const index = this.institutes.indexOf(ins);

    if (index >= 0) {
      this.institutes.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.institutes.push(event.option.viewValue);
    this.insInput.nativeElement.value = '';
    this.institute.setValue(null);
  }

  private _filter(value: Institute): Institute[] {
    const filterValue =value.organisation_id;

    return this.institutes.filter(ins => ins.organisation_id.toLowerCase().indexOf(filterValue) === 0);
  }
}


