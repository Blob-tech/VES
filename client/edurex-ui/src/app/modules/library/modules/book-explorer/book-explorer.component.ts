import { Component, OnInit } from '@angular/core';
import { LibraryCategoryService } from '../../service/library-category.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BookService } from '../../service/book.service';
import {config} from 'src/conf';
import { FormControl } from '@angular/forms';
import { filter } from 'minimatch';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-book-explorer',
  templateUrl: './book-explorer.component.html',
  styleUrls: ['./book-explorer.component.css']
})
export class BookExplorerComponent implements OnInit {

  categories=[];
  copyCategories=[];
  books = [];
  imgUrl = config.host + "thumbnail/";
  navFilter = new FormControl('');
  configParams: any;
  constructor(private libCategoryService : LibraryCategoryService,private bookService : BookService,
    private _snackbar : MatSnackBar,private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getCategories();
    this.getConfigParams();
  }

  getCategories()
  {  
  this.libCategoryService.getArticleCategories().subscribe(
    data => {
      this.categories = data as Array<any>;
      this.copyCategories = data as Array<any>;
    },
    err => {
      this._snackbar.open("Error in loading Article Category",null,{duration : 5000})
    }
  )
  }

  getLatestBooks(latest_number : string)
  { 
    this.bookService.getLatestBooks(latest_number).subscribe(
      data=>{
        this.getConfigParams()
        this.books = data as Array<any>;
      },
      err=>{
        this._snackbar.open("Error in loading Latest release books",null,{duration : 5000})
      }
    )
  }

  isSubCat(cat : Array<any>,filter : string)
  {
    cat.forEach(
      (value) =>{
        if(value.toLowerCase().includes(filter.toLocaleLowerCase()))
        {
          return true;
        }

       }
    );

    return false;

  }

  filterNavigate(event : Event)
  {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    this.categories = filterValue != '' ? this.copyCategories.filter(value =>
      value.book_category.toLowerCase().includes(filterValue.toLowerCase()) 
    ) : this.copyCategories;
  }

  open(content)
  {
    this.modalService.open(content,{size : 'lg',centered : true})
  }

  close()
  {
    this.modalService.dismissAll();
  }

  getConfigParams()
  {
    this.libCategoryService.getConfigParameters().subscribe(
      data=>{
        if(!JSON.parse(JSON.stringify(data))['err'])
        {
          this.configParams = data[0];
          this.getLatestBooks(this.configParams.books_per_page);
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

}
