const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); //is a secured way to store passwords in my database
const Tables = require('./table');
const conf = require('../config');

//this is the object modal 
var user = function(){
    this.table = Tables;
}

user.prototype.perforam = function(req,res){  //prototype is an object that is associated with every functions and objects by default ,Prototype is the mechanism by which Js objects inherit features from one another
    var expression = req.params.action // is getting params values in url
    switch(expression) {
        case 'add':
            this.Insert(req,res)
            break;
        case 'update':
            this.update(req,res)
            break;
        case 'list':
            this.listall(req,res)
            break;
        case 'delete':
            this.delete(req,res)
            break;
        default:
        res.json({status:false,result:"error"})
    }

}

//login module find and store session
user.prototype.Login =async function(req,res){
    var reqObj = req.body;
    if(reqObj.email && reqObj.password ){
        this.table.find({email:reqObj.email},function(err,result){ //find the user present or not in db
           if(err){ 
            res.json({status:false,result:err})
           }else if(result&&result.length){
            var results = result[0]
                bcrypt.compare(reqObj.password,results.password, async function(err, result) { //check the password valite or not useing hasing method
                    if(err){
                        res.json({status:false,result:'Invalite email or password'})
                    }else{
                        var payload = {
                            'name':results.name,
                            'email':results.email
                        }
                        var token = jwt.sign(payload, conf.KEY,{ expiresIn: '3h' }) //craete access token for an application and also set token expires time
                        var sessionObj = {
                            'name':results.name,
                            'email':results.email,
                            "token":token
                        }
                        req.session['sessionObj'] = sessionObj //stroe the session 
                        res.json({status:true,result:sessionObj})
                    }
                })
           }else {
                res.json({status:false,result:'User Not Found'})
           }
       }); //find the obj present or not in mongodb
     
      
    }else{
        res.json({status:false,result:'please file required filed!'})
    }

}

//Logout user to clear session
user.prototype.Logout = function(req,res){
    if(req.session){
        req.session.destroy() // this method to cleart stored values in session
    }
    res.json({status:true,result:'logout successfully!'})  
}


//craete user to check already exits or not and insert from db
user.prototype.Insert =async function(req,res){
    var reqObj = req.body
    if(reqObj && reqObj.password && reqObj.email && reqObj.name){
        if (await this.table.findOne({ email: reqObj.email })) {  //this method also same to find 
            res.json({status:false,result:"Emailid already exixts"})
        }else{
                try {
                    if (reqObj.password) {
                        reqObj.password = bcrypt.hashSync(reqObj.password, 10); //change password in hasing method to encrypte
                    }
                    const user = new this.table(reqObj);
                    const savedUser = await user.save() .then(data=>{  //store data from db 
                        res.json({ status: true, result: data });
                    })
                
                } catch (error) {
                    res.status(400).json({ error });
                }
            
        }


    }else{
        res.json({status:false,result:'please file required filed!'})
    }
}  

//update users find and update the user from db
user.prototype.update = function(req,res){
    var reqObj = req.body
    if(reqObj.email || reqObj._id){
        this.table.find({email:reqObj.email}, function(err, users) { //find the paticular user and upadte that user
            var user = users[0]
            if(err) {
                res.status(404).json({"status":false,'result':err})
            }else {
                this.table.update({_id: user._id}, {     //upadte the user in db
                    name: reqObj.name ? reqObj.name:user.name, 
                    email:user.email,
                    password: user.password, 
                    createddate: user.createddate,
                    lastupdateddate:new Date()
                }, function(err,rawResponse) {
                   //handle it
                   if(err) return res.status(404).json({"status":false,'result':err})
                    else res.json({status:true,result:rawResponse}) 
                })
                
            }
          });
    }else{
        res.json({ststus:false,result:"Please file the required filed"})
    }
    
}

//delete user remove user from db
user.prototype.delete = function(req,res){
    if(req.body.email||req.body._id){
        this.table.deleteOne(req.body,function(err,result){ //deleteone method to delete selected user from db
            if(err)return res.json({status:false,result:result})
            else res.json({status:true,result:"User deleted successfully!"})
        })
    }
    
}

//list users from db
user.prototype.listall = function(req,res){
    this.table.find(req.body, function(err, users) { //it used to find the paticular data from mongodb it also used to list all the datas from db 
        if(err) return res.status(404).json({"status":false,'result':err})
        else res.json({status:true,result:users}) 
      });
}

module.exports = user //export user to access outside of other function