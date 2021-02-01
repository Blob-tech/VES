const express = require('express');
const users = express.Router();
const cors = require('cors');
const mongoose = require('mongoose');
const dateFormat = require('dateformat');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
users.use(cors());

//get Users depend upon subscription category
users.get('/list/:institute',(req,res,next)=>{

    User.find({ $and : [{active:true},{institute : {$elemMatch : {$eq : req.params.institute}}}]})
    .then(
        data=>{
        res.json(data);
        }
    ).catch(err=>
    {
        res.json({"err" : "Server Error ! Error in loading Subscribers" + JSON.stringify(err)})
    })
})


//add a new user
users.post('/add',async (req,res,next)=>{

    let avatar = null;
    
    if(req.files)
    {
        avatar = req.files['avatar'];
    }
    let newUser = new User(
        {
               user_id : req.body.user_id, 
               email : req.body.email,
               phone : req.body.phone,
               name : req.body.name,
               address : req.body.address,
               password : bcrypt.hashSync(req.body.password,10),
               institute :req.body.institute.split(","),
               subscription_category :req.body.subscription.split(","),
               date_of_registration : dateFormat(new Date(),"yyyy-mm-dd'T'HH:MM:ss"),
               role : req.body.role,
               avatar : null,
        }
    );

   User.findOne({
       user_id : newUser.user_id
   }).then ( async result => {
       if(!result)
       {
           const session = await mongoose.startSession();
           session.startTransaction();
           

        try{
            if(avatar)
            {
                    let name = avatar.name.split(".");
                    let stored_name=req.body.name+"-"+Date.now()+"."+ name[name.length-1];
                    avatar.mv("./uploads/user/avatar/"+stored_name, 
                    async (err)=>{
                        if(err)
                        {
                            await session.abortTransaction();
                            session.endSession();
                            res.json({"err" : "Error in uploading Profile Image. Document size should be less than 100 MB"})
                        }
                        })
                    newUser.avatar = stored_name;
            }

            
            User.create(newUser)
            .then(async data=>
                {
                    let mongooseclient = require('mongoose')
                    await mongooseclient.connect(process.env.MONGODB_URI, {useNewUrlParser:true});
                    let connection = mongooseclient.connection;
                    let countercol =  connection.db.collection("counters");
                    await countercol.updateOne({},{$inc : {user : 1}});
                    await session.commitTransaction();
                    session.endSession();
                    res.json({"msg" : "User with Id "+ newUser.user_id + " has been successfully created."});
        
                })
            .catch(
               async err =>
                {
                    await session.abortTransaction();
                    session.endSession();
                    if (err.code == 11000)
                    {
                        res.json({"err" : "Duplicate email id or Phone Number. Please register with unique email id and phone number which has not been registered in this site"});
                    }
                    else
                    {
                        res.json({"err": " Error in adding a new User to Edurex Database. Please try after few minutes" + err});
                    }

                } 

            )
            }
            catch(err)
            {
                    await session.abortTransaction();
                    session.endSession();
                    res.json({"err": " Error in adding a new Book to Edurex Database. Please try after few minutes" + err});
            }
       }
       else{
       
           res.json({"err" : "User Id already exists. Please try with a different id"});
       }
   })
   .catch(err =>
    {
        
        res.json({"err": err})
    })


})


module.exports = users;