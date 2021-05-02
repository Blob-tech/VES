const express = require('express');
const packages = express.Router();
const cors = require('cors');
const mongoose = require('mongoose');
const Package = require('../models/Packages');
packages.use(cors());

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