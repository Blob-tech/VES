import { Component, OnInit, AfterContentInit } from '@angular/core';
import { BookService } from 'src/app/modules/library/service/book.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { config } from "src/conf";

@Component({
  selector: 'app-view-book',
  templateUrl: './view-book.component.html',
  styleUrls: ['./view-book.component.css']
})
export class ViewBookComponent implements OnInit,AfterContentInit {

  book;
  msg = null;
  language;
  imgUrl = config.host + "thumbnail/";
  docSrc = config.host + "article/";
  logoUrl = config.host + "organisation_logo/"
  bookSrc = "";
  showLoader=true;

  ngclass = "mat-video-responsive";


  constructor(private bookService : BookService,private _snackbar : MatSnackBar
    ,private route : ActivatedRoute) { }

  ngOnInit(): void {

    this.getBookById(this.route.snapshot.paramMap.get('id'));
    this.bookSrc = this.docSrc + this.book.book_source;
    
  }

  ngAfterContentInit()
  {
    this.showLoader = false;
  }

  openPDF(url)
  {
    window.open(url, '_blank');
  }

  getLangById(id : String)
  {
    this.showLoader=true;
    this.bookService.getLangByID(id).subscribe(
      data=>{
        console.log(data);
        this.language = data;
        this.showLoader = false;
      }
    )
  }

  getBookById(id : String)
  {
    this.showLoader = true;
    this.bookService.getBookById(id).subscribe(
      data=>
      {
       
        this.book = data;
        this.showLoader = false;
        
      },
      err=>{
        this._snackbar.open("Error in Loading the book with id :" + id,null,{duration : 5000});
        this.showLoader = false;
      }

    )
  }
}
