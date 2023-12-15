const Bus = require("../models/Bus");
const _ = require("lodash");
const Owner = require("../models/Owner");

// for image optimzation
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const { checkDateAvailability } = require("../helpers");
// console.log("Importing checkDateAvailabilty...");

exports.busBySlug = async (req, res, next, slug) => {
  const bus = await Bus.findOne({ slug }).populate("owner", "name role");
  if (!bus) {
    return res.status(400).json({ error: "Bus not found " });
  }

  req.bus = bus;
  next();
};
// req.bus= bus;
// next();
exports.read = (req, res) => {
  // mathi assign garyako req.bus ko data response ma return garyako
  return res.json(req.bus);
};

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
  // if (_.size(req.query) < 1)
  //   return res.status(400).json({ error: "Invalid query" });

  const { startLocation, endLocation, journeyDate } = req.query;

  // console.log("error");

  const bus = await Bus.find({
    startLocation,
    endLocation,
    journeyDate,
    isAvailable: true,
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
    type: { $in: type },
  })
    .populate("travel", "name")
    .populate("startLocation", "name")
    .populate("endLocation", "name");
  res.json(bus);
};

// yasma chai halka chatgpt ko help ligyaxu hai

// exports.create = async (req, res) => {
//   const busExists = await Bus.findOne({ busNumber: req.body.busNumber });
//   if (busExists)
//     return res.status(403).json({
//       error: "Bus is already added!"
//     });

//   if (req.file !== undefined) {
//     const { filename: image } = req.file;

//     //Compress image
//     await sharp(req.file.path)
//       .resize(800)
//       .jpeg({ quality: 100 })
//       .toFile(path.resolve(req.file.destination, "resized", image));
//     fs.unlinkSync(req.file.path);
//     req.body.image = "busimage/resized/" + image;
//   }

// exports.create = (req, res) => {

//   Bus.findOne({ busNumber: req.body.busNumber })
//     .then(busExists => {
//       if (busExists) {

//         return res.status(403).json({
//           error: "Bus is already added!"
//         });
//       }

//       if (req.file !== undefined) {
//         const { filename: image } = req.file;

//         //Compress image
//         return sharp(req.file.path)
//           .resize(800)
//           .jpeg({ quality: 100 })
//           .toFile(path.resolve(req.file.destination, "resized", image))
//           .then(() => {
//             fs.unlinkSync(req.file.path);
//             req.body.image = "busimage/resized/" + image;
//           });
//       } else {
//         return Promise.resolve();
//       }
//     })
//     .then(() => {
//       if (req.body.boardingPoints) {
//         req.body.boardingPoints = req.body.boardingPoints.split(",");
//       }
//       if (req.body.droppingPoints) {
//         req.body.droppingPoints = req.body.droppingPoints.split(",");
//       }

//       const bus = new Bus(req.body);
//       bus.seatsAvailable = req.body.numberOfSeats;

//       if (!checkDateAvailability(req.body.journeyDate)) {
//         bus.isAvailable = false;
//       }

//       bus.owner = req.ownerauth;

//       return bus.save();
//     })
//     .then(bus => {
//       res.json(bus);
//     })
//     .catch(error => {
//       res.status(500).json({ error: "An error occurred" });
//     });
// };

