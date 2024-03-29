const express = require('express');
const organisations = express.Router();
const cors = require('cors');
const mongoose = require('mongoose');
const dateFormat = require('dateformat');
const fs = require('fs');

const Organisation = require('../models/Organisation');
organisations.use(cors());

//get total institute counts
organisations.get('/count',(req,res,next)=>{
 Organisation.find({active : true}).countDocuments((err,count)=>{
    if(err)
    {
        return json({"err" : "Server Error Occured !"})
    }
    else
    {
        res.json(count);
    }
 })
 
})

//get List of Organisation by page 
organisations.get('/list/all/:org_per_page/:page',(req,res,next)=>{

    Organisation.find()
    Organisation.find({active : true})
        .sort({organisation_name : 1}).skip((Number(req.params.page)-1)*(Number(req.params.org_per_page))).limit(Number(req.params.org_per_page))
        .then(
            data=>{
                res.json(data);
            }
        ).catch(err=>{
            res.json({"err":"Server Error ! Error in loading Organisations" + JSON.stringify(err)});
        })
});

//get list of all organisation
organisations.get('/list/all',(req,res,next)=>{

    Organisation.find({active : true}).sort({organisation_name : 1})
    .then(
        data=>{
        res.json(data);
        }
    ).catch(err=>
    {
        res.json({"err" : "Server Error ! Error in loading Organisations" + JSON.stringify(err)})
    })
})



//get a organisation by client id
organisations.get('/view_by_client_id/:client_id',(req,res,next)=>{

    Organisation.find({client_id : req.params.client_id})
    .then(
        data=>{
            res.json(data);
        }
    ).catch(err => {
        res.json({"err" :  "Server Error ! Error in get Organisation with client id :" +req.params.client_id +" : "+ JSON.stringify(err)} );
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
organisations.post('/add',(req,res,next)=>{

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
        }).then ( result => {
       if(!result)
       {
           
           

        try{
            if(avatar)
            {
                    let name = avatar.name.split(".");
                    let stored_name=req.body.organisation_name+"-"+Date.now()+"."+ name[name.length-1];
                    avatar.mv("./uploads/organisation/logo/"+stored_name, 
                    (err)=>{
                        if(err)
                        {
                            res.json({"err" : "Error in uploading Organisation/Institute logo. Logo size exceeding the limit"})
                        }
                        })
                    newOrganisation.avatar = stored_name;
            }

            
            Organisation.create(newOrganisation)
            .then(data=>
                {
                    let mongooseclient = require('mongoose')
                    mongooseclient.connect(process.env.MONGODB_URI, {useNewUrlParser:true});
                    let connection = mongooseclient.connection;
                    let countercol =  connection.db.collection("counters");
                    let libraryconfig = connection.db.collection("library_config");
                    countercol.updateOne({},{$inc : {organisation : 1}});
                    libraryconfig.updateOne({institute_id : req.body.organisation_id},
                        {$set :{
                            release: 2592000000,
                            img_size:2,
                            doc_size:20,
                            avatar_size:1,
                            books_per_page : 10,
                            logo_size :2,
                            default_book_view : "GRID",
                            default_user_view : "GRID",
                            institute_id : req.body.organisation_id,
                        }
                    },{upsert : true}
                    )
                    res.json({"msg" : "Organisation with Id "+ newOrganisation.organisation_id + " has been successfully created."});
        
                })
            .catch(
               err =>
                {

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
            }

        }).then(data => {
            res.json({"msg" : "Institute has been Updated Successfully" })
        }).catch(err => {
            res.json({"err" : "Error in updating Institute"})
        })
    
})

//Edit Institute Logo
organisations.put('/edit/logo/:id',(req,res,next)=>{

    var stored_name="";
    if(req.files)
    {
        Logo = req.files['logo'];
        
    }
    

                    Organisation.findOne({organisation_id : req.params.id}).then ( result => {
                        if(result)
                        {
                            if(Logo)
                            {
                                var name = Logo.name.split(".");
                                stored_name=result.organisation_name+"-"+Date.now()+"."+ name[name.length-1];
                                    Logo.mv("./uploads/organisation/logo/"+stored_name, 
                                    (err)=>{
                                        if(err)
                                        {
                                            res.json({"err" : "Error in uploading Institute Logo. Logo size is exceeding the limit"})
                                        }
                                        })
                                    
                                        if(result.avatar != null)
                                        {
                                            fs.unlinkSync("./uploads/organisation/logo/"+result.avatar);
                                        }
                                        
                                    
                                        Organisation.findOneAndUpdate({organisation_id : req.params.id},
                                            {$set : {avatar : stored_name}})
                                            .then(data=>{
                                                res.json({"msg" : "Institute/Organisation Logo Image has been updated successfully!"});
                                            }).catch(err=>{
                                                res.json({"err" : "Error in setting the thumbnail image path"});
                                            })
                                        }                  

                        }
                        else
                        {
                            res.json({"err" : "No Such Organisation Exists wit id : " + req.params.id});
                        }

                }).catch(
                    err=>{
                        res.json({"err" : "No Such Organisation Exists wit id : " + req.params.id + err});
                    }
                )
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
organisations.delete('/delete/:id', (req,res,next)=>
{
          Organisation.findOne({organisation_id : req.params.id}).
          then(data=>{  
            if(data)
            {

                if(result.avatar != null)
                {
                    fs.unlinkSync("./uploads/organisation/logo/"+result.avatar);
                }
               

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

//delete many organisations
organisations.put("/bulkactions/delete/:n",(req,res,next)=>
{
    let id = [];
    for(var i = 0 ; i < req.params.n ; i++)
    {
        id.push(req.body[i].organisation_id)
    }
    Organisation.find({
        organisation_id : { $in : id}
     }).then(
         data=>{
             data.forEach(value =>{
                if(value.avatar != null)
                {
                    fs.unlinkSync("./uploads/organisation/logo/"+value.avatar);
                }
             }
                
                )
         }
     )
   
    Organisation.deleteMany(
        {
           organisation_id : { $in : id}
        },
    ).then(
        data => {
            res.json({"msg": req.params.n + " Institute/Organisations has been successfully deleted"});
        }
    ).catch(err=>
        {
            res.json({"err": "Error in deleting "+req.params.n+" Institute/Organisation. Please try after few minutes." + err})
        })
});

//deactivate many organisations
organisations.put("/bulkactions/deactivate/:state/:n",(req,res,next)=>
{
    let id = [];
    for(var i = 0 ; i < req.params.n ; i++)
    {
        id.push(req.body[i].organisation_id)
    }
    
    if(req.params.state == 'false')
    {
    Organisation.updateMany(
        {
           organisation_id : { $in : id}
        },
        {
            isActivated : false
        }
    ).then(
        data => {
            res.json({"msg": req.params.n + " Institute/Organisations has been successfully deactivated"});
        }
    ).catch(err=>
        {
            res.json({"err": "Error in deactivating "+req.params.n+" Institute/Organisation. Please try after few minutes." + err})
        })
    }
    else if(req.params.state == 'true')
    {

        Organisation.updateMany(
            {
               organisation_id : { $in : id}
            },
            {
                isActivated : true
            }
        ).then(
            data => {
                res.json({"msg": req.params.n + " Institute/Organisations has been successfully activated"});
            }
        ).catch(err=>
            {
                res.json({"err": "Error in activating "+req.params.n+" Institute/Organisation. Please try after few minutes." + err})
            })

    }
});




module.exports = organisations;