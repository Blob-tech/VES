const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const CourseTagSchema = new Schema(
    {
        course_tag : {
            type : String,
            required : true
        },
        active : {
            type : Boolean,
            required : true,
            default : true
        }
    }
)

const CourseTag = module.exports = mongoose.model("CourseTag", CourseTagSchema);