const express = require('express')
const router = express.Router()  // it is a framwork help to create the router handler extend this routing to handle validation, handle 404 or other errors etc
const Apiroute = router
const jwt = require('jsonwebtoken'); //jsonwebtoken it securely transmitting information between parties as a json 
const user = require('../module/user')
const conf = require('../config')  //import config modal to access the datas of config modal
var User = new user() //craete user object module 

//check the session for user login or not sessiontime out check
var Sessioncheck =async function (req, res, next) {
    var sessionObj = req.session['sessionObj']  //get data from sessionobj it present or not
        if (sessionObj && sessionObj.token) {
            jwt.verify(sessionObj.token, conf.KEY, function (err, decoded){ //verify the session token its true than execute once session expeired it execute
                if (err){
                    res.status(401).json({
                        status: false,
                        message: 'Token expired'
                    })
                } else {
                    next(); //it is also same as return function 
    
                }
            });
           
        } else {
            res.status(401).json({
                status: false,
                message: 'Unauthorized Access'
            })
        }
};

// login user 
Apiroute.post('/login',function(req,res){ 
    User.Login(req,res) //it route the user module login function
})
//logout user
Apiroute.post('/logout',function(req,res){
    User.Logout(req,res)
})
// craete new user 
Apiroute.post('/signin',function(req,res){
    User.Insert(req,res)
})

//perform all the crud option
Apiroute.post('/user/:action',Sessioncheck,function(req,res){ //sessioncheck goto the function check the session true execute the function
    User.perforam(req,res)
})

module.exports = Apiroute // export modue to access other files inside