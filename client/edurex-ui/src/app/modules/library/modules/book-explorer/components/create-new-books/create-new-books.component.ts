import { Component, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LibraryCategoryService } from 'src/app/modules/library/service/library-category.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BookService } from 'src/app/modules/library/service/book.service';
import { FileValidator } from 'ngx-material-file-input';
import { Router } from '@angular/router';
import { NavbarService } from 'src/app/components/navbar/navbar.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { SessionStorageService } from 'src/app/shared/services/session-storage.service';


@Component({
  selector: 'app-create-new-books',
  templateUrl: './create-new-books.component.html',
  styleUrls: ['./create-new-books.component.css']
})
export class CreateNewBooksComponent implements OnInit,OnChanges {

  message = null;
  error = null;
  ishidden = true;
  languages;
  counter;
  filtered_languages = [];
  configParams;
  maxImgSize : number;
  thumbnailprogress: number;
  docprogress : number;
  url = "assets/images/doc.png";
  constructor(private formBuilder : FormBuilder, private libCategoryServices : LibraryCategoryService,
    private _snackbar : MatSnackBar,private bookService : BookService, private router : Router,
    private navbar : NavbarService, private localStorageService : LocalStorageService,
    private sessionStorageService : SessionStorageService) { }

    
  ngOnInit(): void {
    this.getCategories();
    this.getSubscriptionCategories();
    this.getConfigParams();
    this.getLanguages();
    this.getCounter();
    
  }

  ngOnChanges() : void {
  }

  ngDoCheck() : void
  {
    if(this.categories.find(value => value.book_category == this.createBookForm.value['category']))
    {
      let subcat = this.categories.find(value => value.book_category == this.createBookForm.value['category']);
      this.subcategories = subcat.book_subCategory;
      
    }
    
  }

  dismissMessageAlert()
  {
    this.message = null;
  }

  dismissErrorAlert()
  {
    this.error = null;
  }

  categories = [];
  subscriptions=[];
  filteredcategories =[];
  subcategories =[]
  createBookForm = this.formBuilder.group(
    {
      book_id : ['',[Validators.required]],
      name : ['',[Validators.required, Validators.maxLength(200)]],
      author : ['',[Validators.required, Validators.maxLength(100),Validators.pattern('^[a-zA-Z. \'\t\r\s]*$')]],
      publisher : ['',[Validators.required, Validators.maxLength(100),Validators.pattern('^[a-zA-Z. \'\t\r\s]*$')]],
      description : ['',[Validators.required,Validators.maxLength(500)]],
      category : ['',[Validators.required]],
      subcategory : [''],
      subscription : ['',Validators.required],
      language : ['',Validators.required],
      book : [''],//100 MB
      cover : ['']//1 MB
    }
  )

  submitDisabled()
  {
    if(this.createBookForm.status == "VALID")
    {
      return false;
    }
    else
    {
      return true;
    }
  }

  isSubCategoryDisabled()
  {
    if(this.category.value != '')
    {
      if(this.categories.find(value => value.book_category == this.category.value))
      {
        if(this.categories.find(value => value.book_category == this.category.value).book_subCategory.length > 0)
        {
          return false;
        }
      }
    }
    return true;
  }

  get book_id()
  {
    return this.createBookForm.get('book_id');
  }
  get name()
  {
    return this.createBookForm.get('name');
  }

  get author()
  {
    return this.createBookForm.get('author');
  }

  get publisher()
  {
    return this.createBookForm.get('publisher');
  }

  get description()
  {
    return this.createBookForm.get('description');
  }

  get category()
  {
    return this.createBookForm.get('category');
  }

  get subcategory()
  {
    return this.createBookForm.get('subcategory');
  }

  get subscription()
  {
    return this.createBookForm.get('subscription');
  }

  get cover()
  {
    return this.createBookForm.get('cover');
  }

  get book()
  {
    return this.createBookForm.get('book');
  }
  getCategories()
  {
      this.libCategoryServices.getArticleCategories().subscribe(
        data => {
          this.categories =data as Array<any>;
        },
        err=>
        {
          this._snackbar.open('Error in loading article categories',null,{duration:5000})
        }
      )
  }

