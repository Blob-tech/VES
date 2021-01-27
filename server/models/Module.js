const mongoose = require('mongoose');
const schema = mongoose.Schema;

const courseSchema = new schema(
    {
       course_id :
       {
        type : String,
        required : true
       },
       module_name : 
       {
           type : String,
           required : true,
       },
       module_content :
       {
           type:[String],
           required : true,
       },
       module_referrence :
       {
           type : [String],
       },
       active : 
       {
           type : Boolean,
           required : true,
           default: true,
       }

    }

    
);


const Course = module.exports = mongoose.model("Course", courseSchema);