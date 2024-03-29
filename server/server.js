require('./config/config');
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');
var app = express();
var mongoose = require('mongoose')
var port = process.env.PORT || 3000
var path = require('path');
var filesystem = require('fs');
var nodemailer = require('nodemailer');



app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload({
    limits: { fileSize: 10*1024 * 1024 * 1024 },} // 10 GB File size
));
app.use(bodyParser.urlencoded({extended:false}));



mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser:true})
.then(() => {console.log("MongoDB Edurex Database Connected ...");})
.catch(err => console.log(err));


var connection = mongoose.connection;

// connection.db.collection('counters',(err,collection)=>{
//     if( collection.count() == 0) {
//         collection.insertOne({"user" : 0, "library" : 0 , "organisation" : 0 , "course" : 0});
//     }
    
// });


var Counters = require('./routes/Counters')
var LibraryCategory = require('./routes/LibraryCategories')
var Book = require('./routes/Books');
var User = require('./routes/Users');
var Course = require('./routes/Course');
var Module = require('./routes/Modules');
var Organisation = require('./routes/Organisations');
var RoleAccess = require('./routes/RoleAccess');
var Search = require('./routes/Search');
var Package = require('./routes/Packages');
var SubscriptionAccess = require('./routes/SubscriptionAccess');
var OTP = require('./routes/Otp');


let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'agnibhachandra97@gmail.com',
      pass: '****',
    }
  });

app.use('/thumbnail',express.static(path.join(__dirname, 'uploads/library/cover-photos/')));
app.use('/article',express.static(path.join(__dirname, 'uploads/library/books/')));
app.use('/system',express.static(path.join(__dirname,'uploads/system/')));
app.use('/organisation_logo',express.static(path.join(__dirname,'uploads/organisation/logo/')));
app.use('/avatar',express.static(path.join(__dirname,'uploads/user/avatar')));
app.use('/cover',express.static(path.join(__dirname,'uploads/user/cover')));
app.use('/package',express.static(path.join(__dirname,'uploads/packages/icon/')));
app.use('/counters',Counters)
app.use('/library/category',LibraryCategory);
app.use('/library/books',Book);
app.use('/user',User);
app.use('/course',Course);
app.use('/course/module',Module);
app.use('/organisation',Organisation);
app.use('/role',RoleAccess);
app.use('/search',Search);
app.use('/package',Package);
app.use('/subscription',SubscriptionAccess);
app.use('/otp',OTP);


app.get('/server_time',(req,res,next)=>{
    var date = new Date();
    res.json(date.toISOString());
})
app.get('/otp/:email',(req,res,next)=>{

    var mailOptions = {
        from: 'agnibhachandra97@gmail.com',
        to: 'agnistephenite10@gmail.com',
        subject: 'Password Reset OTP from VES',
        text: '1255'
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
         res.json({"err" : "Erorr in Sendin OTP"})
        } else {
          res.json({"msg" : "OTP has been sent successfully to your registered email"})
        }
      });

})


app.get('/library/books/languages/list',(req,res,next)=>{

    connection.db.collection("iso_lang", function(err, collection){
        if(err)
        {
            res.json({"err":"Error in Loading Languages"})
        }
        collection.find({}).toArray(function(err, data){
            if(err)
            {
                res.json({"err":"Error in Loading Languages"})
            }
            res.json(data)
        })
    });

})

app.get('/library/books/languages/get/:id',(req,res,next)=>{
    connection.db.collection("iso_lang", function(err, collection){
        if(err)
        {
            res.json({"err":"Error in Loading Language"})
        }
        collection.findOne({name : req.params.id}).then(
            data=>{
                res.json(data)
            }
        ).catch(err=>{
            res.json({"err":"Error in Loading Language"})
        })
            
    });

})

app.put('/system/update/icon',(req,res,next)=>{
    if(req.files)
            {
                   Icon = req.files['icon'];
                   filesystem.unlinkSync("./uploads/system/icon.png");
                    Icon.mv("./uploads/system/icon.png", 
                     (err)=>{
                        if(err)
                        {
                            
                            res.json({"err" : "Error in uploading icon. Image size should be less than 5 MB"})
                        }
                        res.json({"msg":"Brand Icon has been updated successfully"});
                        })
            }
})


