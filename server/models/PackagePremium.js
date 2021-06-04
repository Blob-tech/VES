const mongoose = require('mongoose');
const schema = mongoose.Schema;

const packagespremiumSchema = new schema(
    {
       premium_id :
       {
           type : String,
           required:true,
           unique:true
       },
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
       premium_description :
       {
           type : String,
       },
       total_premium_price : 
       {
           type : String,
       },
       premium_price :
       {
           type : String,
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
       discount_valid_upto :
       {
           type : Date,
           default : ''
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


const Premium = module.exports = mongoose.model("Premium", packagespremiumSchema);