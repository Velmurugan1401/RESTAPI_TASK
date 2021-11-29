const mongoose = require('mongoose');  //import mongoose Mongoose is an Object Data Modeling (ODM) library for MongoDB
const Schema = mongoose.Schema; //schemas to define the structure and data types within a document otherwise the shape of document inside a paticular collection

const userSchema = new mongoose.Schema({    //schema object
    name: {  
      type: String, //datatype
      required: true,
      max: 255,
    },
    email: {
      type: String,
      required: true,
      max: 255,
    },
    password: {
      type: String,
      required: true,
      max: 1024,
    },
    createddate: {
      type: Date,
      default: Date.now, //default mean when the date not include the user insert data it taken the default time of system
    },
    lastupdateddate: {
        type: Date,
        default: Date.now,
      },
  });
  
  module.exports = mongoose.model("User", userSchema);  // is used to create a collection of a particular database of MongoDB
 