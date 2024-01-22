// need to export owner model here

const Owner = require("../models/Owner");

require("dotenv").config();
exports.seedSuperAdmin = async () => {
  // yadi milxa vanya super admin ko id pw role
  const email = process.env.SEMAIL;
  const password = process.env.SPASSWORD;
  const role = "superadmin";

  const ownerExists = await Owner.findOne({ email });
  if (ownerExists) {
    console.warn("Superadmin already exists in the database.");
    return;
  }
  // yadi tyo xaina vanya new super admin khoja
  const newowner = new Owner({
    email,
    password,
    role,
    name: "SAdmin",
    citizenshipNumber: "980-422-8593",
    phone: 9779804228593,
    status: "approved",
    vendorDetail: "success",
    isVerified: true,
  });

  await newowner.save();
  console.warn("Superadmin seeded successfully...");
};
