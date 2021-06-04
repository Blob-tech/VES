const express = require('express');
const packages = express.Router();
const cors = require('cors');
const mongoose = require('mongoose');
const Package = require('../models/Packages');
const Premium = require('../models/PackagePremium');
packages.use(cors());

//get package by id
packages.get('/view/:package_id',(req,res,next)=>{
    Package.find({package_id:req.params.package_id}).then(
        data=>{
            res.json(data);
        },
        err=>{
            res.json({"err" : "Server Error Occured ! Error in retrieving package info"});
        }
    )
})

// update a premium
packages.put("/premium/update/:premium_id",(req,res,next)=>{

    Premium.updateOne({premium_id : req.params.premium_id},
        {$set : 
        {
            package_id : req.body.package_id,
            premium_name : req.body.premium_name,
            premium_description : req.body.premium_description,
            total_premium_price : req.body.total_premium_price,
            premium_price : req.body.premium_price,
            is_splitwise : req.body.is_splitwise,
            splitwise_category : req.body.splitwise_category,
            splitwise_price : req.body.splitwise_price,
            is_discounted_price : req.body.is_discounted_price,
            discounted_premium_price : req.body.discounted_premium_price,
            max_time_period : req.body.max_time_period,
            discount_valid_upto : req.body.discount_valid_upto 

        }}).then(
            data=>{
                res.json({"msg":"Premium has been updated successfully"});
            }
        ).catch(err=>{
            res.json({"err":"Server Error ! Error in updating premium"})
        })

})

//update a package
packages.put('/update/:package_id',(req,res,next)=>{
    Package.updateOne({package_id : req.params.package_id},
        {
            $set :
            {
                package_name : req.body.package_name,
                total_media_disk_space : req.body.total_media_disk_space,
                total_users : req.body.total_users,
                subscription_categories : req.body.subscription_categories
            }
        }).then(
            data=>{
                res.json({"msg" : "Package has been updated successfully"});
            },
            err=>{
                res.json({"err":"Server Error Occured ! Error in updating package"});
            }
        )
})

//remove a package
packages.put('/remove/:package_id',(req,res,next)=>{
    Package.updateOne({package_id : req.params.package_id},
        {
            $set :
            {
                active : false
            }
        }).then(
            data=>{
                res.json({"msg" : "Package has been deleted successfully"});
            }
        ).catch(err=>{
            res.json({"err" : "Error in removing Package ! Please try after sometime"});
        })

})

packages.get('/premium/:package_id',(req,res,next)=>{

    Premium.find({$and : [{active : true},{package_id : req.params.package_id}]})
    .sort({package_name : 1})
    .then(
        data=>{
            res.json(data);
        }
    ).catch(
        err=>{
            res.json({"err":"Server Error ! Error in Loading package premiums"});
        }
    )
})

//get premium by id
packages.get('/premium/view/:premium_id',(req,res,next)=>{
    Premium.find({$and : [{active : true},{premium_id : req.params.premium_id}]})
    .then(
        data=>{
            res.json(data);
        }
    )
    .catch(err=>{
        res.json({"err":"Server Error! Error in loading premium details"});
    })
})

packages.put('/premium/remove/:id',(req,res,next)=>{
    Premium.updateOne({premium_id : req.params.id},
        {$set : {active : false}}).
        then(
            data=>{
                res.json({"msg" : "Premium has been deleted successfully"});
            }
        ).catch(err=>{
            res.json({"err" : "Server Error Occured ! Error in deleting Premium"});
        })
})

//get the list of active packages
packages.get('/all',(req,res,next)=>{
    Package.find({active : true}).sort({package_name : 1})
    .then(
        data=>{
            res.json(data);
        }
    ).catch(err=>{
    })
})

//delete packages
packages.put('/remove/:package_id',(req,res,next)=>{

    Package.updateOne(
        {$and :
            [
                {active : true},
                {package_id : req.params.package_id}
            ]},
            {$set : {active : true}})
            .then(data=>{
                res.json({"msg":"Package deleted successfully"})
            }).catch(err=>{
                res.json({"err":"Server Error ! Error in deleting package"})
            })
});

