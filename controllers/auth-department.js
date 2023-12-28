const Department = require("../models/Departments");

const jwt = require("jsonwebtoken");

exports.departmentSignin = async (req, res) => {
  const { departmentId, password } = req.body;
  const department = await Department.findOne({ departmentId });

  if (!department) {
    return res.status(401).json({
      error: "Department with that ID does not exist.",
    });
  }

  if (!department.authenticate(password)) {
    return res.status(401).json({
      error: "ID and password do not match",
    });
  }

  const payload = {
    _id: department.id,
    name: department.name,
    departmentId: department.departmentId,
    role: department.role,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET);

  // Send both ID and token in the response
  return res.json({ _id: department.id, token });
};
