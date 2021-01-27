const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const schema = mongoose.Schema;

const userSchema = new schema(
    {
        
       user_id :{
        type : String,
        unique : true,
        required : true
       }, 
       email :
       {
           type : String,
           unique : true,
           required : true
       } ,
       phone : 
       {
           type : String,
           required : true,
           unique : true,
       },
       name :
       {
            type : String,
            required : true,
       },
       address : 
       {
           type : String
       },
       password :
       {
           type : String,
           required : true
       },
       institute_id :
       {
           type : String,
       },
        subscription_category :
       {
            type : [String],
            required : true,
       },
       avatar : 
       {
           type : String,
       },
       date_of_registration :
       {
           type : Date,
       },
       active : 
       {
           type : Boolean,
           required : true,
           default: true,
       },
       isActivated : 
       {
           type : Boolean,
           required : true,
           default : true
       },
       dark_mode : 
       {
           type : Boolean,
           required : true,
           default : false,
       },
       theme : 
       {
           type : String,
           required : true,
           default : "lime-blue"
       },
       role : 
       {
           type : String,
           required : true
       },
       


    }

    
);

//Event




const User = module.exports = mongoose.model("User", userSchema);