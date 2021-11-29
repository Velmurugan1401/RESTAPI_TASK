const express = require('express') // import express framework
const app = express()
const mongoose = require('mongoose'); // Object Data Modeling (ODM) library for MongoDB is offers a variety of hooks, model validation
const bodyParser = require('body-parser')
const conf = require('./config') // import conf js to access datas inside of config.js
const apiroute = require('./router/apirouter')
const session = require('express-session') //HTTP server-side framework used to create and manage a session middleware

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: "NODE_TASK"  //secret session cookie is signed with this secret to prevent tampering  
                         //A session secret in connect is simply used to compute the hash
}))

mongoose.connect(conf.DB,function(err,success){ //connect mongodb using mongoose(ODM) ,it connect the db if connection true or false send response
    if(err){
        console.error(err)
    }else{
        console.log('DB Connected successfully!')
    }
})

app.use('/',apiroute) // is use to execute any specific query at intilization process


app.listen(conf.PORTNUMBER||4000,function(err){  //Listen connect host or port , This method is identical to Node’s http.Server.listen()
    if(err) return res.json({status:false,result:"error in list port"})  // if connect failed it return this respose
    else console.log('http://localhost:'+conf.PORTNUMBER)
})