app.get('/library/config/list/:institute_id',(req,res,next)=>{

    connection.db.collection("library_config", function(err, collection){
        if(err)
        {
            res.json({"err":"Error in Loading library Config Parameters"})
        }
        collection.find({institute_id : req.params.institute_id}).toArray(function(err, data){
            if(err)
            {
                res.json({"err":"Error in Loading library Config Parameters"})
            }
            res.json(data)
        })
    });

})


app.get('/counter/list',(req,res,next)=>{
    connection.db.collection('counters',(err,collection)=>{
        if(err)
        {
            res.json({"err" : "Error in loading counter Parameters"})
        }
        collection.find({}).toArray(function(err, data){
            if(err)
            {
                res.json({"err":"Error in Loading counter Parameters"})
            }
            res.json(data)
        })
    })
})

app.put('/counter/:value/:parameter',(req,res,next)=>{

    connection.db.collection('counters',(err,collection)=>{

    if(err)
    {
        res.json({"err" : "Error in updating counter Parameters"})
    }
    
    if(req.params.parameter == 'library')
    {
        collection.updateOne({},{$set : {library : Number(req.params.value)}}).then(data=>{
        res.json({"msg":"Book Counter updated successfully"});
        
    }).catch(err=>{
        res.json({"err" : "Error in updating counter Parameters"});
    })
    }
    else if(req.params.parameter == 'library_prefix')
    {
        collection.updateOne({},{$set : {library_prefix : req.params.value}}).then(data=>{
        res.json({"msg":"Book Counter Prefix updated successfully"});
        
    }).catch(err=>{
        res.json({"err" : "Error in updating Book counter prefix"});
    })
    }
    else if(req.params.parameter == 'user')
    {
        collection.updateOne({},{$set : {user : Number(req.params.value)}}).then(data=>{
        res.json({"msg":"User Counter updated successfully"});
        
    }).catch(err=>{
        res.json({"err" : "Error in updating counter Parameters"});
    })
    }
    else if(req.params.parameter == 'user_prefix')
    {
        collection.updateOne({},{$set : {user_prefix : req.params.value}}).then(data=>{
        res.json({"msg":"User Counter Prefix updated successfully"});
        
    }).catch(err=>{
        res.json({"err" : "Error in updating user counter prefix"});
    })
    }
    else if(req.params.parameter == 'organisation')
    {
        collection.updateOne({},{$set : {organisation : Number(req.params.value)}}).then(data=>{
        res.json({"msg":"Organisation Counter updated successfully"});
        
    }).catch(err=>{
        res.json({"err" : "Error in updating counter Parameters"});
    })
    } 
    else if(req.params.parameter == 'organisation_prefix')
    {
        collection.updateOne({},{$set : {organisation_prefix : req.params.value}}).then(data=>{
        res.json({"msg":"Institute Counter Prefix updated successfully"});
        
    }).catch(err=>{
        res.json({"err" : "Error in updating institute counter prefix"});
    })
    }
    else if(req.params.parameter == 'package')
    {
        collection.updateOne({},{$set : {package : Number(req.params.value)}}).then(data=>{
            res.json({"msg":"Package Counter updated successfully"});   
    }).catch(err=>{
        res.json({"err" : "Error in updating package counter"});
    })
    }
    else if(req.params.parameter=='package_prefix')
    {
        collection.updateOne({},{$set : {package_prefix : req.params.value}}).then(data=>{
            res.json({"msg":"Package Prefix updated successfully"});
            
        }).catch(err=>{
            res.json({"err" : "Error in updating package counter prefix"});
        })

    }

    else if(req.params.parameter == 'course')
    {
        collection.updateOne({},{$set : {course : Number(req.params.value)}}).then(data=>{
        res.json({"msg":"Course Counter updated successfully"});
        
    }).catch(err=>{
        res.json({"err" : "Error in updating counter Parameters"});
    })
    } 
    else if(req.params.parameter == 'course_prefix')
    {
        collection.updateOne({},{$set : {course_prefix : req.params.value}}).then(data=>{
        res.json({"msg":"Course Prefix updated successfully"});
        
    }).catch(err=>{
        res.json({"err" : "Error in updating course counter prefix"});
    })
    }

    else if(req.params.parameter == 'premium')
    {
        collection.updateOne({},{$set : {premium : Number(req.params.value)}}).then(data=>{
        res.json({"msg":"Premium Counter updated successfully"});
        
    }).catch(err=>{
        res.json({"err" : "Error in updating counter Parameters"});
    })
    } 
    else if(req.params.parameter == 'premium_prefix')
    {
        collection.updateOne({},{$set : {premium_prefix : req.params.value}}).then(data=>{
        res.json({"msg":"Premium Prefix updated successfully"});
        
    }).catch(err=>{
        res.json({"err" : "Error in updating premium counter prefix"});
    })
    }
})

})

