const express = require('express');
const subscriptions = express.Router();
const cors = require('cors');
const mongoose = require('mongoose');
const dateFormat = require('dateformat');
const User = require('../models/User');
const UserMeta = require('../models/UserMeta');
const PremiumAcess = require('../models/PremiumAccess');
const Organisation = require('../models/Organisation');
subscriptions.use(cors());


subscriptions.post('/premium-access/add',(req,res,next)=>{
    let institute = req.body.institute;
    let premium = req.body.premium;
    let valid_upto = req.body.valid_upto;
    PremiumAcess.updateOne({$and : [
                {institute_id : institute}
            ] },
            {
                $set : {
                    institute_id: role,
                    premium_id : premium,
                    access_given_on : dateFormat(new Date(),"yyyy-mm-dd'T'HH:MM:ss"),
                    valid_upto : valid_upto,
                    active : true,
                }
            },
            {
                upsert : true
            }).then(data=>{
                res.json({"msg" : "Premium Access Given"} );
            }).catch(err => {
                res.json({"err" : "Error  in Giving Access : " + err })
            })

        });
        
module.exports = subscriptions;
    