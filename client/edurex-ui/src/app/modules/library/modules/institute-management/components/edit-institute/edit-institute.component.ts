import { Component, OnInit, OnChanges, ViewChild, EventEmitter, TemplateRef } from '@angular/core';
import { FormBuilder, Validators, ValidatorFn, FormGroup, FormControl } from '@angular/forms';
import {config} from 'src/conf';

import { MatSnackBar } from '@angular/material/snack-bar';
import { FileValidator } from 'ngx-material-file-input';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


import { NavbarService } from 'src/app/components/navbar/navbar.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LibraryCategoryService } from 'src/app/modules/library/service/library-category.service';
import { InstituteManagementService } from 'src/app/modules/library/service/institute-management.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommunicationService } from 'src/app/modules/library/service/communication.service';







@Component({
  selector: 'app-edit-institute',
  templateUrl: './edit-institute.component.html',
  styleUrls: ['./edit-institute.component.css'],
  providers : [NgbModalConfig, NgbModal]
})
export class EditInstituteComponent implements OnInit {


  showLoader = true;
  public message = null;
  public error = null;
  public ishidden = true;
  public languages;
  public current_institute;
  public configParams;
  public maxImgSize : number;
  public thumbnailprogress : number;
  avatarprogress: number;
  docprogress : number;
  url = "assets/images/user.png";
  imgUrl = config.host + "organisation_logo/";

  @ViewChild('callEditLogo') callEditLogo: TemplateRef<any>;

  constructor(private formBuilder : FormBuilder, private libCategoryServices : LibraryCategoryService,
    private _snackbar : MatSnackBar, private router : Router,private instituteService :InstituteManagementService,
    private navbar : NavbarService, private route : ActivatedRoute, conf: NgbModalConfig, private modalService: NgbModal,
    public dialog: MatDialog, private communicationService : CommunicationService)
     {
      conf.backdrop = 'static'; 
    conf.keyboard = false;  }

    
  ngOnInit(): void {
    
    this.get_institute(this.route.snapshot.paramMap.get('id'));
    this.getConfigParams();
  }

  ngOnChanges() : void {
  }

  ngDoCheck() : void
  {
    
    
  }
 
  logo = new FormControl('');
  get_institute(id:String)
  {
    this.showLoader = true;
    this.instituteService.view_institute(id).subscribe(
      data=>{
        this.current_institute = data[0];
        this.url = this.current_institute.avatar ? this.imgUrl + this.current_institute.avatar : "assets/images/insimg.png";
        this.editOrganisationForm.patchValue({
          organisation_name : this.current_institute.organisation_name,
          contact_email : this.current_institute.contact_email,
          contact_phone : this.current_institute.contact_phone,
          contact_person : this.current_institute.contact_person,
          address : this.current_institute.address,
          client_id : this.current_institute.client_id,
        },{emitEvent : true});
        this.showLoader = false;
      },
      err=>{
        this._snackbar.open("Error in Loading the Institute with id :" + this.route.snapshot.paramMap.get('id'),null,{duration : 5000});
        this.showLoader = false;
      }
    )
  }

  getConfigParams()
  {
    this.showLoader = true;
    this.libCategoryServices.getConfigParameters().subscribe(
      data=>{
        if(!JSON.parse(JSON.stringify(data))['err'])
        {
          this.configParams = data[0];
          this.logo.setValidators([FileValidator.maxContentSize(this.configParams.logo_size*1024*1024)]);
        }
        else
        {
          this._snackbar.open(JSON.parse(JSON.stringify(data))['err'],null,{duration : 5000})
        }
        this.showLoader = false;
      },
      err=>{
        this._snackbar.open("Error in Loading Library Config Parameters",null,{duration : 5000});
        this.showLoader = false;
      }
    )
  }

  dismissMessageAlert()
  {
    this.message = null;
  }

  dismissErrorAlert()
  {
    this.error = null;
  }

  
  hide = true;
  hide2=true;



