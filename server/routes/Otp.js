const express = require('express');
const otp = express.Router();
const cors = require('cors');

const OTP = require('../models/Otp');
const User = require('../models/User');
otp.use(cors());

otp.post('/validate',(req,res,next)=>{
    OTP.findOne({$and : [
        {user_id : req.body.user_id},
        {otp_type : req.body.otp_type},
        {otp : req.body.otp},
    ]}).then(data=>{
        if(data != null)
        {
            if(Number(data.otp_valid_upto) >= Number(req.body.otp_valid_upto) )
            {
                 res.json({"msg":"OTP Verified"})
            }
            else
            {
                res.json({"err":"OTP has been Expired. Please resend OTP"})
            }
        }
        else
        {
            res.json({"err":"OTP doesn't match"})
        }
        
    }).catch(err=>{
        res.json({"err":"OTP doesn't match"})
    })
})

otp.post('/insert',(req,res,next)=>{
    User.find({email : req.body.user_id}).then(
        data=>{
            if(data.length != 0){
            OTP.updateOne({$and :
                [
                    {user_id : req.body.user_id},
                    {otp_type : req.body.otp_type}
               ]},
               {$set : {
                   user_id : req.body.user_id,
                   otp : req.body.otp,
                   otp_type : req.body.otp_type,
                   otp_generated_on : req.body.otp_generated_on,
                   otp_valid_upto : req.body.otp_valid_upto
               }},
               {upsert : true})
               .then(data=>{
                   res.json({"msg" : "Otp Send"} );
               }).catch(err => {
                   res.json({"err" : "Error sending otp. Please try after few minutes: "})
               })
            }
            else{
                res.json({"err" : "Email has not been registered ! "})

            }

        }
    ).catch(err=>{
        res.json({"err" : "Error sending otp. Please try after few minutes !" })

    })
    
})


module.exports = otp;