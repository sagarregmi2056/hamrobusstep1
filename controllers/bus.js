const Bus = require("../models/Bus");
const _ = require("lodash");
const Owner = require("../models/Owner");
const FormData = require("form-data");
const axios = require("axios");
const districtsData = require("../utils/districts.json");

const { checkDateAvailability } = require("../helpers");
const { busSubmitValidation } = require("../validator");

const { v4: uuidv4 } = require("uuid");
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

    //   orts the list of buses based on the "created" timestamp in descending order kina ki recently added dekhauda ramro
    .sort({ created: -1 });

  res.json(buses);
};

// available bus ko lagi hamlya auta availabilty check function use garyarw job schedule garna parxa every rati 12 bajya

exports.getAllAvailableBuses = async (req, res) => {
  const buses = await Bus.find({ isAvailable: true })
    // owner schema ko name ra phone travel ko name ra phone sangha join query jastai
    .populate("owner", "name phone")

    .sort({ created: -1 });

  res.json(buses);
};

// -1: Represents descending order availabilty off vako but created timestamp anushar xa hai
exports.getAllUnavailableBuses = async (req, res) => {
  const buses = await Bus.find({ isAvailable: false })
    .populate("owner", "name phone")

    .sort({ created: -1 });

  res.json(buses);
};

//   aba aru same xa

exports.getAvailableBusesOfOwner = async (req, res) => {
  const buses = await Bus.find({ owner: req.ownerauth, isAvailable: true })
    .populate("owner", "name")

    .sort({ created: -1 });

  res.json(buses);
};

exports.getUnavailableBusesOfOwner = async (req, res) => {
  const buses = await Bus.find({ owner: req.ownerauth, isAvailable: false })
    .populate("owner", "name")

    .sort({ created: -1 });

  res.json(buses);
};

//   home page ko lagi search wala

