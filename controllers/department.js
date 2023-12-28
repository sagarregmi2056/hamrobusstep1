const Department = require("../models/Departments");

exports.addDepartmentaccount = async (req, res) => {
  try {
    const { name, description, departmentId, password, role } = req.body;

    const allowedRoles = [
      "maintenancedepartment",
      "Trainingdepartment",
      "supportdepartment",
      "accountdepartment",
    ];
    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid department role" });
    }

    const newDepartment = new Department({
      name,
      description,
      departmentId,
      password,
      role: role || "Trainingdepartment",
    });

    // Save the department to the database
    const savedDepartment = await newDepartment.save();

    console.log("Department added successfully:", savedDepartment);
    res.status(201).json(savedDepartment);
  } catch (error) {
    console.error("Error adding department:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
