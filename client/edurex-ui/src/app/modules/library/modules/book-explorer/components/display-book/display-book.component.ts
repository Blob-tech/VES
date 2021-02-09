import { Component, OnInit } from '@angular/core';
import { BookService } from 'src/app/modules/library/service/book.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, Validators } from '@angular/forms';
import { LibraryCategoryService } from 'src/app/modules/library/service/library-category.service';
import {PageEvent} from '@angular/material/paginator';
import {config} from 'src/conf';

@Component({
  selector: 'app-display-book',
  templateUrl: './display-book.component.html',
  styleUrls: ['./display-book.component.css']
})
export class DisplayBookComponent implements OnInit {
  header_color = ["#bbf2c9","#f4b5f5","#b6e4f0","#f08873","#f0e54f","#79912a","#4a6a87","#ab653f"];

  books=[];
  copyBooks;
  languages;
  filtered_languages;
  msg = null;
  noBook;
  configParams;
  search_author = new FormControl('');
  search_book = new FormControl('');
  search_id = new FormControl('');
  language = new FormControl('');
   // MatPaginator Inputs
   length = 10;
   pageSize = 5;
   pageSizeOptions: number[] = [5, 10, 25, 100];
   pageIndex = 0;

  imgUrl = config.host + "thumbnail/";
  constructor(private bookService : BookService, private route : ActivatedRoute,
    private _snackBar : MatSnackBar,private libCategoryServices : LibraryCategoryService) { }

  ngOnInit(): void {
    this.getConfigParams();
    this.getLanguages();
    this.route.params.subscribe(routeParams => {
      this.getBookCount(routeParams.category,routeParams.subcategory);
      this.getBooks(routeParams.category,routeParams.subcategory,this.pageSize,this.pageIndex+1);
     
    });
  }

  


 

  // MatPaginator Output
  pageEvent: PageEvent;

  handlePageEvent(event: PageEvent) {
    this.length = event.length;
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.route.params.subscribe(routeParams => {
      this.getBookCount(routeParams.category,routeParams.subcategory);
      this.getBooks(routeParams.category,routeParams.subcategory,this.pageSize,this.pageIndex+1);
     
    });
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  getBookCount(category,subcategory)
  {
      this.bookService.getBookCount(category,subcategory).subscribe(
        data=>{
          this.length = Number(data);
        },
        err=>{
          this._snackBar.open("Error in loading the list of books",null,{duration:5000});
      }
      )
  }

  getBooks(category,subcategory,books_per_page,page)
  {
    this.bookService.getBook(category,subcategory,books_per_page,page).subscribe(
      data=>
      {
        this.books = data as Array<any>;
        this.copyBooks =data;
        if(this.books.length == 0)
        {
          this.noBook = "No Book Found ! Please Check your Subscription Categories"
        }
        else
        {
          this.noBook = null;
        }
      },
      err=>{
          this._snackBar.open("Error in loading the list of books",null,{duration:5000});
      }

    )
  }

  deleteBooks(id:String)
  {
    var res = confirm("Are you sure you want to delete this item permanently ?");
    if(res)
    {
      this.bookService.deleteBookById(id).subscribe(
        data=>
        {
          if(JSON.parse(JSON.stringify(data))['msg'])
          {
            this._snackBar.open(JSON.parse(JSON.stringify(data))['msg'],null,{duration:5000});
            this.route.params.subscribe(routeParams => {
            this.getBooks(routeParams.category,routeParams.subcategory,4,1);
            });
          }
          else
          {
            this._snackBar.open(JSON.parse(JSON.stringify(data))['err'],null,{duration:5000});
          }
        },
        err=>
        {
          this._snackBar.open("Server Error : Error in Deleting Books",null,{duration:5000});
        }
      )
    }
  }

  filterByAuthor(event : Event)
  {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    this.books = filterValue != null ? this.copyBooks.filter(value => value.author.toLowerCase().includes(filterValue.toLowerCase())) : this.books;
  }

  filterByName(event : Event)
  {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    this.books = filterValue != null ? this.copyBooks.filter(value => value.book_name.toLowerCase().includes(filterValue.toLowerCase())) : this.books;
  }

  filterById(event : Event)
  {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    this.books = filterValue != null ? this.copyBooks.filter(value => value.book_id.toLowerCase().includes(filterValue.toLowerCase())) : this.books;
  }

  filterByLanguage(filterValue)
  {
    
    this.books = filterValue != null ? this.copyBooks.filter(value => value.language.toLowerCase().includes(filterValue.toLowerCase())) : this.books;
  }
  
  filter_languages(event : Event)
  {
    const langfilterValue = (event.target as HTMLInputElement).value.trim();
    this.filtered_languages= langfilterValue ? this.languages.filter(value => value.name.toLowerCase().includes(langfilterValue.toLowerCase())) : this.languages;
  }


  isNew(date) : Boolean
  {
    let publishedDate = new Date(date.substring(0,4)+"-"+date.substring(5,7)+"-"+date.substring(8,10) + " " + date.substring(11,16));
    let today = new Date(Date.now());
    // console.log("today :" +today)
    // console.log(publishedDate)
    // console.log(today.getTime()-publishedDate.getTime());
    if(today.getTime()-publishedDate.getTime()<=this.configParams.release)
    {
      return false;
    }
    return true;
  }
  getLanguages()
  {
    this.bookService.getLanguages().subscribe(
      data=>{
        this.languages = data ;
      }
      ,
      err=>{
        this._snackBar.open("Error in Loading Languages",null,{duration : 5000});
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
        }
        else
        {
          this._snackBar.open(JSON.parse(JSON.stringify(data))['err'],null,{duration : 5000})
        }
      },
      err=>{
        this._snackBar.open("Error in Loading Library Config Parameters",null,{duration : 5000})
      }
    )
  }
}
