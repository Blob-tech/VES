const express = require('express');
const subscriptions = express.Router();
const cors = require('cors');
const mongoose = require('mongoose');
const dateFormat = require('dateformat');
const User = require('../models/User');
const UserMeta = require('../models/UserMeta');
const SubscriptionAcess = require('../models/SubscriptionAccess');
const Organisation = require('../models/Organisation');
subscriptions.use(cors());


    