async function uploadToCloudflare(image) {
  try {
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;

    // Construct form data using the form-data library
    const formData = new FormData();
    formData.append("file", image, { filename: "file.jpg" });

    // Make the API request
    const response = await axios.post(
      "https://api.cloudflare.com/client/v4/accounts/f6cbe271191b3ad841b63ec6b129869d/images/v1",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${apiToken}`,
        },
      }
    );

    // Log the complete response for inspection
    // console.log("Cloudflare API Response:", response.data);

    // Check if the response contains the expected data structure
    if (
      response.data.result &&
      response.data.result.variants &&
      response.data.result.variants.length > 0
    ) {
      // Extract the URL from the variants array
      const imageUrl = response.data.result.variants[0];

      return imageUrl;
    } else {
      throw new Error("Unexpected response format from Cloudflare API");
    }
  } catch (error) {
    console.error(
      "Error handling image upload:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

// exports.create = async (req, res) => {
//   try {
//     const busExists = await Bus.findOne({ busNumber: req.body.busNumber });
//     if (busExists) {
//       return res.status(403).json({
//         error: "Bus is already added!",
//       });
//     }
//     const imageType = "busimage";
//     let imageUrl = null;

//     // Check if an image file is attached
//     if (req.file !== undefined) {
//       const { buffer: imageBuffer } = req.file;

//       // Resize the image buffer using sharp
//       const resizedImageBuffer = await sharp(imageBuffer)
//         .resize(800)
//         .jpeg({ quality: 100 })
//         .toBuffer();

//       // Upload the resized image buffer to Cloudflare
//       imageUrl = await uploadToCloudflare(resizedImageBuffer);

//       req.body.image = imageUrl;
//     }

//     // Split boardingPoints and droppingPoints if present
//     try {
//       if (req.body.boardingPoints) {
//         req.body.boardingPoints = req.body.boardingPoints.split(",");
//       }
//     } catch (error) {
//       return res.status(400).json({ error: "Invalid boarding format" });
//     }

//     if (req.body.droppingPoints) {
//       req.body.droppingPoints = req.body.droppingPoints.split(",");
//     }

//     const bus = new Bus(req.body);
//     bus.seatsAvailable = req.body.numberOfSeats;

//     if (!checkDateAvailability(req.body.journeyDate)) {
//       bus.isAvailable = false;
//     }

//     bus.owner = req.ownerauth;

//     await bus.save();

//     res.json(bus);
//   } catch (error) {
//     console.error("Error creating bus:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// exports.create = async (req, res) => {
//   const busExists = await Bus.findOne({ busNumber: req.body.busNumber });
//   if (busExists)
//     return res.status(403).json({
//       error: "Bus is already added!"
//     });

//   if (req.file !== undefined) {
//     const { filename: image } = req.file;

//     //Compress image
//     await sharp(req.file.path)
//       .resize(800)
//       .jpeg({ quality: 100 })
//       .toFile(path.resolve(req.file.destination, "resized", image));
//     fs.unlinkSync(req.file.path);
//     req.body.image = "busimage/resized/" + image;
//   }
//     try{
//   if (req.body.boardingPoints) {
//     req.body.boardingPoints = req.body.boardingPoints.split(",");
//   }
// }catch(error){
//   return res.status(400).json({error:"invalid boarding formate "})
// }
//   if (req.body.droppingPoints) {
//     req.body.droppingPoints = req.body.droppingPoints.split(",");
//   }

//   const bus = new Bus(req.body);
//   bus.seatsAvailable = req.body.numberOfSeats;

//   if (!checkDateAvailability(req.body.journeyDate)) {
//     bus.isAvailable = false;
//   }

//   bus.owner = req.ownerauth;

//   await bus.save();

//   res.json(bus);
// };

// final create function after breakdown
exports.create = async (req, res) => {
  try {
    const busExists = await Bus.findOne({ busNumber: req.body.busNumber });
    if (busExists) {
      return res.status(403).json({
        error: "Bus is already added!",
      });
    }

    try {
      if (req.body.boardingPoints) {
        req.body.boardingPoints = req.body.boardingPoints.split(",");
      }
    } catch (error) {
      return res.status(400).json({ error: "Invalid boarding format" });
    }

    if (req.body.droppingPoints) {
      req.body.droppingPoints = req.body.droppingPoints.split(",");
    }

    const bus = new Bus(req.body);
    bus.seatsAvailable = req.body.numberOfSeats;

    if (!checkDateAvailability(req.body.journeyDate)) {
      bus.isAvailable = false;
    }

    bus.owner = req.ownerauth;

    await bus.save();

    res.json(bus);
  } catch (error) {
    console.error("Error creating bus:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.uploadBusImageController = async (req, res) => {
  try {
    const ownerId = req.ownerauth._id; // Assuming the owner ID is in req.ownerauth
    console.log(ownerId);
    const imageType = "busimage";
    // Check if the owner exists
    const owner = await Owner.findById(ownerId);
    if (!owner) {
      return res.status(404).send("Owner not found");
    }

    const imageUrl = req.file
      ? await uploadToCloudflare(req.file.buffer)
      : null;

    // Save the image URL to the Bus schema
    const bus = new Bus({
      owner: ownerId,
      images: [{ type: imageType, url: imageUrl }],
    });

    await bus.save();

    res.json({
      url: imageUrl,
      message: `Bus image URL saved to Bus schema successfully`,
    });
  } catch (error) {
    console.error("Error handling image upload:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// exports.update = async (req, res) => {
//   if (req.file !== undefined) {
//     const { filename: image } = req.file;

//     //Compress image
//     await sharp(req.file.path)
//       .resize(800)
//       .jpeg({ quality: 100 })
//       .toFile(path.resolve(req.file.destination, "resized", image));
//     fs.unlinkSync(req.file.path);
//     req.body.image = "busimage/resized/" + image;
//   }

//   let bus = req.bus;
//   bus = _.extend(bus, req.body);

//   if (!checkDateAvailabilty(req.body.journeyDate)) {
//     bus.isAvailable = false;
//   }

//   await bus.save();

//   res.json(bus);
// };

// if (req.body.boardingPoints) {
//     req.body.boardingPoints = req.body.boardingPoints.split(",");
//   }
//   if (req.body.droppingPoints) {
//     req.body.droppingPoints = req.body.droppingPoints.split(",");
//   }

//   const bus = new Bus(req.body);
//   bus.seatsAvailable = req.body.numberOfSeats

//   if (!checkDateAvailabilty(req.body.journeyDate)) {
//     bus.isAvailable = false;
//   }

//   bus.owner = req.ownerauth;

//   await bus.save();

//   res.json(bus);
// };

// exports.update = async (req, res) => {
//   if (req.file !== undefined) {
//     const { filename: image } = req.file;

//     //Compress image
//     await sharp(req.file.path)
//       .resize(800)
//       .jpeg({ quality: 100 })
//       .toFile(path.resolve(req.file.destination, "resized", image));
//     fs.unlinkSync(req.file.path);
//     req.body.image = "busimage/resized/" + image;
//   }

//   let bus = req.bus;
//   bus = _.extend(bus, req.body);

//   if (!checkDateAvailability(req.body.journeyDate)) {
//     bus.isAvailable = false;
//   }

//   await bus.save();

//   res.json(bus);
// };

exports.update = async (req, res) => {
  try {
    let bus = req.bus;

    // Update bus details from the request body
    bus = _.extend(bus, req.body);

    // Check and update availability based on journey date
    if (!checkDateAvailability(req.body.journeyDate)) {
      bus.isAvailable = false;
    }

    // Save the updated bus document
    await bus.save();

    // Send the updated bus details in the response
    res.json(bus);
  } catch (error) {
    console.error("Error updating bus:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ending of bus controller function

// exports.remove = async (req, res) => {
//     let bus = req.bus;
//     await bus.remove();
//     res.json({ message: "Bus removed successfully" });
//   };

// exports.remove = async (req, res) => {
//   let bus = req.bus;
//   await bus.remove();
//   res.json({ message: "Bus removed successfully" });
// };

exports.remove = async (req, res) => {
  try {
    let bus = req.bus;

    if (!bus) {
      return res.status(404).json({ error: "Bus not found" });
    }

    await bus.deleteOne();
    res.json({ message: "Bus removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while removing the bus" });
  }
};
