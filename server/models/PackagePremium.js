const mongoose = require('mongoose');
const schema = mongoose.Schema;

const packagespremiumSchema = new schema(
    {
       premium_id : 
       {
           type : String,
           required : true
       },
       package_id :
       {
           type : String,
           required : true
       } ,
       premium_price : 
       {
           type : String,
           required : true,
       },
       premium_monthly_price :
       {
           type : String,
       },
       premium_weekly_price :
       {
           type : String,
       },
       premium_daily_price : 
       {
            type : String   
       },
       premium_yearly_price :
       {
           type : String
       },
       type : {

        type : String,
        required : true,
        default : 'package'
       },
       is_daily :
       {
           type : Boolean,
           default : false
       },
       is_weekly :
       {
           type : Boolean,
           default : false
       },
       is_yearly :
       {
           type : Boolean,
           default : false
       },
       is_monthly :
       {
           type : Boolean,
           default : false
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