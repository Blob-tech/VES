const mongoose = require('mongoose');
const schema = mongoose.Schema;

const roleAccessSchema = new schema(
    {
       user_id :
       {
           type : String,
           required : true
       } ,
       institute_id : 
       {
           type : String,
           required : true,
       },
       role :
       {
           type : String,
           required : true
       },
       access_given :
       {
           type : Date,
           required : true,
       },
       valid_upto :
       {
           type : Date,
           required : true,
           default : ''
       },
       active : 
       {
           type : Boolean,
           required : true,
           default: true,
       }

    }

    
);

const RoleAccess = module.exports = mongoose.model("RoleAccess", roleAccessSchema);