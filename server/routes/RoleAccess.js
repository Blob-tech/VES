const express = require('express');
const roles = express.Router();
const cors = require('cors');
const mongoose = require('mongoose');
const dateFormat = require('dateformat');
const User = require('../models/User');
const UserMeta = require('../models/UserMeta');
const Role = require('../models/RoleAccess');
const Organisation = require('../models/Organisation');
roles.use(cors());

roles.put('/remove_access/:institute_id/:user_id',(req,res,next)=>{
    Role.deleteOne({$and : [{institute_id : req.params.institute_id},{user_id:req.params.user_id}] }).then(
        data=>{
            res.json({"msg" : "Access has been removed permanently"})
        }
    ).catch(err=>{
        res.json({"err" : "Server Error Occured !"+err})
    })
})

roles.post('/access/add',(req,res,next)=>{
    let users = req.body.users.split(',');
    let institutes = req.body.institutes.split(',');
    let role = req.body.role;
    let valid_upto = req.body.valid_upto;
    let approval = req.body.approval;

    users.forEach(user => {
        institutes.forEach(institute => {
            UserMeta.findOne({user_id : user}).then(
                data=>{
                        if(data == null || data.default_institute == null || data.default_institute == '')
                        {
                            UserMeta.updateOne({user_id : user},
                                {$set : {
                                    default_institute : institute
                                 }},{upsert : true}).then(data=>{}).catch(err=>{});
                        }
                    }
            )
            Role.updateMany({$and : [
                {user_id : user},
                {institute_id : institute}
            ] },
            {
                $set : {
                    role : role,
                    access_given : dateFormat(new Date(),"yyyy-mm-dd'T'HH:MM:ss"),
                    valid_upto : valid_upto,
                    active : true,
                    is_activated : false,
                    approval : approval
                }
            },
            {
                upsert : true
            }).then(data=>{
                res.json({"msg" : "Access Given"} );
            }).catch(err => {
                res.json({"err" : "Error  in Giving Access : " + err })
            })

        })
        
    });
})

roles.put('/toggle_access/:user_id/:institute_id/:access',(req,res,next)=>{
    if(req.params.access == 'revoke')
    {
        Role.updateOne({$and : [{active : true},{user_id : req.params.user_id},{institute_id : req.params.institute_id}]},
            {$set : {
                active : false
            }}).then(data=>{
                res.json({"msg" : "Access Revoked"})}
            ).catch(err=>{
                res.json({"err" : err})
            })

    }
    else if(req.params.access == 'renew')
    {
        Role.updateOne({$and : [{active : false},{user_id : req.params.user_id},{institute_id : req.params.institute_id}]},
            {$set : {
                active : true
            }}).then(data=>{
                res.json({"msg" : "Access Renewed"})}
            ).catch(err=>{
                res.json({"err" : err})
            })
    }
})

roles.put('/approve_access',(req,res,next)=>
{
    if(req.body.institute_id == 'SADMIN')
    {
        Role.findOneAndUpdate(
            {$and : 
                [
                    {active:true},
                    {is_activated : false},
                    {user_id : req.body.user_id},
                    {role : req.body.institute_id},
                    {approval : req.body.approver}]},
                    {$set : {
                    is_activated : true,
                    approval : "approved",
                    valid_upto : req.body.valid_upto,
                    }}).then(data=>{
                res.json({"msg" : "Access Approved"})
            }).catch(err=>{
                res.json({"err" : err})
            });
    }
    else{
    Role.findOneAndUpdate(
        {$and : [{active:true},
            {is_activated : false},
            {user_id : req.body.user_id},
            {institute_id : req.body.institute_id},
            {approval : req.body.approver}]},
    {$set : {
        is_activated : true,
        approval : "approved",
        valid_upto : req.body.valid_upto,
        role : req.body.role
    }}).then(data=>{
        res.json({"msg" : "Access Approved"})
    }).catch(err=>{
        res.json({"err" : err})
    });}
})

