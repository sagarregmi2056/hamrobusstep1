const Bus = require("../models/Bus");
const _ = require("lodash");

// for image optimzation 
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const {checkDateAvailabilty}= require("../helpers");

exports.busBySlug = async(req,res,next,slug)=>{
    const bus = await Bus.findOne({slug}).populate("owner","name role");
    if(!bus){

        return res.status(400).json({error:"Bus not found "});
    }

    req.bus= bus;
next();
}
// req.bus= bus;
// next();
exports.read =(req,res)=>{
    // mathi assign garyako req.bus ko data response ma return garyako
    return res.json(req.bus)

}







exports.getBuses = async (req, res) => {
    const buses = await Bus.find()
    // This populates the "owner" field of each bus object with only the "name" field from the related owner object. This is a way to include related data in the fetched result
      .populate("owner", "name")

    //   this populates the "travel" field of each bus object with only the "name" field from the related travel object
      .populate("travel", "name")
    //   orts the list of buses based on the "created" timestamp in descending order kina ki recently added dekhauda ramro
      .sort({ created: -1 });
  
    res.json(buses);
  };




// available bus ko lagi hamlya auta availabilty check function use garyarw job schedule garna parxa every rati 12 bajya 

  exports.getAllAvailableBuses = async (req, res) => {
    const buses = await Bus.find({ isAvailable: true })
    // owner schema ko name ra phone travel ko name ra phone sangha join query jastai
      .populate("owner", "name phone")
      .populate("travel", "name")
      .sort({ created: -1 });
  
    res.json(buses);
  };


// -1: Represents descending order availabilty off vako but created timestamp anushar xa hai
  exports.getAllUnavailableBuses = async (req, res) => {
    const buses = await Bus.find({ isAvailable: false })
      .populate("owner", "name phone")
      .populate("travel", "name")
      .sort({ created: -1 });
  
    res.json(buses);
  };