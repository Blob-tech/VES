export class Book
{
    _id?: string;
    book_id : string;
    book_name : string;
    author : string;
    institute_id : string;
    institute_client_id : string;
    institute_name : string;
    institute_avatar : string;
    description : string;
    category : string;
    subcategory: string;
    book_source : string;
    thumbnail_source : string;
    publisher : string;
    subscription : Array<string>;
    language : string;
    date_of_published : Date;
    total_view : number;
    total_like : number;
    total_dislike : number;
    total_download : number;
    total_rating : number;
    rating_count : number;
    type : string;
    active : boolean;
  
}