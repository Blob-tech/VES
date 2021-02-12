const express = require('express');
const organisations = express.Router();
const cors = require('cors');
const mongoose = require('mongoose');
const dateFormat = require('dateformat');
const fs = require('fs');

const Organisation = require('../models/Organisation');
organisations.use(cors());

//get list of all organisation
organisations.get('/list/all',(req,res,next)=>{

    Organisation.find({active : true})
    .then(
        data=>{
        res.json(data);
        }
    ).catch(err=>
    {
        res.json({"err" : "Server Error ! Error in loading Organisations" + JSON.stringify(err)})
    })
})

//get a organisation by id
organisations.get('/view/:id',(req,res,next)=>{

    Organisation.find({$and : [{active : true},{organisation_id : {$eq : req.params.id}}]})
    .then(
        data=>{
        res.json(data);
        }
    ).catch(err=>
    {
        res.json({"err" : "Server Error ! Error in get Organisation with id :" +req.params.id +" : "+ JSON.stringify(err)})
    })
})


//add a new organisation
organisations.post('/add',async (req,res,next)=>{

    let avatar = null;
    
    if(req.files)
    {
        avatar = req.files['avatar'];
    }
    let newOrganisation = new Organisation(
        {
               organisation_id : req.body.organisation_id,
               client_id : req.body.client_id, 
               contact_email : req.body.contact_email,
               contact_phone : req.body.contact_phone,
               organisation_name : req.body.organisation_name,
               contact_person : req.body.contact_person,
               address : req.body.address,
               date_of_registration : dateFormat(new Date(),"yyyy-mm-dd'T'HH:MM:ss"),
               avatar : null,
        }
    );

   Organisation.findOne({$or : [{organisation_id : newOrganisation.organisation_id}
, {client_id : newOrganisation.client_id}]
        }).then ( async result => {
       if(!result)
       {
           const session = await mongoose.startSession();
           session.startTransaction();
           

        try{
            if(avatar)
            {
                    let name = avatar.name.split(".");
                    let stored_name=req.body.organisation_name+"-"+Date.now()+"."+ name[name.length-1];
                    avatar.mv("./uploads/organisation/logo/"+stored_name, 
                    async (err)=>{
                        if(err)
                        {
                            await session.abortTransaction();
                            session.endSession();
                            res.json({"err" : "Error in uploading Organisation/Institute logo. Document size should be less than 100 MB"})
                        }
                        })
                    newOrganisation.avatar = stored_name;
            }

            
            Organisation.create(newOrganisation)
            .then(async data=>
                {
                    let mongooseclient = require('mongoose')
                    await mongooseclient.connect(process.env.MONGODB_URI, {useNewUrlParser:true});
                    let connection = mongooseclient.connection;
                    let countercol =  connection.db.collection("counters");
                    await countercol.updateOne({},{$inc : {organisation : 1}});
                    await session.commitTransaction();
                    session.endSession();
                    res.json({"msg" : "Organisation with Id "+ newOrganisation.organisation_id + " has been successfully created."});
        
                })
            .catch(
               async err =>
                {
                    await session.abortTransaction();
                    session.endSession();
                    if (err.code == 11000)
                    {
                        res.json({"err" : "Duplicate email id or Phone Number. Please register with unique Client Id, email id and phone number which has not been registered in this site"});
                    }
                    else
                    {
                        res.json({"err": " Error in adding a new Institute/Organisation to Edurex Database. Please try after few minutes" + err});
                    }

                } 

            )
            }
            catch(err)
            {
                    await session.abortTransaction();
                    session.endSession();
                    res.json({"err": " Error in adding a new Institute to Edurex Database. Please try after few minutes" + err});
            }
       }
       else{
       
           res.json({"err" : "Institute Id or Client Id already exists. Please try with a different id"});
       }
   })
   .catch(err =>
    {
        
        res.json({"err": err})
    })


})

//organisation update
organisations.put('/edit/:id',(req,res,next)=>
{
    Organisation.findOneAndUpdate({organisation_id : req.params.id},
        {
            $set : {
                organisation_name : req.body.organisation_name,
                contact_email : req.body.contact_email,
                contact_phone : req.body.contact_phone,
                contact_person : req.body.contact_person,
                address : req.body.address,
                client_id : req.body.client_id
            }

        }).then(data => {
            res.json({"msg" : "Institute has been Updated Successfully" })
        }).catch(err => {
            res.json({"err" : "Error in updating Institute"})
        })
    
})


//Deactivate an Organisation 
organisations.put('/deactivate/:state/:id',(req,res,next)=>
{
    Organisation.findOne({organisation_id : req.params.id}).then
    (
        data=>
        {
            if(data)
            {
                if(req.params.state == 'true')
                {
                    Organisation.findOneAndUpdate({organisation_id : req.params.id},
                        {
                            $set : {isActivated : false}
                        })
                        .then(data => {
                            res.json({"msg" : "Organisation has been deactivated Successfully" })
                        }).catch(err => {
                            res.json({"err" : "Error in deactivating Organisation" })
                        })
                }
                else if(req.params.state == 'false')
                {
                    Organisation.findOneAndUpdate({organisation_id : req.params.id},
                        {
                            $set : {isActivated : true}
                        })
                        .then(data => {
                            res.json({"msg" : "Organisation has been activated Successfully" })
                        }).catch(err => {
                            res.json({"err" : "Error in activating Organisation" })
                        })

                }

            }
        }
    ).catch(err=>{
        res.json({"err" : "Error in activating/deactivating Organisation from Edurex Database" + err});
      })  

})


// Delete an organisation
//Delete a Book
organisations.delete('/delete/:id', (req,res,next)=>
{
          Organisation.findOne({organisation_id : req.params.id}).
          then(data=>{  
            if(data)
            {

               fs.unlinkSync('./uploads/organisation/logo/'+data.avatar)
               

                Organisation.remove({organisation_id : req.params.id},)
                .then(data => {
                        res.json({"msg" : "Organisation has been Deleted Successfully" })
                    }).catch(err => {
                        res.json({"err" : "Error in deleting Organisation" })
                    })

            }
          }).catch(err=>{
            res.json({"err" : "Error in deleting Organisation from Edurex Database" + err});
          })        
      
})

module.exports = organisations;