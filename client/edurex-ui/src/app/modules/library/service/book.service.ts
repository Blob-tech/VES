import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {config} from 'src/conf';
import { Book } from '../modules/book-explorer/models/book';
import { SessionStorageService } from 'src/app/shared/services/session-storage.service';
@Injectable({
  providedIn: 'root'
})
export class BookService {

  URL = config.host + "library/books/";
  constructor(private httpClient : HttpClient, private sessionStorageService : SessionStorageService) { }

  getCurrentInstituteId()
  {
    return (this.sessionStorageService.getter('current_institute').organisation_id);
  }

  getLanguages()
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.get(this.URL+"languages/list/",{headers:headers})
  }

  getLangByID(code : String)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.get(this.URL+"languages/get/"+code,{headers:headers})
  }

  getBookById(id : String)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.get(this.URL+"view/" + id,{headers:headers})

  }

  getLatestBooks(latest_number : String)
  {
    
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    let current_institute_id = this.getCurrentInstituteId();
    return this.httpClient.get(this.URL+"list/latest/"+current_institute_id+"/"+latest_number,{headers:headers})
  }

  deleteBookById(id : String)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.put(this.URL+"delete/" + id,{headers:headers})
  }
  getBookCount(category : String , subcategory : String)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    let current_institute_id = this.getCurrentInstituteId();
    return this.httpClient.get(this.URL+"count/"+current_institute_id+"/"+ category + "/" + subcategory,{headers : headers})
  }

  getFilterBookCount(searchkey : String)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    let current_institute_id = this.getCurrentInstituteId();
    return this.httpClient.get(this.URL+"count/"+ current_institute_id+"/"+searchkey,{headers : headers})
  }



  getBook(category : String, subcategory : String, books_per_page : Number, page : Number)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    let current_institute_id = this.getCurrentInstituteId();
    return this.httpClient.get(this.URL+"list/"+current_institute_id+"/"+category+"/" + subcategory + "/" + books_per_page + 
    "/" + page,{headers:headers})
  }

  getBooksByAdvanceSearch(searchkey : String, books_per_page : String,page : String)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    let current_institute_id = this.getCurrentInstituteId();
    return this.httpClient.get(this.URL+"list/"+current_institute_id+"/"+searchkey + "/" + books_per_page + 
    "/" + page,{headers:headers})
  }

  getFilteredBooks(filter : String,cond : String, books_per_page : Number, page : Number)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.get(this.URL+"filter-list/"+filter+"/" + cond + "/" + books_per_page + 
    "/" + page,{headers:headers})
  }

  addBook(book : FormData)
  {

    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.post(this.URL+"add",book,{headers:headers})

  }

  updateArticle( form : FormData, id : String)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.put(this.URL+"edit/"+id,form,{headers:headers})
  }
 

  editThumbnail(thumbnail : FormData, id : String)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.put(this.URL+"edit/thumbnail/"+id,thumbnail,{headers:headers})
  }

  editBook(book : FormData, id : String)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.put(this.URL+"edit/content/"+id,book,{headers:headers})
  }

  delete_many_books(books : Book[])
  {
    let headers = new HttpHeaders();
    headers.append('content-Type','application/json');

    return this.httpClient.put(this.URL + 'bulkactions/delete/'+ books.length,books,{headers : headers})
  }
}