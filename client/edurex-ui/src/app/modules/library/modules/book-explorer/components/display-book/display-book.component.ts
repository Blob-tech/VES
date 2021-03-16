import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { BookService } from 'src/app/modules/library/service/book.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, Validators } from '@angular/forms';
import { LibraryCategoryService } from 'src/app/modules/library/service/library-category.service';
import {PageEvent, MatPaginator} from '@angular/material/paginator';
import {config} from 'src/conf';
import { MatTableDataSource } from '@angular/material/table';
import { Book } from '../../models/book';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

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
  search='';
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
   pageFilterIndex = 0;
   bookView;
   bulkaction='';
   reset=true;

   displayedColumns: string[] = ['select','book_id', 'book_name', 'author', 'language', 'book-type', 'actions'];
   
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    
   dataSource: MatTableDataSource<Book>;

  imgUrl = config.host + "thumbnail/";
  logoUrl = config.host + "organisation_logo/";
  constructor(private bookService : BookService, private route : ActivatedRoute,
    private _snackBar : MatSnackBar,private libCategoryServices : LibraryCategoryService,
    private localStorageService : LocalStorageService, private router : Router) { }

  ngOnInit(): void {
    this.getConfigParams();
    this.getLanguages();
    this.route.params.subscribe(routeParams => {
      this.getBookCount(routeParams.category,routeParams.subcategory);
      this.getBooks(routeParams.category,routeParams.subcategory,this.pageSize,this.pageIndex+1,null,null);
     
    });
  }

  selectedBook : Book =
{
  book_id : '',
  book_name : '',
  author : '',
  institute_id : '',
  institute_client_id : '',
  institute_name : '',
  institute_avatar : '',
  description : '',
  category : '',
  subcategory: '',
  book_source : '',
  thumbnail_source : '',
  publisher : '',
  subscription : [],
  language : '',
  date_of_published : new Date(),
  total_view : 0,
  total_like : 0,
  total_dislike : 0,
  total_download : 0,
  total_rating : 0,
  rating_count : 0,
  type : '',
  active : true,
  
}

  @Input()
    selection = new SelectionModel<Book>(true, []);
  
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
    checkboxLabel(row?: Book): string {
      if (!row) {
        return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
      }
      return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.book_id + 1}`;
    }


 

  // MatPaginator Output
  pageEvent: PageEvent;

  handlePageEvent(event: PageEvent) {
    this.length = event.length;
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    if(this.search == '')
    {
      this.route.params.subscribe(routeParams => {
        this.getBookCount(routeParams.category,routeParams.subcategory);
        this.getBooks(routeParams.category,routeParams.subcategory,this.pageSize,this.pageIndex+1,null,null);
       
      });

    }
    else
    {
      this.advance_search_click(this.search,false);
    }

    
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

  getFilterBookCount(searchkey)
  {
      this.bookService.getFilterBookCount(searchkey).subscribe(
        data=>{
          this.length = Number(data);
        },
        err=>{
          this._snackBar.open("Error in loading the list of books",null,{duration:5000});
      }
      )
  }

  advance_search(event : Event)
  {
    const searchkey = (event.target as HTMLInputElement).value.trim();
    this.pageFilterIndex = 0;
    this.route.params.subscribe(routeParams => {
      if(searchkey == '')
      {
        this.pageIndex=0;
        this.getBookCount(routeParams.category,routeParams.subcategory);
        this.getBooks(routeParams.category,routeParams.subcategory,this.pageSize,this.pageIndex+1,null,null);
      }
      else
      {
        this.getFilterBookCount(searchkey);
        this.getBooksBySearch(searchkey,this.pageSize,this.pageFilterIndex+1);  
      }
    });

  }

  advance_search_click(searchkey,reset)
  {
    if(reset == true)
    {
      this.pageFilterIndex = 0;
    }
    this.route.params.subscribe(routeParams => {
      if(this.search == '')
      {
        this.pageIndex = 0
        this.getBookCount(routeParams.category,routeParams.subcategory);
        this.getBooks(routeParams.category,routeParams.subcategory,this.pageSize,this.pageIndex+1,null,null);
      }
      else
      {
        this.getFilterBookCount(searchkey);
        this.getBooksBySearch(searchkey,this.pageSize,this.pageFilterIndex+1); 
      }
    });

  }

  getBooks(category,subcategory,books_per_page,page,filter,cond)
  {
    if(filter != null && cond != null)
    {
      this.bookService.getFilteredBooks(filter,cond,books_per_page,page).subscribe(
        data=>
        {
          this.books = data as Array<any>;
          this.dataSource = new MatTableDataSource<Book>(this.books);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
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

      return;

    }
    this.bookService.getBook(category,subcategory,books_per_page,page).subscribe(
      data=>
      {
        this.books = data as Array<any>;
        this.dataSource = new MatTableDataSource<Book>(this.books);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
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
            this.getBooks(routeParams.category,routeParams.subcategory,this.pageSize,this.pageIndex+1,null,null);
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

  getBooksBySearch(searchkey,books_per_page, page)
  {
    this.bookService.getBooksByAdvanceSearch(searchkey,books_per_page,page).subscribe(
      data=>{
        if(!JSON.parse(JSON.stringify(data))['err'])
        {
          this.books = data as Array<any>;
          this.dataSource = new MatTableDataSource<Book>(this.books);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.copyBooks =data;
          if(this.books.length == 0)
          {
            this.noBook = "No Book Found ! Please Check your Subscription Categories"
          }
          else
          {
            this.noBook = null;
          }
        }
        else
        {
          this._snackBar.open(JSON.parse(JSON.stringify(data))['err'],null,{duration : 5000});
        }
      },
      err=>{
        this._snackBar.open("Error in loading the Books");
      }
    )
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

  toggle_view()
  {
    if(this.bookView == 'GRID')
    {
      this.bookView = 'LIST';
      this.localStorageService.setter('default-book-view',this.bookView);
    }
    else
    {
      this.bookView = 'GRID';
      this.localStorageService.setter('default-book-view', this.bookView);
    }
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

  bulk_action(op : String)
      {
        if(op == "DELETE")
        {
          var res = confirm("Are you sure want to delete " + this.selection.selected.length  + " books ?");
        if( res == true) {
        this.bookService.delete_many_books(this.selection.selected).subscribe(
          data=>
          { 
            this._snackBar.open(JSON.parse(JSON.stringify(data))['msg'],null,{duration:5000});
            this.route.params.subscribe(routeParams => {
              this.getBookCount(routeParams.category,routeParams.subcategory);
              this.getBooks(routeParams.category,routeParams.subcategory,this.pageSize,this.pageIndex+1,null,null);
             
            });
          },
          err=>
          {
            this._snackBar.open("Error in deleting Books. Please try after few minutes"+JSON.stringify(err),null, {duration : 50000});
          }

        )
      }
        }
        
      }

      viewBook(id:String)
      {
        this.router.navigateByUrl("/e-library/book-explorer/view/"+id);
      }

  getConfigParams()
  {
    this.libCategoryServices.getConfigParameters().subscribe(
      data=>{
        if(!JSON.parse(JSON.stringify(data))['err'])
        {
          this.configParams = data[0];
          if(this.localStorageService.getter('default-book-view') == null)
          {
            this.bookView = this.configParams.default_book_view;
          }
          else
          {
            this.bookView = this.localStorageService.getter('default-book-view');
          }
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
