require('../config/config');
const express = require('express');
const search = express.Router();
const Books = require('../models/Books');
const User = require('../models/User');
const Organisation = require('../models/Organisation');
const mongoose = require('mongoose');


search.get('/advance-search/:keyword/:limit',(req,res,next)=>{
    
    let searchkey = req.params.keyword;
    var user ;
    var institute ;
    var book ;
    Books.find({$and : [
        {active : true},
        {$or : [{book_name : new RegExp(searchkey,'i')},
                {author : new RegExp(searchkey,'i')},
                {category : new RegExp(searchkey,'i')},
                {subcategory : new RegExp(searchkey,'i')},
                {publisher : new RegExp(searchkey,'i')},
                {book_id : new RegExp(searchkey,'i')},
                {language : new RegExp(searchkey,'i') }
            ]}
    ] }).sort({book_name : 1}).limit(Number(req.params.limit)).then(
        data=> {
            book = data;
            Organisation.find({$and : [
                {active : true},
                {isActivated : true},
                {$or : [{organisation_name : new RegExp(searchkey,'i')},
                    {contact_email : new RegExp(searchkey,'i')},
                    {contact_phone : new RegExp(searchkey,'i')},
                    {contact_person : new RegExp(searchkey,'i')},
                    {client_id : new RegExp(searchkey,'i')}
                ]}
            ]}).sort({organisation_name : 1}).limit(Number(req.params.limit)).then(
                data=> {
                    institute = data;
                    User.find({$and : [
                        {active : true},
                        {isActivated : true},
                        {$or : [{name : new RegExp(searchkey,'i')},
                            {email : new RegExp(searchkey,'i')},
                            {phone : new RegExp(searchkey,'i')},
                            {user_id : new RegExp(searchkey,'i')}
                        ]}
                    ]}).sort({name : 1}).limit(Number(req.params.limit)).then(
                        data=> {
                            user = data;
                            res.json({
                                "book" :  book,
                                "institute" : institute,
                                "user" : user
                            })
                        }
                    ).catch(err=>{
                        res.json({"err":"Server Error ! No Search Result Found"});
                    });
                
                    
                }
            ).catch(err=>{
                res.json({"err":"Server Error ! No Search Result Found"});
            });
            
        }
    ).catch(err=>{
        res.json({"err":"Server Error ! No Search Result Found"});
    });

    

    
    
})

module.exports = search;