//Add a new premium to package
packages.post('/premium/add',async (req,res,next)=>{

    let newPremium = new Premium(
        {
            premium_id : req.body.premium_id,
            package_id : req.body.package_id,
            premium_name : req.body.premium_name,
            premium_description : req.body.premium_description,
            total_premium_price : req.body.total_premium_price,
            premium_price : req.body.premium_price,
            is_splitwise : req.body.is_splitwise,
            splitwise_category : req.body.splitwise_category,
            splitwise_price : req.body.splitwise_price,
            is_discounted_price : req.body.is_discounted_price,
            discounted_premium_price : req.body.discounted_premium_price,
            max_time_period : req.body.max_time_period,
            discount_valid_upto : req.body.discount_valid_upto 
        }
    );
    const session = await mongoose.startSession();
    session.startTransaction();

    Premium.create(newPremium).then(
        async data=>{
            let mongooseclient = require('mongoose')
            await mongooseclient.connect(process.env.MONGODB_URI, {useNewUrlParser:true});
            let connection = mongooseclient.connection;
            let countercol =  connection.db.collection("counters");
            await countercol.updateOne({},{$inc : {premium : 1}});
            await session.commitTransaction();
            session.endSession();
            res.json({"msg" : "Package : " + req.body.premium_name + " has been created successfully"});
        }
    ).catch(
       async  err=>{
            res.json({"err" : "Server Error Occured ! Please try again" + err});
        }
    )
})

// Add a new  Package to the database

packages.post('/add',async (req, res, next)=>
{
    let PackageIcon = null;
    
    
    if(req.files)
    {
        PackageIcon = req.files['package'];
    }
    let newPackage = new Package(
        {
            package_id : req.body.package_id,
            package_name : req.body.package_name,
            total_media_disk_space : req.body.total_media_disk_space,
            total_users : req.body.total_users,
            subscription_categories :req.body.subscription_categories,
            package_avatar : null,
            active : true
        });

   Package.findOne({
       package_id : newPackage.package_id
   }).then ( async result => {
       if(!result)
       {
           const session = await mongoose.startSession();
           session.startTransaction();

        try{
            if(PackageIcon)
            {
                    let name = PackageIcon.name.split(".");
                    let stored_name=req.body.package_name+"-"+Date.now()+"."+ name[name.length-1];
                    PackageIcon.mv("./uploads/packages/icon/"+stored_name, 
                    async (err)=>{
                        if(err)
                        {
                            await session.abortTransaction();
                            session.endSession();
                            res.json({"err" : "Error in uploading package !!"})
                        }
                        })
                    newPackage.package_avatar = stored_name;
                    
            }

            
            Package.create(newPackage)
            .then(async data=>
                {
                    let mongooseclient = require('mongoose')
                    await mongooseclient.connect(process.env.MONGODB_URI, {useNewUrlParser:true});
                    let connection = mongooseclient.connection;
                    let countercol =  connection.db.collection("counters");
                    await countercol.updateOne({},{$inc : {package : 1}});
                    await session.commitTransaction();
                    session.endSession();
                    res.json({"msg" : "Package with Id "+ newPackage.package_id + " has been successfully created."});
        
                })
            .catch(
               async err =>
                {
                    await session.abortTransaction();
                    session.endSession();
                    res.json({"err": " Error in adding a new Package to Edurex Database. Please try after few minutes" + err});
                } 
            )
            }
            catch(err)
            {
                    await session.abortTransaction();
                    session.endSession();
                    res.json({"err": " Error in adding a new Package to Edurex Database. Please try after few minutes" + err});
            }
       }
       else{
       
           res.json({"err" : "Package Id already exists. Please try with a different id"});
       }
   })
   .catch(err =>
    {
        
        res.json({"err": err})
    })


})


module.exports = packages;