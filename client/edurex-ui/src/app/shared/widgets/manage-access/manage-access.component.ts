import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriberService } from 'src/app/modules/library/service/subscriber.service';
import { InstituteManagementService } from 'src/app/modules/library/service/institute-management.service';
import { Institute } from 'src/app/modules/library/modules/institute-management/models/institute';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';import { now } from 'moment';
4



@Component({
  selector: 'app-manage-access',
  templateUrl: './manage-access.component.html',
  styleUrls: ['./manage-access.component.css']
})
export class ManageAccessComponent implements OnInit {

  @Input()
  disabled ?: boolean = false;

  @Input()
  access_id = '';

  @Input()
  mode ?: string= 'institute';

  minDate : Date;

  accessList = []
  constructor(private formBuilder : FormBuilder, private subscriberServices : SubscriberService,
    private instituteService : InstituteManagementService, private _snacbar : MatSnackBar,
    public dialog: MatDialog)
     {
       this.minDate  = new Date() ;

      }

  ngOnInit(): void {
    if(this.mode == 'institute')
    {
      this.getActiveInstituteList();
    }
  }

  getActiveInstituteList()
    {
      this.instituteService.get_institutes().subscribe(
        data=>{
          if(!(JSON.parse(JSON.stringify(data))['err']))
          {
            this.accessList = data as Institute[];
            this.accessList = this.accessList.filter(value => { return value.isActivated == true});
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

    resetAccessList(event : Event)
    {
      console.log('Agnibha');
      if((event.target as HTMLInputElement).value.trim() == 'SADMIN')
      {
        this.access_list.setValue('');
      }
    }



  accessManagerForm = this.formBuilder.group(
    {
      role : ['',[Validators.required]],
      access_list : [''],
      valid_upto : [''],
    })

  get role()
  {
    return this.accessManagerForm.get('role');
  }

  get access_list()
  {
    return this.accessManagerForm.get('access_list');
  }

  get valid_upto()
  {
    return this.accessManagerForm.get('valid_upto');
  }


  open(access_id,content)
  {
      const dialogref = this.dialog.open(content)
  }
}
