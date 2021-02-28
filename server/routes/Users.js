const express = require('express');
const users = express.Router();
const cors = require('cors');
const mongoose = require('mongoose');
const dateFormat = require('dateformat');
const bcrypt = require('bcryptjs');
const fs = require('fs');

const User = require('../models/User');
const RoleAccess = require('../models/RoleAccess');
 
users.use(cors());

//Get total user count
users.get('/count/:institute',(req,res,next)=>
{
    if(req.params.institute == 'unassigned')
    {
        RoleAccess.find({active : true})
            .then(
                roles => 
                {
                    roles = roles.map(value => value.user_id);
                    User.find({$and : [{active : true},{user_id : {$nin : roles}}]})
                    .countDocuments((err,count) => {
                        if(err)
                        {
                            res.json({"err": "Error in loading the list of Users from Edurex Database."})
                        }
                        else
                        {
                            
                            res.json(count)
                        }

                    })}
                    )
                    .catch(err => {
                        res.json({"err" : "Server Error ! Error in loading User Counter" + JSON.stringify(err)});
                    })
                }
                    else
                    {
                        User.find({ $and : [{active:true},{institute : {$elemMatch : {$eq : req.params.institute}}}]})
                        .countDocuments((err,count) => {
                            if(err)
                            {
                                res.json({"err": "Error in loading the list of Users from Edurex Database."})
                            }
                            else
                            {

                                res.json(count)
                            }
                        })

                    }

})


//get Users depend upon role and institutes
users.get('/list/:institute/:users_per_page/:page',(req,res,next)=>{

    if(req.params.institute == 'unassigned')
    {
        RoleAccess.find({active : true})
            .then(
                roles => 
                {
                    roles = roles.map(value => value.user_id);
                    User.find({$and : [{active : true},{user_id : {$nin : roles}}]}).sort({name : 1})
                    .skip((Number(req.params.page)-1)*(Number(req.params.users_per_page))).limit(Number(req.params.users_per_page))
                    .then(
                        data => 
                        {
                            res.json(data);
                        }
                    ).catch(
                        err=>{
                            res.json({"err" : "Server Error ! Error in loading role access" + JSON.stringify(err)});
                        }
                    )
                }
            )
            .catch(err => {
                res.json({"err" : "Server Error ! Error in loading Users" + JSON.stringify(err)});
            })
    }
    else {
    User.find({ $and : [{active:true},{institute : {$elemMatch : {$eq : req.params.institute}}}]})
    .sort({name : 1})
    .skip((Number(req.params.page)-1)*(Number(req.params.users_per_page))).limit(Number(req.params.users_per_page))
    .then(
        data=>{
        res.json(data);
        }
    ).catch(err=>
    {
        res.json({"err" : "Server Error ! Error in loading Users" + JSON.stringify(err)})
    })
}
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
               date_of_registration : dateFormat(new Date(),"yyyy-mm-dd'T'HH:MM:ss"),
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
                    res.json({"err": " Error in adding a new User to Edurex Database. Please try after few minutes" + err});
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


//Deactivate an User
users.put('/deactivate/:state/:id',(req,res,next)=>
{
    User.findOne({user_id : req.params.id}).then
    (
        data=>
        {
            if(data)
            {
                if(req.params.state == 'true')
                {
                    User.findOneAndUpdate({user_id : req.params.id},
                        {
                            $set : {isActivated : false}
                        })
                        .then(data => {
                            res.json({"msg" : "User has been deactivated Successfully" })
                        }).catch(err => {
                            res.json({"err" : "Error in deactivating User" })
                        })
                }
                else if(req.params.state == 'false')
                {
                    User.findOneAndUpdate({user_id : req.params.id},
                        {
                            $set : {isActivated : true}
                        })
                        .then(data => {
                            res.json({"msg" : "User has been activated Successfully" })
                        }).catch(err => {
                            res.json({"err" : "Error in activating user" })
                        })

                }

            }
        }
    ).catch(err=>{
        res.json({"err" : "Error in activating/deactivating User from Edurex Database" + err});
      })  

})

// Delete an User
users.delete('/delete/:id', (req,res,next)=>
{
          User.findOne({user_id : req.params.id}).
          then(data=>{  
            if(data)
            {

              // fs.unlinkSync('./uploads/user/avatar/'+data.avatar)
               

               User.findOneAndUpdate({user_id : req.params.id},
                {
                    $set : {active : false}
                })
                .then(data => {
                    res.json({"msg" : "User has been deleted Successfully" })
                }).catch(err => {
                    res.json({"err" : "Error in deleting user" })
                })

            }
          }).catch(err=>{
            res.json({"err" : "Error in deleting user from Edurex Database" + err});
          })        
      
})

//delete many users
users.put("/bulkactions/delete/:n",(req,res,next)=>
{
    let id = [];
    for(var i = 0 ; i < req.params.n ; i++)
    {
        id.push(req.body[i].user_id)
    }
    User.find({
        user_id : { $in : id}
     }).then(
         data=>{
             data.forEach(value =>
                fs.unlinkSync('./uploads/user/avatar/'+value.avatar)
                )
         }
     )
   
    User.updateMany(
        {
           user_id : { $in : id}
        },
        {
            active : false
        }
    ).then(
        data => {
            res.json({"msg": req.params.n + " Users has been successfully deleted"});
        }
    ).catch(err=>
        {
            res.json({"err": "Error in deleting "+req.params.n+" User. Please try after few minutes." + err})
        })
});

//deactivate many users
users.put("/bulkactions/deactivate/:state/:n",(req,res,next)=>
{
    let id = [];
    for(var i = 0 ; i < req.params.n ; i++)
    {
        id.push(req.body[i].user_id)
    }
    
    if(req.params.state == 'false')
    {
    User.updateMany(
        {
           user_id : { $in : id}
        },
        {
            isActivated : false
        }
    ).then(
        data => {
            res.json({"msg": req.params.n + " Users has been successfully deactivated"});
        }
    ).catch(err=>
        {
            res.json({"err": "Error in deactivating "+req.params.n+" Users. Please try after few minutes." + err})
        })
    }
    else if(req.params.state == 'true')
    {

        User.updateMany(
            {
               user_id : { $in : id}
            },
            {
                isActivated : true
            }
        ).then(
            data => {
                res.json({"msg": req.params.n + " Users has been successfully activated"});
            }
        ).catch(err=>
            {
                res.json({"err": "Error in activating "+req.params.n+" User. Please try after few minutes." + err})
            })

    }
});




module.exports = users;