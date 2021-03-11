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
       avatar : 
       {
           type : String,
       },
       cover : 
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
           default : "light-green-grey"
       },
       logged_in_form_ip :
       {
           type : [String],
           required : true,
           default : []
       },
       failed_passord_attempt :
       {
            type : Number,
            required : true,
            default : 0
       },
       is_locked_out : 
       {
            type : Boolean,
            required : true,
            default : false
       },
       last_logged_in :
       {
            type : Date,
            default : ''
       },
       deleted_on : 
       {
           type :Date,
           default : ''
       },
       isVerified :
       {
           type : Boolean,
           required : true,
           default : false,
       }
       


    }

    
);

//Event




const User = module.exports = mongoose.model("User", userSchema);