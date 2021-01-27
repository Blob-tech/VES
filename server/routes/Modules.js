// Developed by : Agnibha Chandra , Jan 5 , 2021

const express = require('express');
const modules = express.Router();
const dateFormat = require('dateformat');
const fs = require('fs');
const multer = require('multer');
const Modules = require('../models/Module');
const mongoose = require('mongoose');


//Get Modules by Id
modules.get('/view/:id',(req,res,next)=>
{
    Modules.findOne({module_id : req.params.id})
    .then(
        data =>
        {
            res.json(data)
        }
    )
    .catch(
        err=>
        {
            res.json({"err": "Error in loading  Module with id " + req.params.id+" from Edurex Database."}) 
        }
    )
})


// Get List of All Modules for a Course;
modules.get('/list/:course_id',(req,res,next)=>
{
            Modules.find({$and : [{active  : {$eq : true}},
            {course_id : req.params.course_id}]})
        .sort({module_name : 1})
            .then(
                data => 
                {
                    res.json(data)
                }
            )
            .catch(err =>
                {
                    res.json({"err": "Error in loading the list of Modules from Edurex Database."})
                })


})

// Create a Module
modules.post('/add',(req,res,next)=>
{
    let newModule = new Modules(
        {
            course_id : req.body.course_id,
            module_name : req.body.module_name,
            module_content : req.body.module_content.split(","),
            module_referrence : req.body.module_referrence.split(","),
        }
    );
 
             Modules.create(newModule)
             .then(data=>
                {
                    res.json({"msg" : "Module : "+ newModule.module_name + " has been successfully registered."});
        
                })
            .catch(
                err =>
                {
                    res.json({"err": " Error in adding a new Module to Edurex Database. Please try after few minutes"});
                }
            )
 
})



//Edit a  Module
modules.put('/edit/:id',(req,res,next)=>
{
    Modules.findOneAndUpdate({module_id : req.params.id},
        {
            $set : {
                module_name : req.body.module_name,
                course_id : req.body.course_id,
                module_content : req.body.module_content.split(','),
                module_referrence : req.body.module_reference.split(','),
            }

        }).then(data => {
            res.json({"msg" : "Module has been Updated Successfully" })
        }).catch(err => {
            res.json({"err" : "Error in updating Module"})
        })
    
})



//Delete a Module
modules.put('/delete/:id', (req,res,next)=>
{
   
          Modules.findOne({module_id : req.params.id}).
          then(data=>{  
            if(data)
            {

                Modules.findOneAndUpdate({module_id : req.params.id},
                    {
                        $set : {
                            active : false
                        }
            
                    }).then(data => {
                        res.json({"msg" : "Module has been Deleted Successfully" })
                    }).catch(err => {
                        res.json({"err" : "Error in deleting Module"})
                    })

            }
          }).catch(err=>{
            res.json({"err" : "Error in deleting Module from Edurex Database. " });
          })        
      
})

//Delete Module by course Id
modules.put('/delete/course/:id', (req,res,next)=>
{
   
          Modules.updateMany({course_id : req.params.id},{set : {active : false}})
          .then(
              data => 
              {
                  res.json({"msg":"All the modules for course with course id :" + req.params.id + "has been deleted"});
              }

          )        
          .catch(
             err=>
             {
                 res.json({"err":"Error in deleting modules from edurex databse"});
             } 
          )
      
})
module.exports = modules;