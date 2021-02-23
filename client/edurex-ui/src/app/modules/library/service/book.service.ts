import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {config} from 'src/conf';
import { Book } from '../modules/book-explorer/models/book';
@Injectable({
  providedIn: 'root'
})
export class BookService {

  URL = config.host + "library/books/";
  constructor(private httpClient : HttpClient) { }

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
    return this.httpClient.get(this.URL+"list/latest/"+latest_number,{headers:headers})
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
    return this.httpClient.get(this.URL+"count/"+category + "/" + subcategory,{headers : headers})
  }

  getBook(category : String, subcategory : String, books_per_page : Number, page : Number)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    return this.httpClient.get(this.URL+"list/"+category+"/" + subcategory + "/" + books_per_page + 
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