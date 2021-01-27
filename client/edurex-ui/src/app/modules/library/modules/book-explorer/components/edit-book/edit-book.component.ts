import { Component, OnInit } from '@angular/core';
import { BookService } from 'src/app/modules/library/service/book.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { FileValidator } from 'ngx-material-file-input';
import { LibraryCategoryService } from 'src/app/modules/library/service/library-category.service';
import { JsonPipe } from '@angular/common';
import {config} from 'src/conf';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.css'],
  providers : [NgbModalConfig, NgbModal]
})
export class EditBookComponent implements OnInit {

  imgUrl : String;
  url = "assets/images/doc.png";
  ishidden = true;
  configParams;
  thumbnailprogress: number;
  docprogress : number;
  message = null;
  error = null;
  currentBook;
  constructor(private bookService : BookService, private route : ActivatedRoute,
    private _snackbar : MatSnackBar,private formBuilder : FormBuilder,
    private libCategoryServices : LibraryCategoryService,
    config: NgbModalConfig, private modalService: NgbModal) {
      config.backdrop = 'static';
    config.keyboard = false;
     }

  ngOnInit(): void {
    this.getBookById(this.route.snapshot.paramMap.get('id'));
    this.getCategories();
    this.getSubscriptionCategories();
    this.imgUrl = config.host + "thumbnail/"
  }


  ngOnChanges() : void {
  }

  ngDoCheck() : void
  {
    if(this.categories.find(value => value.book_category == this.editBookForm.value['category']))
    {
      let subcat = this.categories.find(value => value.book_category == this.editBookForm.value['category']);
      this.subcategories = subcat.book_subCategory;
      
    }
    
  }

  getBookById(id : String)
  {
    this.bookService.getBookById(id).subscribe(
      data=>
      {
       
        this.currentBook = data;
        this.editBookForm.patchValue({name : this.currentBook.book_name,
          author : this.currentBook.author, description : this.currentBook.description,
          subscription : this.currentBook.subscription,
           publisher : this.currentBook.publisher,
          category : this.currentBook.category, subcategory : this.currentBook.subcategory,
        },{emitEvent : true});
      },
      err=>{
        this._snackbar.open("Error in Loading the book with id :" + id,null,{duration : 5000});
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
          this.book.setValidators([Validators.required, FileValidator.maxContentSize(this.configParams.doc_size*1024*1024)]);
          this.cover.get('cover').setValidators([Validators.required, FileValidator.maxContentSize(this.configParams.img_size*1024*1024)]);
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
  editBookForm = this.formBuilder.group(
    {
      name : ['',[Validators.required, Validators.maxLength(200)]],
      author : ['',[Validators.required, Validators.maxLength(100),Validators.pattern('^[a-zA-Z. \'\t\r\s]*$')]],
      publisher : ['',[Validators.required, Validators.maxLength(100),Validators.pattern('^[a-zA-Z. \'\t\r\s]*$')]],
      description : ['',[Validators.required,Validators.maxLength(500)]],
      category : ['',[Validators.required]],
      subcategory : [''],
      subscription : ['',Validators.required],
    })
   cover = new FormControl('');
   book = new FormControl('');


  submitDisabled()
  {
    if(this.editBookForm.status == "VALID")
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
  get name()
  {
    return this.editBookForm.get('name');
  }

  get author()
  {
    return this.editBookForm.get('author');
  }

  get publisher()
  {
    return this.editBookForm.get('publisher');
  }

  get description()
  {
    return this.editBookForm.get('description');
  }

  get category()
  {
    return this.editBookForm.get('category');
  }

  get subcategory()
  {
    return this.editBookForm.get('subcategory');
  }

  get subscription()
  {
    return this.editBookForm.get('subscription');
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
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredcategories= filterValue != null ? this.categories.filter(value => value.book_category.toLowerCase().includes(filterValue.toLowerCase())) : this.categories;
  }

  filter_subcategories(event : Event)
  {
    const subfilterValue = (event.target as HTMLInputElement).value;
    this.subcategories= subfilterValue ? this.subcategories.filter(value => value.toLowerCase().includes(subfilterValue.toLowerCase())) : this.subcategories;
  }

  openModal(content) {
    this.modalService.open(content,{ size: 'lg' , centered : true});
  }


  updateArticle()
  {
    let editformData = new FormData()
    for ( const key of Object.keys(this.editBookForm.value) ) {
      const value = this.editBookForm.value[key];
      editformData.append(key, value);
    }

    this.bookService.updateArticle(editformData,this.currentBook.book_id).subscribe(
      data=>{
        if(JSON.parse(JSON.stringify(data))['msg'])
        {
          this.error = null;
          this.message = JSON.parse(JSON.stringify(data))['msg'];
        }
        else
        {
          this.message = null;
          this.error = JSON.parse(JSON.stringify(data))['err'];
        }
      },
      err => {
        this.message = null;
        this.error = "Error in updating book, Please try after some times";
      }
    )

  }

  save_thumbnail()
  {
    let formData = new FormData()
    formData.append('thumbnail_image',this.ThumbnailFile);
    this.bookService.editThumbnail(formData,this.currentBook.book_id).subscribe(

      data=>{
        if(JSON.parse(JSON.stringify(data))['msg'])
        {
          this.error = null;
          this.message = JSON.parse(JSON.stringify(data))['msg'];
          this.getBookById(this.currentBook.book_id);
          this.modalService.dismissAll();
        }
        else
        {
          this.message = null;
          this.error = JSON.parse(JSON.stringify(data))['err'];
          this.modalService.dismissAll();
        }
      },
      err => {
        this.message = null;
        this.error = "Error in updating Thumbnail Image, Please try after some times";
        this.modalService.dismissAll();
      } 

    )
  }

  republish()
  {

    let formBook = new FormData()
    formBook.append('book',this.BookFile);
    this.bookService.editBook(formBook,this.currentBook.book_id).subscribe(

      data=>{
        if(JSON.parse(JSON.stringify(data))['msg'])
        {
          this.error = null;
          this.message = JSON.parse(JSON.stringify(data))['msg'];
          this.getBookById(this.currentBook.book_id);
          this.modalService.dismissAll();
        }
        else
        {
          this.message = null;
          this.error = JSON.parse(JSON.stringify(data))['err'];
          this.modalService.dismissAll();
        }
      },
      err => {
        this.message = null;
        this.error = "Error in updating Book, Please try after some times";
        this.modalService.dismissAll();
      } 

    )

  }
}
