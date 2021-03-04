import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormControl, Validators } from '@angular/forms';
import { LibraryCategoryService } from '../../service/library-category.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  courseTags = [];
  courseTagsA = [];
  courseTagsB = [];
  courseTagsC = [];
  courseTagsD = [];
  courseTagsE = [];
  courseTagsF = [];
  courseTagsG = [];
  courseTagsH = [];
  courseTagsI = [];
  courseTagsJ = [];
  courseTagsK = [];
  courseTagsL = [];
  courseTagsM = [];
  courseTagsN = [];
  courseTagsO = [];
  courseTagsP = [];
  courseTagsQ = [];
  courseTagsR = [];
  courseTagsS = [];
  courseTagsT = [];
  courseTagsU = [];
  courseTagsV = [];
  courseTagsW = [];
  courseTagsX = [];
  courseTagsY = [];
  courseTagsZ = [];

  articleCategories = [];
  subscriptionCategories = [];
  config_params;
  header_color = ["#bbf2c9","#f4b5f5","#b6e4f0","#f08873","#f0e54f","#79912a","#4a6a87","#ab653f"]
  constructor(private formBuilder : FormBuilder,private libCategoryService : LibraryCategoryService,
    private _snackbar : MatSnackBar) { }

  ngOnInit(): void {
    this.getCategories();
    this.getSubscriptionCategories();
    this.getConfigValues();
    this.getCourseTags("All");
  }

  configForm = this.formBuilder.group(
    {
      release : [86400000,Validators.required],
      img_size : [1,Validators.required],
      doc_size : [1,Validators.required],
      avatar_size :[10,Validators.required],
      books_per_page : [5,Validators.required],
      logo_size : [10,Validators.required],
      default_book_view : ['GRID', Validators.required],
      default_user_view : ['LIST', Validators.required], 
    }
  )
  
  articleCategoryForm = this.formBuilder.group({
    category_name : ['',[Validators.required,Validators.maxLength(100)]]
  }
  )
  articleSubCategoryForm = this.formBuilder.group({
    subcategory_name : ['',[Validators.required,Validators.maxLength(100)]]
  }
  )

  subscriptionCategoryForm = this.formBuilder.group({
    subscription_category_name : ['',[Validators.required,Validators.maxLength(100)]]
  }
  )

  courseTagForm = this.formBuilder.group({
    course_tag : ['',[Validators.required,Validators.maxLength(100)]]
  })

  submitCatDisabled()
  {
    if(this.articleCategoryForm.status == "VALID")
    {
      return false;
    }
    return true;
  }

  submitSubCatDisabled()
  {
    if(this.articleSubCategoryForm.status == "VALID")
    {
      return false;
    }
    return true;
  }

  submitSubscriptionDisabled()
  {
    if(this.subscriptionCategoryForm.status == "VALID")
    {
      return false;
    }
    return true;
  }

  submitCourseTagDisabled()
  {
    if(this.courseTagForm.status == "VALID")
    {
      return false;
    }
    return true;
  }

  subscriptionError() 
  {
    if(this.subscriptionCategoryForm.value['subscription_category_name'].hasError('required'))
    {
      return "Value is required";
    }
    
  }

  get category_name()
  {
    return this.articleCategoryForm.get('category_name');
  }

  get default_user_view()
  {
    return this.articleCategoryForm.get('default_user_view');
  }

  get subcategory_name()
  {
    return this.articleSubCategoryForm.get('subcategory_name');
  }

  get release()
  {
    return this.configForm.get('release');
  }

  
  get img_size()
  {
    return this.configForm.get('img_size');
  }

  get logo_size()
  {
    return this.configForm.get('logo_size');
  }

  get avatar_size()
  {
    return this.configForm.get('avatar_size');
  }

  get doc_size()
  {
    return this.configForm.get('doc_size');
  }

  get books_per_page()
  {
    return this.configForm.get('books_per_page');
  }

  get default_book_view()
  {
    return this.configForm.get('default_book_view');
  }


  

  getConfigValues()
  {
    this.libCategoryService.getConfigParameters().subscribe(
      data=>{
        if(!JSON.parse(JSON.stringify(data))['err'])
        {
          this.config_params = data[0];
          this.configForm.patchValue({
            books_per_page : this.config_params.books_per_page,
            release : this.config_params.release,
            img_size : this.config_params.img_size,
            doc_size : this.config_params.doc_size,
            avatar_size : this.config_params.avatar_size,
            logo_size : this.config_params.logo_size,
            default_book_view : this.config_params.default_book_view,
            default_user_view : this.config_params.default_user_view
          })
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

  setConfigValues()
  {
    this.libCategoryService.setConfigParameter(this.configForm.value).subscribe(
      data=>{
        if(!JSON.parse(JSON.stringify(data))['err'])
        {
          this.getConfigValues();
          this._snackbar.open(JSON.parse(JSON.stringify(data))['msg'],null,{duration : 5000})
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


  getSubscriptionCategories()
  {
    this.libCategoryService.getSubscriptionCategories().subscribe(
      data => {
        this.subscriptionCategories = data as Array<any>;
      },
      err => {
        this._snackbar.open("Error in loading Article Category",null,{duration : 5000})
      }
    )
  }

  getCourseTags(nameStartsWith : String)
  {
    this.libCategoryService.getCourseTags(nameStartsWith).subscribe(
      data=>{
      this.courseTags = data as Array<any>;
      this.courseTagsA = this.courseTags.filter(tags =>
         { return tags.course_tag.startsWith('A') || tags.course_tag.startsWith('a') });
         this.courseTagsB = this.courseTags.filter(tags =>
          { return tags.course_tag.startsWith('B') || tags.course_tag.startsWith('b') });
          this.courseTagsC = this.courseTags.filter(tags =>
            { return tags.course_tag.startsWith('C') || tags.course_tag.startsWith('c') });
            this.courseTagsD = this.courseTags.filter(tags =>
              { return tags.course_tag.startsWith('D') || tags.course_tag.startsWith('d') });
              this.courseTagsE = this.courseTags.filter(tags =>
                { return tags.course_tag.startsWith('E') || tags.course_tag.startsWith('E') });
                this.courseTagsF = this.courseTags.filter(tags =>
                  { return tags.course_tag.startsWith('F') || tags.course_tag.startsWith('f') });
                  this.courseTagsG = this.courseTags.filter(tags =>
                    { return tags.course_tag.startsWith('G') || tags.course_tag.startsWith('g') });
                    this.courseTagsH = this.courseTags.filter(tags =>
                      { return tags.course_tag.startsWith('H') || tags.course_tag.startsWith('h') });
                      this.courseTagsI = this.courseTags.filter(tags =>
                        { return tags.course_tag.startsWith('I') || tags.course_tag.startsWith('i') });
                        this.courseTagsJ = this.courseTags.filter(tags =>
                          { return tags.course_tag.startsWith('J') || tags.course_tag.startsWith('j') });
                          this.courseTagsK = this.courseTags.filter(tags =>
                            { return tags.course_tag.startsWith('K') || tags.course_tag.startsWith('k') });
                            this.courseTagsL = this.courseTags.filter(tags =>
                              { return tags.course_tag.startsWith('L') || tags.course_tag.startsWith('l') });
                              this.courseTagsM = this.courseTags.filter(tags =>
                                { return tags.course_tag.startsWith('M') || tags.course_tag.startsWith('m') });
                                this.courseTagsN = this.courseTags.filter(tags =>
                                  { return tags.course_tag.startsWith('N') || tags.course_tag.startsWith('n') });
                                  this.courseTagsO = this.courseTags.filter(tags =>
                                    { return tags.course_tag.startsWith('O') || tags.course_tag.startsWith('o') });
                                    this.courseTagsP = this.courseTags.filter(tags =>
                                      { return tags.course_tag.startsWith('P') || tags.course_tag.startsWith('p') });
                                      this.courseTagsQ = this.courseTags.filter(tags =>
                                        { return tags.course_tag.startsWith('Q') || tags.course_tag.startsWith('q') });
                                        this.courseTagsR = this.courseTags.filter(tags =>
                                          { return tags.course_tag.startsWith('R') || tags.course_tag.startsWith('r') });
                                          this.courseTagsS = this.courseTags.filter(tags =>
                                            { return tags.course_tag.startsWith('S') || tags.course_tag.startsWith('s') });
                                            this.courseTagsT = this.courseTags.filter(tags =>
                                              { return tags.course_tag.startsWith('T') || tags.course_tag.startsWith('t') });
                                              this.courseTagsU = this.courseTags.filter(tags =>
                                                { return tags.course_tag.startsWith('U') || tags.course_tag.startsWith('u') });
                                                this.courseTagsV = this.courseTags.filter(tags =>
                                                  { return tags.course_tag.startsWith('V') || tags.course_tag.startsWith('v') });
                                                  this.courseTagsW = this.courseTags.filter(tags =>
                                                    { return tags.course_tag.startsWith('W') || tags.course_tag.startsWith('w') });
                                                    this.courseTagsX = this.courseTags.filter(tags =>
                                                      { return tags.course_tag.startsWith('X') || tags.course_tag.startsWith('x') });
                                                      this.courseTagsY = this.courseTags.filter(tags =>
                                                        { return tags.course_tag.startsWith('Y') || tags.course_tag.startsWith('y') });
                                                        this.courseTagsZ = this.courseTags.filter(tags =>
                                                          { return tags.course_tag.startsWith('Z') || tags.course_tag.startsWith('z') });

      },
      err=>
      {
        this._snackbar.open("Error in loading Course Tag",null,{duration : 500})
      }
    )
  }

  getCategories()
  {
      this.libCategoryService.getArticleCategories().subscribe(
        data => {
          this.articleCategories = data as Array<any>;
        },
        err => {
          this._snackbar.open("Error in loading Article Category",null,{duration : 5000})
        }
      )
  }
 
  addSubscriptionCategory()
  {
    this.libCategoryService.addSubscriptionCategory(this.subscriptionCategoryForm.value['subscription_category_name']).subscribe(
      data=>{
        if((JSON.parse(JSON.stringify(data))['msg']))
        {
          this.getSubscriptionCategories();
          this._snackbar.open(JSON.parse(JSON.stringify(data))['msg'],null,{duration:5000});
        }
        else
        {
          this._snackbar.open(JSON.parse(JSON.stringify(data))['err'],null,{duration:5000});
        }
      },
      err => {
        this._snackbar.open(JSON.stringify(err),null,{duration : 5000});
      }
    )
  }
  
  addCourseTag()
  {
    this.libCategoryService.addCourseTag(this.courseTagForm.value['course_tag']).subscribe(
      data=>{
        if((JSON.parse(JSON.stringify(data))['msg']))
        {
          this.getCourseTags("All");
          this._snackbar.open(JSON.parse(JSON.stringify(data))['msg'],null,{duration:5000});
        }
        else
        {
          this._snackbar.open(JSON.parse(JSON.stringify(data))['err'],null,{duration:5000});
        }
      },
      err => {
        this._snackbar.open(JSON.stringify(err),null,{duration : 5000});
      }
    )
  }

  addCategory()
  {
    this.libCategoryService.addCategory(this.articleCategoryForm.value['category_name']).subscribe(
      data=>{
        if((JSON.parse(JSON.stringify(data))['msg']))
        {
          this.getCategories();
          this._snackbar.open(JSON.parse(JSON.stringify(data))['msg'],null,{duration:5000});
        }
        else
        {
          this._snackbar.open(JSON.parse(JSON.stringify(data))['err'],null,{duration:5000});
        }
      },
      err => {
        this._snackbar.open(JSON.stringify(err),null,{duration : 5000});
      }
    )
  }


  
  addSubCategory(id : String)
  {
      this.libCategoryService.addSubCategory(this.articleSubCategoryForm.value['subcategory_name'],id).subscribe
      (
        data=>{

          if((JSON.parse(JSON.stringify(data))['msg']))
        {
          this.getCategories();
          this._snackbar.open(JSON.parse(JSON.stringify(data))['msg'],null,{duration:5000});
        }
        else
        {
          this._snackbar.open(JSON.parse(JSON.stringify(data))['err'],null,{duration:5000});
        }

        },
        err =>{
          this._snackbar.open(JSON.stringify(err),null,{duration : 5000});
        }
      )
  }
 
  removeCourseTag(id : String)
  {
    var res = confirm("Are you sure you want to delete this tag ?");
    if(res == true)
    {
      this.libCategoryService.removeCourseTag(id).subscribe
      (
        data=>{

          if((JSON.parse(JSON.stringify(data))['msg']))
        {
          this.getCourseTags('All');
          this._snackbar.open(JSON.parse(JSON.stringify(data))['msg'],null,{duration:5000});
        }
        else
        {
          this._snackbar.open(JSON.parse(JSON.stringify(data))['err'],null,{duration:5000});
        }

        },
        err =>{
          this._snackbar.open(JSON.stringify(err),null,{duration : 5000});
        }
      )
    }
  }

  removeSubCategory(subcat:String, id : String)
  {
    var res = confirm("Are you sure you want to delete this subcategory ?Alert ! Books having this subcategory cannot be filtered using this subcategory any more");
    if(res == true)
    {
      this.libCategoryService.removeSubCategory(subcat,id).subscribe
      (
        data=>{

          if((JSON.parse(JSON.stringify(data))['msg']))
        {
          this.getCategories();
          this._snackbar.open(JSON.parse(JSON.stringify(data))['msg'],null,{duration:5000});
        }
        else
        {
          this._snackbar.open(JSON.parse(JSON.stringify(data))['err'],null,{duration:5000});
        }

        },
        err =>{
          this._snackbar.open(JSON.stringify(err),null,{duration : 5000});
        }
      )
    }
  }

  removeCategory(id : String)
  {
    var res = confirm("Are you sure, you want to remove this category ?Alert ! Content having this category cannot be filtered anymore.");
    if(res == true)
    {
    this.libCategoryService.removeCategory(id)
    .subscribe(
      data=>{

        if((JSON.parse(JSON.stringify(data))['msg']))
        {
          this.getCategories();
          this._snackbar.open(JSON.parse(JSON.stringify(data))['msg'],null,{duration:5000});
        }
        else
        {
          this._snackbar.open(JSON.parse(JSON.stringify(data))['err'],null,{duration:5000});
        }


      },
      err => {

        this._snackbar.open(JSON.stringify(err),null,{duration:5000});
      }
    )
  }
  }


  removeSubscriptionCategory(id : String)
  {
   
      var res = confirm("Are you sure, you want to remove this category ?")
      if(res == true)
      {
      this.libCategoryService.removeSubscriptionCategory(id)
      .subscribe(
        data=>{
  
          if((JSON.parse(JSON.stringify(data))['msg']))
          {
            this.getSubscriptionCategories();
            this._snackbar.open(JSON.parse(JSON.stringify(data))['msg'],null,{duration:5000});
          }
          else
          {
            this._snackbar.open(JSON.parse(JSON.stringify(data))['err'],null,{duration:5000});
          }
  
  
        },
        err => {
  
          this._snackbar.open(JSON.stringify(err),null,{duration:5000});
        }
      )
    }
    
  }

}
