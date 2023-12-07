const express = require("express");
const multer = require("multer");

const Owner = require("../models/Owner");

const axios = require("axios").default;
const path = require("path");

const app = express();
const FormData = require("form-data");

const {
  stepfour,
  signin,
  refreshToken,
  stepone,
  steptwo,
  stepthree,
  getOwnerDetails,
} = require("../controllers/auth-owner");

// updated code
// const { uploadOwnerAvatar, uploadnationalID, uploadCitizenshipimage, uploaddriverlisence, uploadpancard } = require('../helpers/multer');

const { verifyToken } = require("../controllers/otpauth");
const { uploaddriverlisence } = require("../helpers");

const router = express.Router();

router.post("/addPersonalDetail/:ownerId", verifyToken, stepone);

router.put("/addBankDetail/:ownerId", steptwo);

router.put("/addPanDetail/:ownerId", stepthree);

router.get("/getCurrentSection/:ownerId", verifyToken, getOwnerDetails);
// router.post("/adddocuments/:ownerId/pancard", stepfour);
const fs = require("fs");
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
    console.log("Cloudflare API Response:", response.data);

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
router.post(
  "/adddocuments/:ownerId/driverlicense",
  uploaddriverlisence,
  async (req, res) => {
    try {
      const ownerId = req.params.ownerId;
      console.log(ownerId);
      const imageType = "driverlicense"; // Assuming this is the type for driver's license

      // Check if the owner exists
      const owner = await Owner.findOne({ _id: ownerId });
      if (!owner) {
        return res.status(404).send("Owner not found");
      }

      const imageUrl = req.file
        ? await uploadToCloudflare(req.file.buffer)
        : null;

      // Save the image URL to the Owner schema based on image type
      await Owner.findByIdAndUpdate(ownerId, {
        $push: { images: { type: imageType, url: imageUrl } },
      });

      res.json({
        url: imageUrl,
        message: `Driver's license image URL saved to Owner schema successfully`,
      });
    } catch (error) {
      console.error("Error handling image upload:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.post("/signin", signin);
router.post("/refreshtoken", refreshToken);

module.exports = router;
