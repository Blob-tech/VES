const mongoose = require('mongoose');
const schema = mongoose.Schema;

const packagespremiumSchema = new schema(
    {
       package_id :
       {
           type : String,
           required : true
       } ,
       premium_name :
       {
           type : String,
           required : true
       },
       total_premium_price : 
       {
           type : String,
           required : true,
       },
       is_splitwise :
       {
            type : Boolean,
            default:false
       },
       splitwise_category : 
       {
           type:String,
       },
       splitwise_price : 
       {
           type :String
       },
       type : {

        type : String,
        required : true,
        default : 'package'
       },
       is_discounted_price :
       {
           type : Boolean,
           default : false
       },
       discounted_premium_price :
       {
           type : String
       },
       max_time_period:
       {
           type:Number
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