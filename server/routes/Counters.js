// Developed by : Agnibha Chandra , March 30 , 2020

const express = require('express');
const counters = express.Router();
const cors = require('cors');

const Counter = require('../models/Counter');
counters.use(cors());

counters.get("/list",(req,res,next)=>
{
    Counter.find((err,data)=>{
        if(data)
        {
            res.json(data);
        }
        else if(err)
        {
            res.json({"err" : "Error in loaing Counters"});
        }
    })
})




module.exports = counters;