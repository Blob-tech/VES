// Developed by : Agnibha Chandra , March 30 , 2020

const express = require('express');
const libraryCategories = express.Router();
const cors = require('cors');

const BookCategory = require('../models/BooksCategory');
const SubscriptionCategory = require('../models/SubscriptionCategory');
libraryCategories.use(cors());

// get the list of entire articel category

libraryCategories.get('/articles/list', (req,res,next)=>
{
    BookCategory.find({active  : {$eq : true}}).sort({book_category:1})
    .then(
        data => 
        {
            res.json(data)
        }
    )
    .catch(err =>
        {
            res.json({"err": "Error in loading the list of Article Categories from Edurex Database."})
        })
});

//get entire list of subscription category 
libraryCategories.get('/subscriptions/list', (req,res,next)=>
{
    SubscriptionCategory.find({active  : {$eq : true}}).sort({subscription_category:1})
    .then(
        data => 
        {
            res.json(data)
        }
    )
    .catch(err =>
        {
            res.json({"err": "Error in loading the list of Subscription Categories from Edurex Database."})
        })
});

// Add a new article category 

libraryCategories.post('/articles/add', (req, res, next)=>
{
    let newCategory = new BookCategory(
        {
            book_category : req.body.book_category,
            book_subCategory : [],
            active : true,
        }
    );

   
            BookCategory.create(newCategory)
            .then(data=>
                {
                    res.json({"msg" : "Category : "+ newCategory.book_category + " has been successfully registered."});
        
                })
            .catch(
                err =>
                {
                    res.json({"err": " Error in adding a new article category to Edurex Database. Please try after few minutes"});
                } 
            )
      

})


//add a new Subscription Category 
libraryCategories.post('/subscriptions/add', (req, res, next)=>
{
    let newCategory = new SubscriptionCategory(
        {
            subscription_category : req.body.subscription_category,
            active : true,
        }
    );

   
            SubscriptionCategory.create(newCategory)
            .then(data=>
                {
                    res.json({"msg" : "Category : "+ newCategory.subscription_category + " has been successfully registered."});
        
                })
            .catch(
                err =>
                {
                    res.json({"err": " Error in adding a new subscription category to Edurex Database. Please try after few minutes"});
                } 
            )
      

})

//add a subcategory
libraryCategories.put("/articles/update/:id",(req,res,next)=>{

    let  subcategory = req.body.book_subCategory;

    BookCategory.update(
        {_id : req.params.id},
        {$push :
        {
            book_subCategory :  subcategory 
        }})
        .then(data =>
            {
                res.json({"msg" : "A new sub category added"});
            })
            .catch(err => {
                res.json({"err" : "Error in adding an article sub category to Edurex Database. " });
            })
})

//remove a subcategory
libraryCategories.put("/articles/delete/:id",(req,res,next)=>{

    let  subcategory = req.body.book_subCategory;

    BookCategory.update(
        {_id : req.params.id},
        {$pull :
        {
            book_subCategory :  subcategory 
        }})
        .then(data =>
            {
                res.json({"msg" : "A  sub category has been deleted"});
            })
            .catch(err => {
                res.json({"err" : "Error in deleting an article sub category from Edurex Database. " });
            })
})

//remove a category
libraryCategories.put("/articles/remove/:id",(req,res,next)=>{

    BookCategory.findOneAndUpdate({_id : req.params.id},
        {$set :
        {
            active : false,
        }})
        .then(data =>
            {
                res.json({"msg" : "Category  has been successfully deleted"});
            })
            .catch(err => {
                res.json({"err" : "Error in deleting Category from Edurex Database. " });
            })
})

//remove a  subscription category
libraryCategories.put("/subscriptions/remove/:id",(req,res,next)=>{

    SubscriptionCategory.findOneAndUpdate({_id : req.params.id},
        {$set :
        {
            active : false,
        }})
        .then(data =>
            {
                res.json({"msg" : "Category  has been successfully deleted"});
            })
            .catch(err => {
                res.json({"err" : "Error in deleting Category from Edurex Database. " });
            })
})



module.exports = libraryCategories;