roles.put('/toggle_system_access/:user_id/:access',(req,res,next)=>{
    if(req.params.access == 'revoke')
    {
        Role.updateOne({$and : [{active : true},{user_id : req.params.user_id},{role : 'SADMIN'}]},
            {$set : {
                active : false
            }}).then(data=>{
                res.json({"msg" : "Access Revoked"})}
            ).catch(err=>{
                res.json({"err" : err})
            })

    }
    else if(req.params.access == 'renew')
    {
        Role.updateOne({$and : [{active : false},{user_id : req.params.user_id},{role : 'SADMIN'}]},
            {$set : {
                active : true
            }}).then(data=>{
                res.json({"msg" : "Access Renewed"})}
            ).catch(err=>{
                res.json({"err" : err})
            })
    }
})

roles.get('/people_count/:institute_id/:role',(req,res,next)=>{

    Role.find({$and : [{active : true},{is_activated : true},{institute_id : req.params.institute_id}
    ,{role : req.params.role}]}).countDocuments((err,count)=>{
        if(err)
        {
            res.json({"err" : "Server Error ! Error in retrieving count of" + req.params.role});
        }
        else
        {
            res.json(count);
        }
    })
})
roles.get('/individual_access/:user_id/:institute_id',(req,res,next)=>{
    Role.findOne({$and : [{user_id : req.params.user_id},{institute_id : req.params.institute_id}]}
        )
    .then(
        data=>{
            res.json(data);
        },
        err=>{
            res.json({"err" : "Server Error Occured ! Role Access cannot be retrieved"});
        }
    )
})

roles.get('/system_access/:user_id',(req,res,next)=>{
    Role.findOne({$and : [{user_id : req.params.user_id},{role : 'SADMIN'}]})
    .then(
        data=>{
            res.json(data);
        },
        err=>{
            res.json({"err" : "Server Error Occured ! Role Access cannot be retrieved"});
        }
    )
})

roles.get('/institute/access/:user_id',(req,res,next)=>{
    let role;
    Role.find({$and : [{active : true},{user_id : req.params.user_id}]}).then(
        data=>{
            role=data;
            data = data.map(value =>{
               return  value.institute_id
            });
            Organisation.find({$and : [{active : true},{isActivated : true},{organisation_id : {$in : data }}]})
            .sort({organisation_name : 1})
            .then(
                result=>{
                    res.json({"role" : role, "ins" : result});
                }

            ).catch(err=>{
                res.json({"err" : "Error in loading institute list" + err});
            })

            
        }
    ).catch(err=>{
        res.json({"err" : "Error in loading institute list" + err});
    })

})

roles.get('/institute/access/:user_id',(req,res,next)=>{
    let role;
    Role.find({$and : [{active : true},{user_id : req.params.user_id}]}).then(
        data=>{
            role=data;
            data = data.map(value =>{
               return  value.institute_id
            });
            Organisation.find({$and : [{active : true},{isActivated : true},{organisation_id : {$in : data }}]})
            .sort({organisation_name : 1})
            .then(
                result=>{
                    res.json({"role" : role, "ins" : result});
                }

            ).catch(err=>{
                res.json({"err" : "Error in loading institute list" + err});
            })

            
        }
    ).catch(err=>{
        res.json({"err" : "Error in loading institute list" + err});
    })

})

roles.get('/active_institute/access/:user_id',(req,res,next)=>{
    let role;
    Role.find({$and : 
        [{active : true},
        {user_id : req.params.user_id},
        {is_activated : true},
        {approval : 'approved'},
        {$or : [{valid_upto:{$gte : new Date()}},{valid_upto : ''},{valid_upto : null}]}
    ]}
    ).then(
        data=>{
            role=data;
            data = data.map(value =>{
               return  value.institute_id
            });
            Organisation.find({$and : [{active : true},{isActivated : true},{organisation_id : {$in : data }}]})
            .sort({organisation_name : 1})
            .then(
                result=>{
                    res.json({"role" : role, "ins" : result});
                }

            ).catch(err=>{
                res.json({"err" : "Error in loading institute list" + err});
            })

            
        }
    ).catch(err=>{
        res.json({"err" : "Error in loading institute list" + err});
    })

})

module.exports = roles;