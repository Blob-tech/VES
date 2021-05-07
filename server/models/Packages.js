const mongoose = require('mongoose');
const schema = mongoose.Schema;

const packageSchema = new schema(
    {
       package_id :
       {
           type : String,
           unique : true,
           required : true
       } ,
       package_name : 
       {
           type : String,
           required : true,
       },
       total_media_disk_space :
       {
           type : Number,
           required : true,
       },
       total_users : 
       {
            type : Number,
            required : true
       },
       subscription_categories :
       {
            type : Number,
            required : true,
       },
       package_premium:
       {
           type:[String],
           required : true,
           default:[]
       },
       package_avatar : 
       {
           type : String,
           
       },
       active : 
       {
           type : Boolean,
           required : true,
           default: true,
       }

    }

    
);


const Package = module.exports = mongoose.model("Package", packageSchema);