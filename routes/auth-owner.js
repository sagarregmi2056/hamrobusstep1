const express = require("express");
const multer = require("multer");

const Owner = require("../models/Owner");

const axios = require("axios");

const app = express();

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
router.post("/adddocuments/:ownerId/pancard", stepfour);

async function uploadToCloudflare(imageData) {
  const apiKey = process.env.CLOUDFLAR_API_KEY; // Replace with your Cloudflare API key
  const apiToken = process.env.CLOUDFLAR_API_TOKEN; // Replace with your Cloudflare API token

  try {
    const response = await axios.post(
      "https://api.cloudflare.com/client/v4/accounts/f6cbe271191b3ad841b63ec6b129869d/images/v1",
      { data: imageData },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiToken}`,
          "X-Auth-Key": apiKey,
        },
      }
    );

    if (response.status === 200) {
      return response.data.url; // Assuming the Cloudflare API response contains the image URL
    } else {
      throw new Error("Failed to upload image to Cloudflare");
    }
  } catch (error) {
    throw new Error("Error uploading image to Cloudflare: " + error.message);
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
        message: `Driver's license image uploaded and saved to Owner schema successfully`,
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
