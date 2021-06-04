const mongoose = require('mongoose');
const schema = mongoose.Schema;

const premiumAccessSchema = new schema(
    {
        institute_id:
        {
            type : String,
            required : true
        },
        premium_id:
        {
            type : String,
            required : true
        },
        access_given_on :
        {
            type : Date,
            required : true
        },
        valid_upto:
        {
            type : Date,
            default : ''
        },
        active:
        {
            type : Boolean,
            default:true
        }
    });

const PremiumAccess = module.exports = mongoose.model("PremiumAccess", premiumAccessSchema);