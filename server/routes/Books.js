// Developed by : Agnibha Chandra , March 30 , 2020

require('../config/config');
const express = require('express');
const books = express.Router();
const dateFormat = require('dateformat');
const fs = require('fs');
const multer = require('multer');
const Books = require('../models/Books');
const mongoose = require('mongoose');

//Get total books count
books.get('/count/:category/:subcategory',(req,res,next)=>
{
    if(req.params.category == "all")
    {
        Books.find({active  : {$eq : true}},).countDocuments((err,count)=>{
            if(err)
            {
                res.json({"err": "Error in loading the list of Books from Edurex Database."})
            }
            else
            {
                res.json(count)
            }
        }
        )
           
    }
    else{
        if(req.params.subcategory == "all")
        {
            Books.find({$and : [{active  : {$eq : true}},
            {category : req.params.category}] })
            .count((err,count)=>{
                if(err)
                {
                    res.json({"err": "Error in loading the list of Books from Edurex Database."})
                }
                else
                {
                    res.json(count)
                }
            })
        }
        else
        {
            Books.find({$and : [{active  : {$eq : true}},
            {category : req.params.category},
            {subcategory : req.params.subcategory}]})
            .count((err,count)=>{
                if(err)
                {
                    res.json({"err": "Error in loading the list of Books from Edurex Database."})
                }
                else
                {
                    res.json(count)
                }
            })
        }
    }

})

//Get Book by Id
books.get('/view/:id',(req,res,next)=>
{
    Books.findOne({book_id : req.params.id})
    .then(
        data =>
        {
            res.json(data)
        }
    )
    .catch(
        err=>
        {
            res.json({"err": "Error in loading  Book with id " + req.params.id+" from Edurex Database."}) 
        }
    )
})

//get list of latest release
books.get('/list/latest/:latest_number',(req,res,next)=>
{
    Books.find({active : true}).sort({date_of_published : -1}).limit(Number(req.params.latest_number)).then(
        data=>{
            res.json(data);
        }
    ).catch(err=>{
        res.json({"err": "Error in loading the list of Books from Edurex Database."})
    })
})

// Get List of All Books;
books.get('/list/:category/:subcategory/:books_per_page/:page',(req,res,next)=>
{
    if(req.params.category == "all")
    {
        Books.find({active  : {$eq : true}},)
        .sort({book_name : 1}).skip((Number(req.params.page)-1)*(Number(req.params.books_per_page))).limit(Number(req.params.books_per_page))
            .then(
                data => 
                {
                    res.json(data)
                }
            )
            .catch(err =>
                {
                    res.json({"err": "Error in loading the list of Books from Edurex Database."})
                })
    }
    else{
        if(req.params.subcategory == "all")
        {
            Books.find({$and : [{active  : {$eq : true}},
            {category : req.params.category}] })
            .sort({book_name : 1}).skip((Number(req.params.page)-1)*(Number(req.params.books_per_page))).limit(Number(req.params.books_per_page))
                .then(
                    data => 
                    {
                        res.json(data)
                    }
                )
                .catch(err =>
                    {
                        res.json({"err": "Error in loading the list of Books from Edurex Database."})
                    })
        }
        else
        {
            Books.find({$and : [{active  : {$eq : true}},
            {category : req.params.category},
            {subcategory : req.params.subcategory}]})
            .sort({book_name : 1}).skip((Number(req.params.page)-1)*(Number(req.params.books_per_page))).limit(Number(req.params.books_per_page))
                .then(
                    data => 
                    {
                        res.json(data)
                    }
                )
                .catch(err =>
                    {
                        res.json({"err": "Error in loading the list of Books from Edurex Database."})
                    })
        }
    }
    
})


// Add a new  Book to the database

