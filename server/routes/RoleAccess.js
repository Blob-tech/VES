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

roles.post('/access/add',(req,res,next)=>{
    let users = req.body.users.split(',');
    let institutes = req.body.institutes.split(',');
    let role = req.body.role;
    let valid_upto = req.body.valid_upto;

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

roles.get('/institute/access/:user_id',(req,res,next)=>{
    let role;
    Role.find({$and : [{active : true},{user_id : req.params.user_id}]}).then(
        data=>{
            role=data;
            data = data.map(value =>{
               return  value.institute_id
            });
            Organisation.find({$and : [{active : true},{organisation_id : {$in : data }}]})
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