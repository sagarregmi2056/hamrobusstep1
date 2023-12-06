const express = require("express");
const multer = require("multer");

const Owner = require("../models/Owner");

const axios = require("axios").default;
const path = require("path");

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
// router.post("/adddocuments/:ownerId/pancard", stepfour);
const fs = require("fs");
async function uploadToCloudflare(imageBuffer) {
  try {
    const apiKey = process.env.CLOUDFLARE_API_KEY;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;
    const filePath = "uploads/pancard/file.jpg";
    const directoryPath = path.dirname(filePath);

    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }

    // Write image buffer to file
    fs.writeFileSync(filePath, imageBuffer);

    const boundary = "---011000010111000001101001";
    const contentType = "image/jpeg"; // Adjust this based on your image type

    // Construct form data
    const formData = `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="file.jpg"\r\nContent-Type: ${contentType}\r\n\r\n${imageBuffer}\r\n--${boundary}--`;

    // Log formData for debugging
    console.log("formData:", formData);

    // Make the API request
    const response = await axios.post(
      "https://api.cloudflare.com/client/v4/accounts/f6cbe271191b3ad841b63ec6b129869d/images/v1",
      formData,
      {
        headers: {
          "Content-Type": `multipart/form-data; boundary=${boundary}`,
          Authorization: `Bearer ${apiToken}`,
        },
      }
    );

    return response.data.result.info.url;
  } catch (error) {
    console.error(
      "An error occurred:",
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