books.post('/add',async (req, res, next)=>
{
    let Book = null;
    let Cover = null;
    
    if(req.files)
    {
        Book = req.files['book'];
        Cover = req.files['thumbnail_image'];
    }
    let newBook = new Books(
        {
            book_id : req.body.book_id,
            book_name : req.body.name,
            author : req.body.author,
            publisher : req.body.publisher,
            description : req.body.description,
            category : req.body.category,
            subcategory: req.body.subcategory,
            subscription : req.body.subscription.split(","),
            language : req.body.language,
            book_source : null,
            thumbnail_source : null,
            date_of_published : dateFormat(new Date(),"yyyy-mm-dd'T'HH:MM:ss"),
            type : null
        }
    );


    
    
    
   Books.findOne({
       book_id : newBook.book_id
   }).then ( async result => {
       if(!result)
       {
           const session = await mongoose.startSession();
           session.startTransaction();

        try{
            if(Book)
            {
                    let name = Book.name.split(".");
                    let stored_name=req.body.name+"-"+Date.now()+"."+ name[name.length-1];
                    Book.mv("./uploads/library/books/"+stored_name, 
                    async (err)=>{
                        if(err)
                        {
                            await session.abortTransaction();
                            session.endSession();
                            res.json({"err" : "Error in uploading Article. Document size should be less than 100 MB"})
                        }
                        })
                    newBook.book_source = stored_name;
                    newBook.type = name[name.length-1];
            }

            if(Cover)
            {
                    let name = Cover.name.split(".");
                    let stored_name=req.body.name+"-"+Date.now()+"."+ name[name.length-1];
                    Cover.mv("./uploads/library/cover-photos/"+stored_name, 
                   async  (err)=>{
                        if(err)
                        {
                           await session.abortTransaction();
                            session.endSession();
                            res.json({"err" : "Error in uploading Thumbnail Image. Image size is exceeding the limit"})
                        }
                        })
                    newBook.thumbnail_source = stored_name;
            }

            Books.create(newBook)
            .then(async data=>
                {
                    let mongooseclient = require('mongoose')
                    await mongooseclient.connect(process.env.MONGODB_URI, {useNewUrlParser:true});
                    let connection = mongooseclient.connection;
                    let countercol =  connection.db.collection("counters");
                    await countercol.updateOne({},{$inc : {library : 1}});
                    await session.commitTransaction();
                    session.endSession();
                    res.json({"msg" : "Book with Id "+ newBook.book_id + " has been successfully created."});
        
                })
            .catch(
               async err =>
                {
                    await session.abortTransaction();
                    session.endSession();
                    res.json({"err": " Error in adding a new Book to Edurex Database. Please try after few minutes" + err});
                } 
            )
            }
            catch(err)
            {
                    await session.abortTransaction();
                    session.endSession();
                    res.json({"err": " Error in adding a new Book to Edurex Database. Please try after few minutes" + err});
            }
       }
       else{
       
           res.json({"err" : "Book Id already exists. Please try with a different id"});
       }
   })
   .catch(err =>
    {
        
        res.json({"err": err})
    })


})

//Edit a thumbnail
books.put('/edit/thumbnail/:id',(req,res,next)=>{

    var stored_name="";
    if(req.files)
    {
        Cover = req.files['thumbnail_image'];
        
    }

                    Books.findOne({
                        book_id : req.params.id
                    }).then ( result => {
                        if(result)
                        {
                            

                            if(Cover)
                            {
                                var name = Cover.name.split(".");
                                stored_name=result.book_name+"-"+Date.now()+"."+ name[name.length-1];
                                    Cover.mv("./uploads/library/cover-photos/"+stored_name, 
                                    (err)=>{
                                        if(err)
                                        {
                                            res.json({"err" : "Error in uploading Thumbnail Image. Image size is exceeding the limit"})
                                        }
                                        })
                                    
                                        fs.unlinkSync("./uploads/library/cover-photos/"+result.thumbnail_source);
                                    
                                        Books.findOneAndUpdate({book_id : req.params.id},
                                            {$set : {thumbnail_source : stored_name}})
                                            .then(data=>{
                                                res.json({"msg" : "Thumbnail Image has been updated successfully!"});
                                            }).catch(err=>{
                                                res.json({"err" : "Error in setting the thumbnail image path"});
                                            })
                                        }       
                                            

                        }
                        else
                        {
                            res.json({"err" : "No Such Book Exists wit id : " + req.params.id});
                        }

                }).catch(
                    err=>{
                        res.json({"err" : "No Such Book Exists wit id : " + req.params.id});
                    }
                )

               

                
})

