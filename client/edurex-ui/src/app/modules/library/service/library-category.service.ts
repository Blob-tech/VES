import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import {config} from 'src/conf';
import { SessionStorageService } from 'src/app/shared/services/session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class LibraryCategoryService {

  URL = config.host;
  constructor(private httpClient : HttpClient, private sessionStorageService : SessionStorageService) { }

  getConfigParameters()
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    let current_institute_id = this.sessionStorageService.getter('current_institute').organisation_id;
    return this.httpClient.get(this.URL+"library/config/list/"+current_institute_id,{headers : headers});
  }

  setConfigParameter(form : any)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    let current_institute_id = this.sessionStorageService.getter('current_institute').organisation_id;
    return this.httpClient.put(this.URL+"library/config/set/" + current_institute_id,form,{headers : headers});
  }

  getArticleCategories()
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    let current_institute_id = this.sessionStorageService.getter('current_institute').organisation_id;
    return this.httpClient.get(this.URL+"library/category/articles/list/"+current_institute_id,{headers : headers});
  }
  
  getCourseTags(nameStartsWith : String)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    let current_institute_id = this.sessionStorageService.getter('current_institute').organisation_id;
    return this.httpClient.get(this.URL + "course/tags/list/"+current_institute_id+"/"+nameStartsWith,{headers:headers});
  }
  getSubscriptionCategoriesById(institute_id)
  {
    let headers = new HttpHeaders();
    
    headers.append("Content-Type","application/json");
    return this.httpClient.get(this.URL+"library/category/subscriptions/list/"+institute_id,{headers : headers});
  }
  getSubscriptionCategories()
  {
    let headers = new HttpHeaders();
    
    headers.append("Content-Type","application/json");
    let current_institute_id = this.sessionStorageService.getter('current_institute').organisation_id;
    return this.httpClient.get(this.URL+"library/category/subscriptions/list/"+current_institute_id,{headers : headers});
  }
  addCourseTag(course_tag : String)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    let current_institute_id = this.sessionStorageService.getter('current_institute').organisation_id;
    let newCourseTag = {
      course_tag : course_tag,
      institute_id : current_institute_id
    }
    return this.httpClient.post(this.URL + "course/tags/add",newCourseTag,{headers : headers }) 
  }

  addCategory(book_category : String)
  {

    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    let current_ins_id = this.sessionStorageService.getter('current_institute').organisation_id;
    let newCategory  = {
      book_category : book_category,
      institute_id : current_ins_id
    }
    return this.httpClient.post(this.URL+"library/category/articles/add",newCategory,{headers:headers})
  }

  addSubscriptionCategory(subscription_category : String)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");
    let current_ins_id = this.sessionStorageService.getter('current_institute').organisation_id;
    let newCategory  = {
      subscription_category : subscription_category,
      institute_id : current_ins_id,
    }
    return this.httpClient.post(this.URL+"library/category/subscriptions/add",newCategory,{headers:headers})
  }

  addSubCategory(book_subCategory : String,book_category_id : String)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");

    let newSubCategory  = {
      book_subCategory : book_subCategory
    }
    return this.httpClient.put(this.URL+"library/category/articles/update/"+book_category_id,newSubCategory,{headers:headers})
  }


  removeSubCategory(book_subCategory : String,book_category_id : String)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");

    let newSubCategory  = {
      book_subCategory : book_subCategory
    }
    return this.httpClient.put(this.URL+"library/category/articles/delete/"+book_category_id,newSubCategory,{headers:headers})
  }

  removeSubscriptionCategory(id:String)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");

    
    return this.httpClient.put(this.URL+"library/category/subscriptions/remove/"+id,{headers:headers})
  }

  removeCategory(id:String)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");

    
    return this.httpClient.put(this.URL+"library/category/articles/remove/"+id,{headers:headers})
  }
  
  removeCourseTag(id : String)
  {
    let headers = new HttpHeaders();
    headers.append("Content-Type","application/json");

    return this.httpClient.put(this.URL + "course/tags/delete/"+id,{headers : headers})
  }
  }