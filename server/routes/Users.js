const express = require('express');
const users = express.Router();
const cors = require('cors');
const mongoose = require('mongoose');
const dateFormat = require('dateformat');
const bcrypt = require('bcryptjs');
const fs = require('fs');

const User = require('../models/User');
const RoleAccess = require('../models/RoleAccess');
const UserMeta = require('../models/UserMeta');

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
                else if(req.params.institute == 'sadmin')
                {
                    RoleAccess.find({$and : [{active : true},
                    {role : "SADMIN"}]})
                    .then(
                        roles => 
                        {
                            roles = roles.map(value => value.user_id);
                            User.find({$and : [{active : true},{user_id : {$in : roles}}]})
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
                        RoleAccess.find({$and : [{active : true},
                            {institute_id : req.params.institute},
                        {role : {$ne : "SADMIN"}}]})
                        .then(
                            roles => 
                            {
                                roles = roles.map(value => value.user_id);
                                User.find({$and : [{active : true},{user_id : {$in : roles}}]})
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

})

//Get total user count
users.get('/count/:institute/:filter',(req,res,next)=>
{
    if(req.params.institute == 'unassigned')
    {
        searchkey = req.params.filter;
        RoleAccess.find({active : true})
            .then(
                roles => 
                {
                    roles = roles.map(value => value.user_id);
                    User.find({$and : [{active : true},
                        {user_id : {$nin : roles}},
                        {$or : [{name : new RegExp(searchkey,'i')},
                            {email : new RegExp(searchkey,'i')},
                            {phone : new RegExp(searchkey,'i')},
                            {user_id : new RegExp(searchkey,'i')}
                        ]}
                    ]})
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

                else if(req.params.institute = 'sadmin')
                {
                    searchkey = req.params.filter;
                        RoleAccess.find({$and : [{active : true},
                    {role :  "SADMIN"}]})
                            .then(
                                roles => 
                                {
                                    roles = roles.map(value => value.user_id);
                                    User.find({$and : [{active : true},
                                        {user_id : {$in : roles}},
                                        {$or : [{name : new RegExp(searchkey,'i')},
                                            {email : new RegExp(searchkey,'i')},
                                            {phone : new RegExp(searchkey,'i')},
                                            {user_id : new RegExp(searchkey,'i')}
                                        ]}
                                    ]})
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
                        searchkey = req.params.filter;
                        RoleAccess.find({$and : [{active : true},
                        {institute_id : req.params.institute},
                    {role : {$ne : "SADMIN"}}]})
                            .then(
                                roles => 
                                {
                                    roles = roles.map(value => value.user_id);
                                    User.find({$and : [{active : true},
                                        {user_id : {$in : roles}},
                                        {$or : [{name : new RegExp(searchkey,'i')},
                                            {email : new RegExp(searchkey,'i')},
                                            {phone : new RegExp(searchkey,'i')},
                                            {user_id : new RegExp(searchkey,'i')}
                                        ]}
                                    ]})
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

})


users.get('/list/:institute/:filter/:users_per_page/:page',(req,res,next)=>{

    if(req.params.institute == 'unassigned')
    {
        RoleAccess.find({active : true})
            .then(
                roles => 
                {
                    roles = roles.map(value => value.user_id);
                    searchkey = req.params.filter;
                    User.find({$and : [
                        {active : true},
                        {user_id : {$nin : roles}},
                        {$or : [{name : new RegExp(searchkey,'i')},
                            {email : new RegExp(searchkey,'i')},
                            {phone : new RegExp(searchkey,'i')},
                            {user_id : new RegExp(searchkey,'i')}
                        ]}
                    ]}).sort({name : 1})
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
    else if(req.params.institute == 'sadmin')
    {
        RoleAccess.find({and : [{active : true},{role : 'SADMIN'}]})
        .then(
            roles => 
            {
                roles = roles.map(value => value.user_id);
                searchkey = req.params.filter;
                User.find({$and : [
                    {active : true},
                    {user_id : {$in : roles}},
                    {$or : [{name : new RegExp(searchkey,'i')},
                        {email : new RegExp(searchkey,'i')},
                        {phone : new RegExp(searchkey,'i')},
                        {user_id : new RegExp(searchkey,'i')}
                    ]}
                ]}).sort({name : 1})
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

        RoleAccess.find({$and : [{active : true},
        {institute_id : req.params.institute},
        {role : {$ne : "SADMIN"}}]})
        .then(
            roles => 
            {
                roles = roles.map(value => value.user_id);
                searchkey = req.params.filter;
                User.find({$and : [
                    {active : true},
                    {user_id : {$in : roles}},
                    {$or : [{name : new RegExp(searchkey,'i')},
                        {email : new RegExp(searchkey,'i')},
                        {phone : new RegExp(searchkey,'i')},
                        {user_id : new RegExp(searchkey,'i')}
                    ]}
                ]}).sort({name : 1})
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
    else if(req.params.institute == 'sadmin')
    {
        RoleAccess.find({$and :
            [{active : true},
             {role :  "SADMIN"}
           ]})
       .then(
           roles => 
           {
               roles = roles.map(value => value.user_id);
               User.find({$and : [{active : true},{user_id : {$in : roles}}]}).sort({name : 1})
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
        RoleAccess.find({$and :
             [{active : true},
              {institute_id : req.params.institute},
              {role : {$ne : "SADMIN"}}
            ]})
        .then(
            roles => 
            {
                roles = roles.map(value => value.user_id);
                User.find({$and : [{active : true},{user_id : {$in : roles}}]}).sort({name : 1})
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
})

users.get('/view/:user_id', async(req,res,next)=> {
    User.findOne({$and : [
        {user_id : req.params.user_id},
        {active : true}
    ]}).then(data => {
        res.json(data);
    }).catch(err => {
        res.json({"err" : "No Active user with user id : " + req.params.user_id});
    })
})


users.post('/login',async(req,res,next)=>{
  
    User.find({$or : [ { email : req.body.username},
                {phone : req.body.username}]}).then(data=>{
        if(data[0].active == false)
        {
            res.status(403).send({"err" : "Inactive User"})
        }
        if(data[0].isActivated == false)
        {
            res.status(403).send({"err" : "Your account has been deactivated !"})
        }
        if(data[0].is_locked_out == true)
        {
            res.status(423).send({"err" : "Your account has been Locked ! Please contact the System Administrator"});
        }
        if(data.length == 0)
        {
            res.status(401).send({"err" : "Invalid Credentials ! Either Username or Password is invalid"})
        }
        else
        {
           let bool = bcrypt.compareSync(req.body.password,data[0].password);
           if(bool == false)
           {
            res.status(401).send({"err" : "Invalid Credentials ! Either Username or Password is invalid"});
           }
           else
           {
                res.json({
                    user_id : data[0].user_id,
                    email : data[0].email,
                    phone : data[0].phone,
                    name : data[0].name,
                    address : data[0].address,
                    avatar : data[0].avatar,
                    cover : data[0].cover,
                    date_of_registration : data[0].date_of_registration,
                    drak_mode : data[0].dark_mode,
                    theme : data[0].theme,
                    isVerified : data[0].isVerified
                });
           }
        }

    }).catch(err=>{

        res.status(401).send({"err" : "Invalid Credentials ! Either Username or Password is invalid"})
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


//Edit User profile picture
users.put('/edit/logo/:id',(req,res,next)=>{

    var stored_name="";
    if(req.files)
    {
        Logo = req.files['logo'];
        
    }
    

                    User.findOne({user_id : req.params.id}).then ( result => {
                        if(result)
                        {
                            if(Logo)
                            {
                                var name = Logo.name.split(".");
                                stored_name=result.name+"-"+Date.now()+"."+ name[name.length-1];
                                    Logo.mv("./uploads/user/avatar/"+stored_name, 
                                    (err)=>{
                                        if(err)
                                        {
                                            res.json({"err" : "Error in uploading user profile picture. Image size is exceeding the limit"})
                                        }
                                        })
                                         if(result.avatar != null)
                                         {
                                            fs.unlinkSync("./uploads/user/avatar/"+result.avatar);
                                         }
                                       
                                    
                                       User.findOneAndUpdate({user_id : req.params.id},
                                            {$set : {avatar : stored_name}})
                                            .then(data=>{
                                                res.json({"msg" : "Profile Picture Image has been updated successfully!"});
                                            }).catch(err=>{
                                                res.json({"err" : "Error in setting the profile image path"});
                                            })
                                        }                  

                        }
                        else
                        {
                            res.json({"err" : "No Such User Exists wit id : " + req.params.id});
                        }

                }).catch(
                    err=>{
                        res.json({"err" : "No Such User Exists wit id : " + req.params.id + err});
                    }
                )
})

//Edit User profile picture
users.put('/edit/cover/:id',(req,res,next)=>{

    var stored_name="";
    let Cover = null;
    if(req.files)
    {
        Cover = req.files['cover'];
        
    }
    

                    User.findOne({user_id : req.params.id}).then ( result => {
                        if(result)
                        {
                            if(Cover)
                            {
                                var name = Cover.name.split(".");
                                stored_name=result.name+"-"+Date.now()+"."+ name[name.length-1];
                                    Cover.mv("./uploads/user/cover/"+stored_name, 
                                    (err)=>{
                                        if(err)
                                        {
                                            res.json({"err" : "Error in uploading user profile cover. Image size is exceeding the limit"})
                                        }
                                        })
                                         if(result.cover != null)
                                         {
                                            fs.unlinkSync("./uploads/user/cover/"+result.cover);
                                         }
                                       
                                    
                                       User.findOneAndUpdate({user_id : req.params.id},
                                            {$set : {cover : stored_name}})
                                            .then(data=>{
                                                res.json({"msg" : "Profile Picture Cover has been updated successfully!"});
                                            }).catch(err=>{
                                                res.json({"err" : "Error in setting the profile cover path"});
                                            })
                                        }                  

                        }
                        else
                        {
                            res.json({"err" : "No Such User Exists wit id : " + req.params.id});
                        }

                }).catch(
                    err=>{
                        res.json({"err" : "No Such User Exists wit id : " + req.params.id + err});
                    }
                )
})


//update basic info of users
users.put('/update/:id', (req,res,next)=>{
    User.findOneAndUpdate({user_id : req.params.id},
        {
            $set : {
                name : req.body.name,
                email : req.body.email,
                phone : req.body.phone,
                address : req.body.address,

            }
        }).then( result=> {
            res.json({"msg" : "User Basic Info has been updated successfully"});}
        ).catch(err => {
            res.json({"err" : "Server Error !  Error in updating user with id : " + req.params.id});
})
})

//Remove User profile picture
users.delete('/remove/logo/:id',(req,res,next)=>{

                    User.findOne({user_id : req.params.id}).then ( result => {
                        if(result)
                        {
                            
                            if(result.avatar != null)
                            {
                                fs.unlinkSync("./uploads/user/avatar/"+result.avatar);
                            } 
                            
                                    
                            User.findOneAndUpdate({user_id : req.params.id},
                            {$set : {avatar : null}})
                            .then(data=>{
                            res.json({"msg" : "Profile Picture Image has been removed successfully!"});
                            }).catch(err=>{
                            res.json({"err" : "Error in removing the profile image path"});
                            })
                            }                  
   
                }).catch(
                    err=>{
                        res.json({"err" : "No Such User Exists wit id : " + req.params.id + err});
                    }
                )
})

//Remove User profile picture
users.delete('/remove/cover/:id',(req,res,next)=>{

    User.findOne({user_id : req.params.id}).then ( result => {
        if(result)
        {
            
            if(result.cover != null)
            {
                fs.unlinkSync("./uploads/user/cover/"+result.cover);
            } 
            
                    
            User.findOneAndUpdate({user_id : req.params.id},
            {$set : {cover : null}})
            .then(data=>{
            res.json({"msg" : "Profile Cover has been removed successfully!"});
            }).catch(err=>{
            res.json({"err" : "Error in removing the profile image path"});
            })
            }                  

}).catch(
    err=>{
        res.json({"err" : "No Such User Exists wit id : " + req.params.id + err});
    }
)
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
              
            //  fs.unlinkSync('./uploads/user/avatar/'+data.avatar)
               

               User.findOneAndUpdate({user_id : req.params.id},
                {
                    $set : {active : false,
                            deleted_on : dateFormat(new Date(),"yyyy-mm-dd'T'HH:MM:ss") }
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
            /* data.forEach(value =>
                fs.unlinkSync('./uploads/user/avatar/'+value.avatar)
                )*/
         }
     )
   
    User.updateMany(
        {
           user_id : { $in : id}
        },
        {
            active : false,
            deleted_on : dateFormat(new Date(),"yyyy-mm-dd'T'HH:MM:ss")
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

users.get('/usermetas/view/:user_id',(req,res,next)=>{
   
UserMeta.findOne({user_id : req.params.user_id}).then(
    data=>{
        res.json(data);
    }).catch(err=>{
        res.json(null);
    })
})


users.post('/social_profiles/add/:user_id',(req,res,next)=>{

    UserMeta.updateOne({user_id : req.params.user_id},
        {$set : {
            social_profiles : req.body
        }},
        {upsert : true}
    ).then(
            data=>{
                res.json({"msg" : "Social Profile Links for user with id : " + req.params.user_id 
                + " has been successfully updated"});
            },
        ).catch(err => {
            res.json({"err" : "Server Error ! Error in updating social profiles"});
        })

})

users.post('/personal_info/add/:user_id',(req,res,next)=>{

    UserMeta.updateOne({user_id : req.params.user_id},
        {$set : {
            personal_info : req.body
        }},
        {upsert : true}
    ).then(
            data=>{
                res.json({"msg" : "Personal info for user with id : " + req.params.user_id 
                + " has been successfully updated"});
            },
        ).catch(err => {
            res.json({"err" : "Server Error ! Error in updating Personal Info"});
        })

})

users.post('/visibility/:user_id',(req,res,next)=>{
    let param = req.params.param
    UserMeta.updateOne({user_id : req.params.user_id},
        {$set : {
            settings : {
                visibility : req.body
            } 
        }},
        {upsert : true}
    ).then(
            data=>{
                res.json({"msg" : "Visibility set"});
            },
        ).catch(err => {
            res.json({"err" : "Server Error ! Error in setting visibility"});
        })
})

users.post('/theme/:theme/:dark_mode/:user_id',(req,res,next)=>{
    let theme = req.params.theme
    let dark_mode = req.params.dark_mode == "true" ? true : false
    User.update({user_id : req.params.user_id},
        {$set : {theme : theme, dark_mode : dark_mode}}).then(
            data=>{
                res.json({"msg" : "Theme set"});
            }
        ).catch(err=>{
            res.json({"err" : "Server Error ! Error in setting theme"});
        })
})


module.exports = users;