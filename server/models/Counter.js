const mongoose = require('mongoose');
const schema = mongoose.Schema;

const boardSchema = new schema(
    {
        counter :{

            type : String,
            required : true
        },
        value : {
            type : Number,
            required : true
        }
       
    }

    
);

const Counter = module.exports = mongoose.model("Counter", boardSchema);