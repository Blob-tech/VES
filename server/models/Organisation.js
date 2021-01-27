const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const schema = mongoose.Schema;

const organisationSchema = new schema(
    {
        
       organisation_id :{
        type : String,
        unique : true,
        required : true
       }, 
       client_id : {
        type : String,
        unique : true,
        required : true
       },
       contact_email :
       {
           type : String,
           unique : true,
           required : true
       } ,
       contact_phone : 
       {
           type : String,
           required : true,
           unique : true,
       },
       organisation_name :
       {
            type : String,
            required : true,
       },
       contact_person :
       {
            type : String,
            require : true,
       },
       address : 
       {
           type : String
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
           default : true,
       },
      


    }

    
);

//Event




const Organisation = module.exports = mongoose.model("Organisation", organisationSchema);