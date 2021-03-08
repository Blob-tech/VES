const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const schema = mongoose.Schema;

const usermetaSchema = new schema(
    {
        
       user_id :{
        type : String,
        unique : true,
        required : true
       }, 
       personal_info :
       {
           type : Object,
           default : {}
       },
       institutes : {
           type : Object,
           default : {}
       },
       subscriptions : {
           type : Object,
           default : {}
       },
       social_profiles : {
           type : Object,
           default : {}
       },
       settings : {
           type : Object,
           default :  {}
       }


    }

    
);

//Event




const UserMeta = module.exports = mongoose.model("UserMeta", usermetaSchema);