  getConfigParams()
  {
    this.libCategoryServices.getConfigParameters().subscribe(
      data=>{
        if(!JSON.parse(JSON.stringify(data))['err'])
        {
          this.configParams = data[0];
          this.createBookForm.get('book').setValidators([Validators.required, FileValidator.maxContentSize(this.configParams.doc_size*1024*1024)]);
          this.createBookForm.get('cover').setValidators([Validators.required, FileValidator.maxContentSize(this.configParams.img_size*1024*1024)]);
        }
        else
        {
          this._snackbar.open(JSON.parse(JSON.stringify(data))['err'],null,{duration : 5000})
        }
      },
      err=>{
        this._snackbar.open("Error in Loading Library Config Parameters",null,{duration : 5000})
      }
    )
  }

  getCounter()
  {
    this.navbar.getCounterList().subscribe(
      data=>{
        this.counter = data;
        const  currentDate = new Date();
        const currentDateYear = currentDate.getFullYear().toString();
        this.createBookForm.patchValue({book_id : this.counter[0].library_prefix+ currentDateYear+this.counter[0].library},{emitEvent : true});
      },
      err=>{
        this._snackbar.open("Error in loading counter",null,{duration : 5000});
      }
    )
  }

  getLanguages()
  {
    this.bookService.getLanguages().subscribe(
      data=>{
        this.languages = data ;
      }
      ,
      err=>{
        this._snackbar.open("Error in Loading Languages",null,{duration : 5000});
      }
    )
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


  resetSubCategory(event : Event)
  {
    this.subcategory.reset();
  }

  ThumbnailFile : any;
  onSelectThumbnail(event) {
    this.thumbnailprogress = 0;
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      this.ThumbnailFile = event.target.files[0]
      reader.onload = (event: any) => {
        this.thumbnailprogress = Math.round(100 * event.loaded / event.total);
        this.url = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  BookFile : any;
  onSelectBook(event) {
    this.docprogress = 0;
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      this.BookFile = event.target.files[0]
      reader.onload = (event: any) => {
        this.docprogress = Math.round(100 * event.loaded / event.total);
        this.url = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  apply_filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    this.filteredcategories= filterValue != null ? this.categories.filter(value => value.book_category.toLowerCase().includes(filterValue.toLowerCase())) : this.categories;
  }

  filter_subcategories(event : Event)
  {
    const subfilterValue = (event.target as HTMLInputElement).value.trim();
    this.subcategories= subfilterValue ? this.subcategories.filter(value => value.toLowerCase().includes(subfilterValue.toLowerCase())) : this.subcategories;
  }

  filter_languages(event : Event)
  {
    const langfilterValue = (event.target as HTMLInputElement).value.trim();
    this.filtered_languages= langfilterValue ? this.languages.filter(value => value.name.toLowerCase().includes(langfilterValue.toLowerCase())) : this.languages;
  }

  addArticle()
  {
    let formData = new FormData()
    formData.append('thumbnail_image',this.ThumbnailFile);
    formData.append('book',this.BookFile)
    for ( const key of Object.keys(this.createBookForm.value) ) {
      const value = this.createBookForm.value[key];
      formData.append(key, value);
    }
    let current_institute = this.sessionStorageService.getter('current_institute');
    formData.append('institute_id',current_institute.organisation_id);
    formData.append('institute_name', current_institute.organisation_name);
    formData.append('institute_client_id', current_institute.client_id);
    formData.append('institute_avatar',current_institute.avatar);

    this.bookService.addBook(formData).subscribe(
      data=>
      {
        this.createBookForm.reset();
        if(!(JSON.parse(JSON.stringify(data))['err']))
        {
          this.error = null;
          this.message = JSON.parse(JSON.stringify(data))['msg'];
          this._snackbar.open(JSON.parse(JSON.stringify(data))['msg'],null,{duration:5000})
          this.router.navigateByUrl('e-library/book-explorer/list/all/all');
        }
        else
        {
          this.message = null;
          this.error =  JSON.parse(JSON.stringify(data))['err'];
        }
      },
      err =>
      {
        this.message = null;
        this.error = "Error in adding Book/Article to Edurex Database. Please try after few minutes."
      }
    )
  }


}