exports.searchBus = async (req, res) => {
  const { startLocation, endLocation, journeyDate } = req.query;
  const bus = await Bus.find({
    startLocation,
    endLocation,
    journeyDate,
    isAvailable: true,
  })

    .populate({
      path: "owner",
      select: "travelName", // Select the field you want to populate
    })
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
  const { startLocation, endLocation, journeyDate, type } = req.body;
  const bus = await Bus.find({
    startLocation,
    endLocation,
    journeyDate,
    isAvailable: true,
    type: { $in: type },
  })

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

// exports.BusInformation = async (req, res) => {
//   try {
//     const {
//       name,
//       busNumber,
//       busType,
//       acType,
//       wifi,
//       toiletType,
//       tvType,
//       insuranceName,
//       travelInsurance,
//       insuranceIssueDate,
//       insuranceExpiryDate,
//       roadTaxIssueDate,
//       roadTaxExpiryDate,
//     } = req.body;
//     const busid = req.params.id;

//     // Validate the request body (you can add more validation if needed)
//     if (
//       !name ||
//       !busNumber ||
//       !busType ||
//       !acType ||
//       !wifi ||
//       !toiletType ||
//       !tvType
//     ) {
//       return res.status(400).json({ error: "Required fields are missing" });
//     }

//     const bus = await Bus.findById(busid);
//     if (!bus) {
//       return res.status(404).json({ error: "Bus not found" });
//     }
//     // Create a new bus instance with the provided data
//     // const newBus = new Bus({
//     //   _id: busid,
//     //   name,
//     //   busNumber,
//     //   busType,
//     //   acType,
//     //   wifi,
//     //   toiletType,
//     //   tvType,
//     //   insuranceName,
//     //   travelInsurance,
//     //   insuranceIssueDate,
//     //   insuranceExpiryDate,
//     //   roadTaxIssueDate,
//     //   roadTaxExpiryDate,
//     //   // owner: req.ownerauth._id,
//     // });

//     const updatedBus = await Bus.findByIdAndUpdate(
//       busid,
//       {
//         name,
//         busNumber,
//         busType,
//         acType,
//         wifi,
//         toiletType,
//         tvType,
//         insuranceName,
//         travelInsurance,
//         insuranceIssueDate,
//         insuranceExpiryDate,
//         roadTaxIssueDate,
//         roadTaxExpiryDate,
//       },
//       { new: true }
//     );

//     if (!updatedBus) {
//       return res.status(404).json({ error: "Bus not found" });
//     }

//     // Save the new bus to the database
//     // const savedBus = await newBus.save();

//     const responseData = {
//       busId: savedBus._id,
//       name: savedBus.name,
//       slug: savedBus.slug,
//     };

//     res.status(201).json(responseData);
//   } catch (error) {
//     console.error("Error creating bus:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
exports.BusInformation = async (req, res) => {
  try {
    const {
      name,
      busNumber,
      busType,
      amenities,
      insuranceName,
      travelInsurance,
      insuranceIssueDate,
      insuranceExpiryDate,
      roadTaxIssueDate,
      roadTaxExpiryDate,
    } = req.body;
    const busid = req.params.id;

    // Validate the request body (you can add more validation if needed)
    if (
      !name ||
      !busNumber ||
      !busType ||
      !amenities ||
      !insuranceName ||
      !travelInsurance ||
      !insuranceIssueDate ||
      !insuranceExpiryDate ||
      !roadTaxIssueDate ||
      !roadTaxExpiryDate
    ) {
      return res.status(400).json({ error: "Required fields are missing" });
    }

    const updatedBus = await Bus.findByIdAndUpdate(
      busid,
      {
        name,
        busNumber,
        busType,
        amenities,
        insuranceName,
        travelInsurance,
        insuranceIssueDate,
        insuranceExpiryDate,
        roadTaxIssueDate,
        roadTaxExpiryDate,
      },
      { new: true }
    );

    if (!updatedBus) {
      return res.status(404).json({ error: "Bus not found" });
    }

    const responseData = {
      busId: updatedBus._id,
      name: updatedBus.name,
      slug: updatedBus.slug,
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error updating bus:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.OwnerBusList = async (req, res) => {
  try {
    // Get the owner ID from the authenticated user
    const ownerId = req.ownerauth._id;

    // console.log(req.ownerauth._id);

    // Find all buses belonging to the owner ID
    const buses = await Bus.find({ owner: ownerId });
    // const buses = await Bus.find({
    //   owner: ownerId,
    //   "images.0": { $exists: true, $ne: [] },
    // });
    console.log(buses);
    const busesWithImages = buses.filter(
      (bus) => bus.images && bus.images.length > 0
    );
    if (!busesWithImages || busesWithImages.length === 0) {
      return res
        .status(404)
        .json({ error: "No buses found for this owner with images" });
    }

    // // If no buses are found, return a 404 status with an error message
    // if (!buses || buses.length === 0) {
    //   return res.status(404).json({ error: "No buses found for this owner" });
    // }
    // const simplifiedBuses = buses.map((bus) => ({
    //   _id: bus._id,
    //   name: bus.name,
    //   busNumber: bus.busNumber,
    //   images: bus.images.map((image) => image.url),
    // }));
    // If buses are found, return them in the response

    const simplifiedBuses = busesWithImages.map((bus) => ({
      _id: bus._id,
      name: bus.name,
      busNumber: bus.busNumber,
      images: bus.images.map((image) => image.url),
    }));

    res.status(200).json(simplifiedBuses);
  } catch (error) {
    console.error("Error fetching owner's buses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.GetAllCity = async (req, res) => {
  try {
    res.json(districtsData);
  } catch (error) {
    console.error("Error fetching list of city:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// exports.AddRoutes = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { startLocationId, endLocationId } = req.body;

//     // Validate the request body (you can add more validation if needed)
//     if (!id || !startLocationId || !endLocationId) {
//       return res.status(400).json({ error: "Required fields are missing" });
//     }

//     // Find the existing Bus document by ID
//     const existingBus = await Bus.findById(id);
//     if (!existingBus) {
//       return res.status(404).json({
//         error: "Bus not found!",
//       });
//     }

//     // Update the existing Bus document with the new start and end locations
//     existingBus.startLocation = startLocationId;
//     existingBus.endLocation = endLocationId;

//     // Save the updated bus to the database
//     const savedBus = await existingBus.save();

//     res.status(201).json({
//       busId: savedBus._id,
//       message: "Bus with start and end locations updated successfully",
//     });
//   } catch (error) {
//     console.error("Error updating start and end locations of bus:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

exports.AddRoutes = async (req, res) => {
  try {
    const { id } = req.params;
    const { startLocation, endLocation } = req.body;

    // Validate the request body and ensure start and end locations are provided
    if (!id || !startLocation || !endLocation) {
      return res.status(400).json({ error: "Required fields are missing" });
    }

    // Find the existing Bus document by ID
    const existingBus = await Bus.findById(id);
    if (!existingBus) {
      return res.status(404).json({
        error: "Bus not found!",
      });
    }

    // Update the existing Bus document with the new start and end locations
    existingBus.startLocation = startLocation;
    existingBus.endLocation = endLocation;

    // Save the updated bus to the database
    const savedBus = await existingBus.save();

    res.status(201).json({
      busId: savedBus._id,
      message: "Bus with start and end locations updated successfully",
    });
  } catch (error) {
    console.error("Error updating start and end locations of bus:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.addBoardingPoint = async (req, res) => {
  const { id } = req.params;

  // console.log(id);

  const { boardingPoints } = req.body;

  try {
    const bus = await Bus.findById(id);

    if (!bus) {
      return res.status(404).json({ error: "Bus not found" });
    }

    // Check if boardingPoints is an array or a single string
    if (Array.isArray(boardingPoints)) {
      // Concatenate array of boardingPoints
      bus.boardingPoints = bus.boardingPoints.concat(boardingPoints);
    } else if (typeof boardingPoints === "string") {
      // Add single boardingPoint
      bus.boardingPoints.push(boardingPoints);
    } else {
      // Invalid format
      return res.status(400).json({ error: "Invalid boardingPoints format" });
    }

    await bus.save();

    res
      .status(201)
      .json({ message: "Boarding point(s) added successfully", bus });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.addDroppingPoint = async (req, res) => {
  const { id } = req.params;

  const { droppingPoints } = req.body;

  try {
    const bus = await Bus.findById(id);

    if (!bus) {
      return res.status(404).json({ error: "Bus not found" });
    }

    // Check if droppingPoints is an array or a single string
    if (Array.isArray(droppingPoints)) {
      // Concatenate array of droppingPoints
      bus.droppingPoints = bus.droppingPoints.concat(droppingPoints);
    } else if (typeof droppingPoints === "string") {
      // Add single droppingPoint
      bus.droppingPoints.push(droppingPoints);
    } else {
      // Invalid format
      return res.status(400).json({ error: "Invalid droppingPoints format" });
    }

    await bus.save();

    res
      .status(201)
      .json({ message: "Dropping point(s) added successfully", bus });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// final create function after breakdown
exports.create = async (req, res) => {
  try {
    // Validate the request body
    const { error } = busSubmitValidation.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const busExists = await Bus.findOne({ busNumber: req.body.busNumber });
    if (busExists) {
      return res.status(403).json({
        error: "Bus is already added!",
      });
    }
    console.log("Before Processing Boarding Points");

    if (
      req.body.boardingPoints &&
      typeof req.body.boardingPoints === "string"
    ) {
      req.body.boardingPoints = req.body.boardingPoints.split(",");
      // console.log("Processed Boarding Points:", req.body.boardingPoints);
    }

    if (
      req.body.droppingPoints &&
      typeof req.body.droppingPoints === "string"
    ) {
      req.body.droppingPoints = req.body.droppingPoints.split(",");
      // console.log("Processed Dropping Points:", req.body.droppingPoints);
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

exports.getbusdroppingAndboarding = async (req, res) => {
  try {
    const busId = req.params.id;

    // Find the bus by its ID and select only the boardingPoints and droppingPoints fields
    const bus = await Bus.findById(busId).select(
      "boardingPoints droppingPoints"
    );

    if (!bus) {
      return res.status(404).json({ error: "Bus not found" });
    }

    // Respond with the boarding points and dropping points
    const boardingPoints = bus.boardingPoints;
    const droppingPoints = bus.droppingPoints;

    res.status(200).json({ boardingPoints, droppingPoints });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getbusBoardingPoints = async (req, res) => {
  try {
    const busId = req.params.id;

    // Find the bus by its ID and select only the boardingPoints and droppingPoints fields
    const bus = await Bus.findById(busId).select("boardingPoints");

    if (!bus) {
      return res.status(404).json({ error: "Bus not found" });
    }

    // Respond with the boarding points and dropping points
    const boardingPoints = bus.boardingPoints;

    res.status(200).json({ boardingPoints });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getbusdroppingpoints = async (req, res) => {
  try {
    const busId = req.params.id;

    // Find the bus by its ID and select only the boardingPoints and droppingPoints fields
    const bus = await Bus.findById(busId).select("droppingPoints");

    if (!bus) {
      return res.status(404).json({ error: "Bus not found" });
    }

    const droppingPoints = bus.droppingPoints;

    res.status(200).json({ droppingPoints });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateDroppingPoints = async (req, res) => {
  const { id } = req.params;
  const { droppingPoints } = req.body;

  try {
    const bus = await Bus.findById(id);

    if (!bus) {
      return res.status(404).json({ error: "Bus not found" });
    }

    // Check if droppingPoints is an array or a single string
    if (Array.isArray(droppingPoints)) {
      bus.droppingPoints = droppingPoints;
    } else if (typeof droppingPoints === "string") {
      bus.droppingPoints = [droppingPoints];
    } else {
      // Invalid format
      return res.status(400).json({ error: "Invalid droppingPoints format" });
    }

    await bus.save();

    res
      .status(200)
      .json({ message: "Dropping points updated successfully", bus });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateBoardingPoints = async (req, res) => {
  const { id } = req.params;
  const { boardingPoints } = req.body;

  try {
    const bus = await Bus.findById(id);

    if (!bus) {
      return res.status(404).json({ error: "Bus not found" });
    }

    // Check if boardingPoints is an array or a single string
    if (Array.isArray(boardingPoints)) {
      bus.boardingPoints = boardingPoints;
    } else if (typeof boardingPoints === "string") {
      bus.boardingPoints = [boardingPoints];
    } else {
      // Invalid format
      return res.status(400).json({ error: "Invalid boardingPoints format" });
    }

    await bus.save();

    res
      .status(200)
      .json({ message: "Boarding points updated successfully", bus });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ****************************************** for a single upload ********************************************************

// exports.uploadBusImageController = async (req, res) => {
//   try {
//     const ownerId = req.ownerauth._id;
//     const imageType = "busimage";

//     // Check if the owner exists
//     const owner = await Owner.findById(ownerId);
//     if (!owner) {
//       return res.status(404).send("Owner not found");
//     }

//     const imageUrl = req.file
//       ? await uploadToCloudflare(req.file.buffer)
//       : null;

//     // Find the existing Bus document by owner ID
//     const existingBus = await Bus.findOne({ owner: ownerId });

//     if (!existingBus) {
//       return res.status(404).send("Bus not found for the owner");
//     }

//     // Update the existing Bus document with the new image
//     existingBus.images.push({ type: imageType, url: imageUrl });
//     await existingBus.save();

//     res.json({
//       busId: existingBus._id, // Include bus ID in the response
//       url: imageUrl,
//       message: `Bus image URL saved to Bus schema successfully`,
//     });
//   } catch (error) {
//     console.error("Error handling image upload:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// ****************************************** for a multiple upload *************************************************************************

// exports.uploadBusImageController = async (req, res) => {
//   try {
//     const ownerId = req.ownerauth._id;
//     const imageType = "busimage";

//     // Check if the owner exists
//     const owner = await Owner.findById(ownerId);
//     if (!owner) {
//       return res.status(404).send("Owner not found");
//     }

//     const uploadedImages = req.files; // Change req.file to req.files

//     if (!uploadedImages || uploadedImages.length === 0) {
//       return res.status(400).send("No bus images uploaded");
//     }

//     // Process each uploaded image
//     const imageUrls = await Promise.all(
//       uploadedImages.map(async (image) => {
//         return image ? await uploadToCloudflare(image.buffer) : null;
//       })
//     );

//     // Find the existing Bus document by owner ID
//     const existingBus = await Bus.findOne({ owner: ownerId });

//     if (!existingBus) {
//       return res.status(404).send("Bus not found for the owner");
//     }

//     // Update the existing Bus document with the new images
//     existingBus.images = existingBus.images.concat(
//       imageUrls.map((url) => ({ type: imageType, url }))
//     );

//     await existingBus.save();

//     res.json({
//       busId: existingBus._id, // Include bus ID in the response
//       urls: imageUrls,
//       message: `Bus images URL saved to Bus schema successfully`,
//     });
//   } catch (error) {
//     console.error("Error handling image upload:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

exports.uploadBusImageController = async (req, res) => {
  try {
    const busId = req.params.id;
    console.log(busId); // Assuming the busId is passed as a parameter in the URL
    const imageType = "busimage";

    // Check if the bus exists
    const existingBus = await Bus.findById(busId);

    if (!existingBus) {
      return res.status(404).send("Bus not found");
    }

    const uploadedImages = req.files;

    if (!uploadedImages || uploadedImages.length === 0) {
      return res.status(400).send("No bus images uploaded");
    }

    // Process each uploaded image
    const imageUrls = await Promise.all(
      uploadedImages.map(async (image) => {
        return image ? await uploadToCloudflare(image.buffer) : null;
      })
    );

    // Update the existing Bus document with the new images
    existingBus.images = existingBus.images.concat(
      imageUrls.map((url) => ({ type: imageType, url }))
    );

    await existingBus.save();

    res.json({
      busId: existingBus._id,
      urls: imageUrls,
      message: `Bus images URL saved to Bus schema successfully`,
    });
  } catch (error) {
    console.error("Error handling image upload:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.Generateuniqueid = async (req, res) => {
  try {
    // Generate a unique ID
    const uniqueId = uuidv4();
    const ownerId = req.ownerauth._id;
    const newBus = new Bus({
      _id: uniqueId,
      owner: ownerId,
      slug: uuidv4(),
      // Assign the generated ID to the bus document
      // Add other fields if needed
    });
    await newBus.save();
    res.status(200).json({ _id: uniqueId });
  } catch (error) {
    console.error("Error generating unique ID:", error);
    res.status(500).json({ error: "Error generating unique ID" });
  }
};

exports.uploadinsideBusImagecontroller = async (req, res) => {
  try {
    const ownerId = req.ownerauth._id;
    const imageType = "businside";

    // Check if the owner exists
    const owner = await Owner.findById(ownerId);
    if (!owner) {
      return res.status(404).send("Owner not found");
    }

    const imageUrl = req.file
      ? await uploadToCloudflare(req.file.buffer)
      : null;

    // Find the existing Bus document by owner ID
    const existingBus = await Bus.findOne({ owner: ownerId });

    if (!existingBus) {
      return res.status(404).send("Bus not found for the owner");
    }

    // Update the existing Bus document with the new image
    existingBus.images.push({ type: imageType, url: imageUrl });
    await existingBus.save();

    res.json({
      busId: existingBus._id, // Include bus ID in the response
      url: imageUrl,
      message: `Bus image URL saved to Bus schema successfully`,
    });
  } catch (error) {
    console.error("Error handling image upload:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.addSeatConfiguration = async (req, res) => {
  const busId = req.params.id;
  const { seatType, seatPosition, seatNumber, fare, actualPosition } = req.body;

  try {
    const bus = await Bus.findById(busId);

    if (!bus) {
      return res.status(404).json({ error: "Bus not found" });
    }

    // Check if the bus already has seatConfig array, if not create an empty array
    bus.seatConfig = bus.seatConfig || [];

    // Add new seat configuration to the existing seatConfig array
    const newSeatConfig = {
      seatType,
      seatPosition,
      seatNumber,
      fare,
      actualPosition,
    };
    bus.seatConfig.push(newSeatConfig);

    // Save the updated bus document
    await bus.save();

    res
      .status(201)
      .json({ message: "Seat configuration added successfully", bus });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteSeatConfiguration = async (req, res) => {
  const busId = req.params.id;
  const seatNumber = req.params.seatNumber;

  try {
    const bus = await Bus.findById(busId);

    if (!bus) {
      return res.status(404).json({ error: "Bus not found" });
    }

    // Find the seat configuration by seat number and remove it from the array
    const seatIndex = bus.seatConfig.findIndex(
      (seat) => seat.seatNumber === seatNumber
    );

    if (seatIndex === -1) {
      return res.status(404).json({ error: "Seat configuration not found" });
    }

    bus.seatConfig.splice(seatIndex, 1);

    // Save the updated bus document
    await bus.save();

    res
      .status(200)
      .json({ message: "Seat configuration deleted successfully", bus });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllSeatConfigurations = async (req, res) => {
  const busId = req.params.id;

  try {
    const bus = await Bus.findById(busId);

    if (!bus) {
      return res.status(404).json({ error: "Bus not found" });
    }

    // Return all seat configurations for the bus
    res.status(200).json({ seatConfigurations: bus.seatConfig });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// exports.addSeatConfiguration = async (req, res) => {
//   const busId = req.params.id;
//   const { seatType, seatPosition, seatNumber, fare, actualPosition } = req.body;

//   try {
//     const bus = await Bus.findById(busId);

//     if (!bus) {
//       return res.status(404).json({ error: "Bus not found" });
//     }

//     // Add seat configuration to the bus
//     bus.seatConfig = {
//       seatType,
//       seatPosition,
//       seatNumber,
//       fare,
//       actualPosition,
//     };

//     // Save the updated bus document
//     await bus.save();

//     res
//       .status(201)
//       .json({ message: "Seat configuration added successfully", bus });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// exports.addSeatConfiguration = async (req, res) => {
//   const busId = req.params.id;
//   const seatConfigurations = req.body.seatConfig; // Assuming the seat configurations are sent as an array

//   try {
//     const bus = await Bus.findById(busId);

//     if (!bus) {
//       return res.status(404).json({ error: "Bus not found" });
//     }

//     // Add seat configurations to the bus
//     bus.seatConfig = seatConfigurations;

//     // Save the updated bus document
//     await bus.save();

//     res
//       .status(201)
//       .json({ message: "Seat configurations added successfully", bus });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
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

exports.searchbusbyfare = async (req, res) => {
  try {
    const { minFare, maxFare } = req.query;

    // Validate input parameters
    if (!minFare || !maxFare) {
      return res
        .status(400)
        .json({ error: "Minimum and maximum fare are required" });
    }

    // Parse fare values to numbers
    const minFareValue = parseFloat(minFare);
    const maxFareValue = parseFloat(maxFare);

    // Query buses within the specified fare range
    const buses = await Bus.find({
      fare: { $gte: minFareValue, $lte: maxFareValue },
    }).exec();

    res.json({ buses });
  } catch (error) {
    console.error("Error searching buses by fare:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
