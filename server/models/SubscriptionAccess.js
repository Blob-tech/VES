const mongoose = require('mongoose');
const schema = mongoose.Schema;

const subscriptionAccessSchema = new schema(
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
       subscription :
       {
           type : String,
           required : true,
           default : ''
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
       },
       is_activated :
       {
           type : Boolean,
           required : true,
           default : false,
       },
       approval : 
       {
           type : String,
           required : false,
       }

    }

    
);

const RoleAccess = module.exports = mongoose.model("SubscriptionAccess", subscriptionAccessSchema);