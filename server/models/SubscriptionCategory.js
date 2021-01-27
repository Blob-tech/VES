const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const SubscriptionCategorySchema = new Schema(
    {
        subscription_category : {
            type : String,
            required : true
        },
        active : {
            type : Boolean,
            required : true,
            default : true
        }
    }
)

const SubscriptionCategory = module.exports = mongoose.model("SubscriptionCategory", SubscriptionCategorySchema);