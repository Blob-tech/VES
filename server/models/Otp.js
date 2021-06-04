const mongoose = require('mongoose');
const schema = mongoose.Schema;

const otpSchema = new schema(
    {
        
       user_id : {
           type : String,
           required : true
       } ,
       otp : {
        type : String,
        required : true
       },
       otp_generated_on :
       {
           type : String,
           required : true
       } ,
       otp_valid_upto : 
       {
           type : String,
           required : true,
       },
       otp_type :
       {
           type : String,
           required : true
       }
    }

    
);

//Event




const OTP = module.exports = mongoose.model("OTP", otpSchema);