//delete many books
books.put("/bulkactions/delete/:n",(req,res,next)=>
{
    let id = [];
    for(var i = 0 ; i < req.params.n ; i++)
    {
        id.push(req.body[i].book_id)
    }
    console.log(id);
   
    Books.updateMany(
        {
           book_id : { $in : id}
        },
        { 
            active : false
        }
    ).then(
        data => {
            res.json({"msg": req.params.n + " Books has been successfully deleted"});
        }
    ).catch(err=>
        {
            res.json({"err": "Error in deleting "+req.params.n+" Books. Please try after few minutes." + err})
        })
});            


//Edit a pdf content
books.put('/edit/content/:id',(req,res,next)=>{

    var stored_name="";
    if(req.files)
    {
        Book = req.files['book'];
        
        
    }

                    Books.findOne({
                        book_id : req.params.id
                    }).then ( result => {
                        if(result)
                        {
                            

                            if(Book)
                            {
                                var name = Book.name.split(".");
                                stored_name=result.book_name+"-"+Date.now()+"."+ name[name.length-1];
                                    Book.mv("./uploads/library/books/"+stored_name, 
                                    (err)=>{
                                        if(err)
                                        {
                                            res.json({"err" : "Error in uploading Book. Document size is exceeding the limite"})
                                        }
                                        })
                                    
                                        fs.unlinkSync("./uploads/library/books/"+result.book_source);
                                    
                                        Books.findOneAndUpdate({book_id : req.params.id},
                                            {$set : {book_source : stored_name, 
                                                date_of_published :new Date(Date.now()),
                                                total_view :0,
                                                total_download :0, 
                                                total_like : 0,
                                                total_dislike : 0,
                                                total_rating : 0,
                                                rating_count : 0,
                                                type :name[name.length-1]
                                                

                                            }})
                                            .then(data=>{
                                                res.json({"msg" : "Content has been updated successfully!"});
                                            }).catch(err=>{
                                                res.json({"err" : "Error in setting the document path"});
                                            })
                                        }       
                                            

                        }
                        else
                        {
                            res.json({"err" : "No Such Book Exists with id : " + req.params.id});
                        }

                }).catch(
                    err=>{
                        res.json({"err" : "No Such Book Exists with id : " + req.params.id});
                    }
                )

               

                
})
    


//Edit a  book
books.put('/edit/:id',(req,res,next)=>
{
    Books.findOneAndUpdate({book_id : req.params.id},
        {
            $set : {
                book_name : req.body.name,
                author : req.body.author,
                publisher : req.body.publisher,
                description : req.body.description,
                category : req.body.category,
                subcategory: req.body.subcategory,
                subscription : req.body.subscription.split(','),
            }

        }).then(data => {
            res.json({"msg" : "Book has been Updated Successfully" })
        }).catch(err => {
            res.json({"err" : "Error in updating Book"})
        })
    
})

//Delete a Book
books.put('/delete/:id', (req,res,next)=>
{
   
          Books.findOne({book_id : req.params.id}).
          then(data=>{  
            if(data)
            {

                fs.unlinkSync('./uploads/library/books/'+data.book_source)
                fs.unlinkSync("./uploads/library/cover-photos/"+data.thumbnail_source);

                Books.findOneAndUpdate({book_id : req.params.id},
                    {
                        $set : {
                            active : false
                        }
            
                    }).then(data => {
                        res.json({"msg" : "Book has been Deleted Successfully" })
                    }).catch(err => {
                        res.json({"err" : "Error in deleting Book"})
                    })

            }
          }).catch(err=>{
            res.json({"err" : "Error in deleting Book from Edurex Database. " });
          })        
      
})

module.exports = books;