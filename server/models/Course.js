const mongoose = require('mongoose');
const schema = mongoose.Schema;

const courseSchema = new schema(
    {
       course_id :
       {
           type : String,
           unique : true,
           required : true
       } ,
       course_name : 
       {
           type : String,
           required : true,
       },
       course_institute :
       {
           type : String,
           required : true,
       },
       description :
       {
            type : String,
            required : true,
       },
       course_tag : 
       {
           type : [String],
           required : true,
       },
       subscription :
       {
           type : [String],
           required : true
       },
       language : 
       {
           type : String,
       },
       date_of_published :
       {
           type : Date,
       },
       total_view :
       {
           type : Number,
           required : true,
           default : 0
       },
       total_like : 
       {
            type : Number,
            required : true,
            default : 0 
       },
       total_dislike : 
       {
            type : Number,
            required : true,
            default : 0 
       },
       total_completed : 
       {
           type : Number,
           required : true,
           default : 0
       },
       total_in_progress : 
       {
           type : Number,
           required : true,
           default : 0
       },
       total_rating : 
       {
            type : Number,
            required : true,
            default : 0 
       },
       rating_count : 
       {
            type : Number,
            required : true,
            default : 0 
       },
    
       active : 
       {
           type : Boolean,
           required : true,
           default: true,
       }

    }

    
);


const Course = module.exports = mongoose.model("Courses", courseSchema);