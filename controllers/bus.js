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




//   aba aru same xa 


exports.getAvailableBusesOfOwner = async (req, res) => {
    const buses = await Bus.find({ owner: req.ownerauth, isAvailable: true })
      .populate("owner", "name")
      .populate("travel", "name")
      .sort({ created: -1 });
  
    res.json(buses);
  };




  exports.getUnavailableBusesOfOwner = async (req, res) => {
    const buses = await Bus.find({ owner: req.ownerauth, isAvailable: false })
      .populate("owner", "name")
      .populate("travel", "name")
      .sort({ created: -1 });
  
    res.json(buses);
  };

  

//   home page ko lagi search wala

exports.searchBus = async (req, res) => {
    if (_.size(req.query) < 1)
      return res.status(400).json({ error: "Invalid query" });
  
    const { startLocation, endLocation, journeyDate } = req.query;
  
    const bus = await Bus.find({
      startLocation,
      endLocation,
      journeyDate,
      isAvailable: true
    })
      .populate("travel", "name")
      .populate("startLocation", "name")
      .populate("endLocation", "name");
  
    return res.json(bus);
  };



//   startLocation: The starting location of the bus route.
// endLocation: The destination of the bus route.
// journeyDate: The date of the journey.
// travel: An array of travel options (possibly representing different bus services or companies).
// type: An array of bus types (e.g., regular, luxury, etc.).


exports.searchBusByFilter = async (req, res) => {
    const { startLocation, endLocation, journeyDate, travel, type } = req.body;
    const bus = await Bus.find({
      startLocation,
      endLocation,
      journeyDate,
      isAvailable: true,
      travel: { $in: travel },
      type: { $in: type }
    })
      .populate("travel", "name")
      .populate("startLocation", "name")
      .populate("endLocation", "name");
    res.json(bus);
  };




  exports.create = async (req, res) => {
    const busExists = await Bus.findOne({ busNumber: req.body.busNumber });
    if (busExists)
      return res.status(403).json({
        error: "Bus is already added!"
      });
  
    if (req.file !== undefined) {
      const { filename: image } = req.file;
  
      //Compress image
      await sharp(req.file.path)
        .resize(800)
        .jpeg({ quality: 100 })
        .toFile(path.resolve(req.file.destination, "resized", image));
      fs.unlinkSync(req.file.path);
      req.body.image = "busimage/resized/" + image;
    }

    if (req.body.boardingPoints) {
        req.body.boardingPoints = req.body.boardingPoints.split(",");
      }
      if (req.body.droppingPoints) {
        req.body.droppingPoints = req.body.droppingPoints.split(",");
      }
    
      const bus = new Bus(req.body);
      bus.seatsAvailable = req.body.numberOfSeats
    
      if (!checkDateAvailability(req.body.journeyDate)) {
        bus.isAvailable = false;
      }
    
      bus.owner = req.ownerauth;
    
      await bus.save();
    
      res.json(bus);
    };    