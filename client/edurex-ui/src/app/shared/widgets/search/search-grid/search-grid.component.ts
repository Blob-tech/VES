import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/modules/library/modules/subscriber-management/models/subscriber';
import { Institute } from 'src/app/modules/library/modules/institute-management/models/institute';
import { Book } from 'src/app/modules/library/modules/book-explorer/models/book';
import { SearchService } from 'src/app/shared/services/search.service';
import { config } from 'src/conf';
import { SubscriberService } from 'src/app/modules/library/service/subscriber.service';
import { RoleAccessService } from 'src/app/shared/services/role-access.service';

@Component({
  selector: 'app-search-grid',
  templateUrl: './search-grid.component.html',
  styleUrls: ['./search-grid.component.css']
})
export class SearchGridComponent implements OnInit {

  keyword : string = '';
  userList : User[];
  instituteList : Institute[];
  bookList : Book[];
  noBook=null;
  noUser = null;
  noInstitute = null;
  showLoader = true;
  bookLoadMore = true;
  userLoadMore = true;
  insLoadMore = true;
  limit = 10;
  limitInc = 10;
  limitBook = 10;
  limitUser = 10;
  limitIns = 10;
  toggle='people';
  logoUrl = config.host + 'organisation_logo/' ;
  profileImgUrl =  config.host + 'avatar/';
  bookThumbnailUrl =  config.host + 'thumbnail/';

  @Input()
  visible = true;

  constructor(private dialog : MatDialog,private searcService : SearchService,
    private roleAccessService : RoleAccessService) { }

  ngOnInit(): void {
  }

  search(window)
  {
    this.limit = 10;
    this.limitIns=10;
    this.limitUser=10;
    this.limitBook=10;
    this.limitInc = 10;
    this.showLoader = true;
    this.bookLoadMore = true;
    this.userLoadMore = true;
    this.insLoadMore = true;
    this.searcService.getSearhResult(this.keyword,this.limit).subscribe(
      data=>{
        if(!(JSON.parse(JSON.stringify(data))['err']))
        {
          this.userList=data['user'] as User[];
          this.bookList = data['book'] as Book[];
          this.instituteList = data['institute'] as Institute[];
          if(this.bookList.length == 0)
          {
            this.noBook = "No Book Found !";
          }
          else
          {
            if(this.bookList.length < this.limit)
            {
              this.bookLoadMore = false;
            }
            this.noBook = null;
          }
          if(this.userList.length == 0)
          {
            this.noUser = "No Active User Found !";
          }
          else
          {
            if(this.userList.length < this.limit)
            {
              this.userLoadMore = false;
            }
            this.noUser = null;
          }
          if(this.instituteList.length == 0)
          {
            this.noInstitute = "No Active Institute Found !";
          }
          else
          {
            if(this.instituteList.length < this.limit)
            {
              this.insLoadMore = false;
            }
            this.noInstitute = null;
          }
          this.showLoader = false;
        }
      }
    )
    const dialogRef = this.dialog.open(window)
  }

  loadMore(mode : string)
  {
    this.showLoader = true;
    if(mode == 'book')
    {
      this.limitBook = this.limitBook + this.limitInc;
      this.limit = this.limitBook ;
    }
    else if(mode == 'user')
    {
      this.limitUser = this.limitUser + this.limitInc;
      this.limit = this.limitUser;
    }
    else if(mode == 'institute')
    {
      this.limitIns = this.limitIns + this.limitInc;
      this.limit = this.limitIns;
    }
    this.searcService.getSearhResult(this.keyword,this.limit).subscribe(
      data=>{
        if(!(JSON.parse(JSON.stringify(data))['err']))
        {
          if(mode == 'user')
          {
            let preLen = this.userList.length;
            this.userList=data['user'] as User[];
            if(preLen >= this.userList.length)
            {
              this.userLoadMore = false;
            }
          }
          if(mode == 'book')
          {
            let preLen = this.bookList.length;
            this.bookList = data['book'] as Book[];
            if(preLen >= this.bookList.length)
            {
              this.bookLoadMore = false;
            }
          }
          if(mode == 'institute')
          {
            let preLen = this.instituteList.length;
            this.instituteList = data['institute'] as Institute[];
            if(preLen >= this.instituteList.length)
            {
              this.insLoadMore = false;
            }
          }
          
          if(this.bookList.length == 0)
          {
            this.noBook = "No Book Found !";
          }
          else
          {
            this.noBook = null;
          }
          if(this.userList.length == 0)
          {
            this.noUser = "No Active User Found !";
          }
          else
          {
            this.noUser = null;
          }
          if(this.instituteList.length == 0)
          {
            this.noInstitute = "No Active Institute Found !";
          }
          else
          {
            this.noInstitute = null;
          }

        }
        else
        {
          this.noBook = JSON.parse(JSON.stringify(data))['err']
          this.noUser = JSON.parse(JSON.stringify(data))['err']
          this.noInstitute = JSON.parse(JSON.stringify(data))['err']
          this.showLoader=false;
        }
      
        this.showLoader=false;
  },
  err=>{

    this.noBook = "No Book Found !";
          this.noUser = "No Active User Found !";
          this.noInstitute = "No Active Institute Found !";
          this.showLoader=false;

  }
 
  )

  }

  getInstitutes(user_id : string)
    {
      let instituteList = [];
      this.roleAccessService.getRoleAccess(user_id).subscribe(
        data=>{
          if(!(JSON.parse(JSON.stringify(data))['err']))
          {
            instituteList = data['ins'];
            return instituteList;
          }
          else
          {
            return instituteList;
          }
          
        },
        err=>{
          return instituteList;
        }
       
         
        
      )
    }

    close()
    {
      this.keyword = '';
    }

}