app.put('/library/config/set/:institute_id',(req,res,next)=>{

    connection.db.collection("library_config", function(err, collection){
        if(err)
        {
            res.json({"err":"Error in setting Config Parameters"})
        }
        collection.findOneAndUpdate({institute_id : req.params.institute_id},
            {$set : {
                books_per_page : req.body.books_per_page,
                release : req.body.release,
                img_size : req.body.img_size,
                doc_size : req.body.doc_size,
                avatar_size : req.body.avatar_size,
                logo_size : req.body.logo_size,
                default_book_view : req.body.default_book_view,
                default_user_view : req.body.default_user_view
            }}).then(
                data=>{
                    res.json({"msg":"Configuration Parameters Updated Successfully!"}) 
                }
            ).catch(err =>{
                res.json({"err":"Error in setting Config Parameters"});
            })
    });

})


app.get('/system/get',(req,res,next)=>{
    connection.db.collection('system',function(err,collection)
    {
        if(err)
        {
            res.json({"err":"Error in loading System Branding 1" + JSON.stringify(err)}) 
        }
        collection.find({}).toArray(function(err, data){
            if(err)
            {
                res.json({"err":"Error in Loading System Branding 2" + JSON.stringify(err)})
            }
            res.json(data)
        })
    })
})

app.get('/system/update/:name/:tagline/:icon_width',(req,res,next)=>{
    connection.db.collection('system',(err,collection)=>{
        if(err)
        {
            res.json({"err":"Error in updating System Branding"}) 
        }
        collection.updateOne({},{$set : {name : req.params.name, tagline : req.params.tagline,icon_width 
        :req.params.icon_width}})
        .then(
            data=>{
                res.json({"msg":"Brand has been updated successfully"});
            }
        ).catch(err=>{
            res.json({"err":"Error in updating System Branding"}) 
        })
    })
})

app.put('/config/update',(req,res,next)=>{
    
    connection.db.collection('system',(err,collection)=>{
        if(err)
        {
            res.json({"err":"Error in updating system configuration"});
        }
        collection.updateOne({},
            {$set : {
                avatar_size: Number(req.body.profile_img_size),
                cover_size: Number(req.body.cover_img_size),
                logo_size: Number(req.body.ins_logo_size),
                package_icon_size : Number(req.body.package_icon_size),
                MAX_SPACE : Number(req.body.max_space),
                MAX_USER : Number(req.body.max_user),
                MAX_SUBSCRIPTION : Number(req.body.max_subscription),
                admin_email: req.body.admin_email,
                otp_size : Number(req.body.otp_size),
                otp_resend_time : Number(req.body.otp_resend_time),
                otp_valid_upto : Number(req.body.otp_valid_upto)
            }}
            ).then(
                data=>{
                    res.json({"msg" : "System Configuration has been updated successfully"})
                }
            ).catch(
                err=>{
                    res.json({"err" : "Error in updating system configuration"});
                }
            )
        
    })
})

app.listen(process.env.PORT, function()
{
    console.log("Edurex Server is running on port "+ port);
});
