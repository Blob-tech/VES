const mongoose = require('mongoose');
const schema = mongoose.Schema;

const bookCategorySchema = new schema(
    {
       book_category :
       {
           type : String,
           required : true
       } ,
       book_subCategory : 
       {
           type : [String],
           required : true,
       },
       active : 
       {
           type : Boolean,
           required : true,
           default: true,
       }

    }

    
);

const BookCategory = module.exports = mongoose.model("BookCategory", bookCategorySchema);