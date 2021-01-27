const express = require('express');
const courses = express.Router();
const cors = require('cors');

const CourseTag = require('../models/CourseTag');
const Course = require('../models/Course');
courses.use(cors());

//Delete a coures tag
courses.put('/tags/delete/:id',(req,res,next)=>
{
    CourseTag.findOneAndUpdate({_id : req.params.id},
        {$set :
        {
            active :false,
        }})
        .then(data =>
            {
                res.json({"msg" : "Tag  has been successfully deleted"});
            })
            .catch(err => {
                res.json({"err" : "Error in deleting Course Tag  from Edurex Database. " });
            })
})

//get entire list of course tag Name wise
courses.get('/tags/list/:A', (req,res,next)=>
{
    if(req.params.A == 'All')
    {
        CourseTag.find({active : {$eq : true}}).sort({course_tag:1})
    .then(
        data => 
        {
            res.json(data)
        }
    )
    .catch(err =>
        {
            res.json({"err": "Error in loading the list of Course Tag from Edurex Database."})
        })
    }
    else
    {
    CourseTag.find({$and : [{active  : {$eq : true}},{course_tag : {$regex : '^M'}}]}).sort({course_tag:1})
    .then(
        data => 
        {
            res.json(data)
        }
    )
    .catch(err =>
        {
            res.json({"err": "Error in loading the list of Course Tag from Edurex Database."})
        })
    }
});

// Create a new course tag
courses.post('/tags/add', (req, res, next)=>
{
    let newCourseTag = new CourseTag(
        {
            course_tag : req.body.course_tag,
            active : true,
        }
    );

   
            CourseTag.create(newCourseTag)
            .then(data=>
                {
                    res.json({"msg" : "Tag : "+ newCourseTag.course_tag + " has been successfully registered."});
        
                })
            .catch(
                err =>
                {
                    res.json({"err": " Error in adding a new course tag to Edurex Database. Please try after few minutes"});
                } 
            )
      

})

// Get a coures by ID
courses.get('/view/:id',(req,res,next)=>
{
    Course.findOne({course_id : req.params.id})
    .then(
        data =>
        {
            res.json(data)
        }
    )
    .catch(
        err=>
        {
            res.json({"err": "Error in loading  Course with id " + req.params.id+" from Edurex Database."}) 
        }
    )

})

//Get a  list of course by tags
courses.get('/list',(req,res,next)=>{
    Course.find({$and : [{active : {$eq : true}},{course_tag : {$in : req.body.tags}}]}).sort({course_name : 1})
    .then(
        data =>
        {
            res.json(data);
        }
    )
    .catch(
        err=>
        {
            res.json({"err":"Error in loading the course list from Edurex Databse"});
        }
    )
})

//Delete a course
courses.put('/delete/:id',(req,res,next)=>
{
    Course.findOneAndUpdate({course_id : req.params.id},
        {$set :
        {
            active :false,
        }})
        .then(data =>
            {
                res.json({"msg" : "Course  has been successfully deleted"});
            })
            .catch(err => {
                res.json({"err" : "Error in deleting Course  from Edurex Database. " });
            })
})

module.exports = courses;