  editOrganisationForm = this.formBuilder.group(
    {
      organisation_name : ['',[Validators.required, Validators.maxLength(200)]],
      contact_email :['',[Validators.required,Validators.pattern("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")]],
      contact_phone :['',[Validators.required]],
      contact_person : ['',[Validators.required, Validators.maxLength(100)]],
      address : ['',[Validators.maxLength(500)]],
      client_id :['',[Validators.required, Validators.maxLength(10)]],
      avatar : ['']//1 MB
    },
  )

 

  get controls() {
    return this.editOrganisationForm.controls;
  }

  submitDisabled()
  {
    if(this.editOrganisationForm.status == "VALID")
    {
      return false;
    }
    else
    {
      return true;
    }
  }

  get organisation_name()
  {
    return this.editOrganisationForm.get('organisation_name');
  }
  get contact_email()
  {
    return this.editOrganisationForm.get('contact_email');
  }
 get contact_phone()
 {
   return this.editOrganisationForm.get('contact_phone');
 }
 get client_id()
 {
   return this.editOrganisationForm.get('client_id');
 }
  get contact_person()
  {
    return this.editOrganisationForm.get('contact_person');
  }

  get address()
  {
    return this.editOrganisationForm.get('address');
  }
  
  get avatar()
  {
    return this.editOrganisationForm.get('avatar');
  }

  
  
  openEditLogo() {
    const dialogRef = this.dialog.open(this.callEditLogo);
  }
 

 
  

  
  imageFile : any;
  onSelectAvatar(event) {
    this.avatarprogress = 0;
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      this.imageFile = event.target.files[0]
      reader.onload = (event: any) => {
        this.avatarprogress = Math.round(100 * event.loaded / event.total);
        this.url = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  

 update(id : String)
  {
    this.showLoader = true;
    //console.log(this.editOrganisationForm);
    let formData = new FormData()
    
    
    for ( const key of Object.keys(this.editOrganisationForm.value) ) {
      const value = this.editOrganisationForm.value[key];
      formData.append(key, value);
    }

    this.instituteService.update_institute(formData,id).subscribe(
      data=>
      {
        
        if(!(JSON.parse(JSON.stringify(data))['err']))
        {
          this.error = null;
          this.message = JSON.parse(JSON.stringify(data))['msg'];
          this._snackbar.open(JSON.parse(JSON.stringify(data))['msg'],null,{duration:5000})
          this.router.navigateByUrl('e-library/institute/institute-management/list/all');
        }
        else
        {
          this.message = null;
          this.error =  JSON.parse(JSON.stringify(data))['err'];
        }
        this.showLoader = false;
      },
      err =>
      {
        this.message = null;
        this.error = "Error in updating an institute to Edurex Database. Please try after few minutes.";
        this.showLoader = false;
      }
    )
    
  }


  LogoFile : any;
  onSelectThumbnail(event) {
    this.thumbnailprogress = 0;
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      this.LogoFile = event.target.files[0]
      reader.onload = (event: any) => {
        this.thumbnailprogress = Math.round(100 * event.loaded / event.total);
        this.url = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  save_logo()
  {
    this.showLoader = true;
    let formData = new FormData()
    formData.append('logo',this.LogoFile);
    this.instituteService.edit_institute_logo(formData,this.current_institute.organisation_id.toString().trim()).subscribe(
      data=>{
        if(JSON.parse(JSON.stringify(data))['msg'])
        {
          this.error = null;
          this.message = JSON.parse(JSON.stringify(data))['msg'];
          this._snackbar.open(JSON.parse(JSON.stringify(data))['msg'],null,{duration:5000});
          this.get_institute(this.current_institute.organisation_id);
          this.showLoader = false;
        }
        else
        {
          this.message = null;
          this.error =  JSON.parse(JSON.stringify(data))['err'];          
          this.showLoader =false;
        }
      },
      err => {
        this.message = null;
        this.error = "Error in updating an institute logo to Edurex Database. Please try after few minutes."; 
        this.showLoader = false;
      } 

    )
  }



}
