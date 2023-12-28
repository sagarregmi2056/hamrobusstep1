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

exports.ensureAccountDepartment = async (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    try {
      const department = parseToken(token); // Assuming you have a function like parseToken to decode the JWT

      const foundDepartment = await Department.findById(department._id).select(
        "role"
      );

      if (foundDepartment && foundDepartment.role === "accountdepartment") {
        // Department has the required role, proceed to the next middleware or route
        next();
      } else {
        res
          .status(403)
          .json({ error: "Access forbidden. Not an accountdep department." });
      }
    } catch (error) {
      console.error("Error checking department role:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(401).json({ error: "Not authorized" });
  }
};

exports.ensureMaintenceDepartment = async (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    try {
      const department = parseToken(token); // Assuming you have a function like parseToken to decode the JWT

      const foundDepartment = await Department.findById(department._id).select(
        "role"
      );

      if (foundDepartment && foundDepartment.role === "maintenancedepartment") {
        // Department has the required role, proceed to the next middleware or route
        next();
      } else {
        res
          .status(403)
          .json({ error: "Access forbidden. Not an accountdep department." });
      }
    } catch (error) {
      console.error("Error checking department role:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(401).json({ error: "Not authorized" });
  }
};

exports.ensureTrainingdepartment = async (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    try {
      const department = parseToken(token); // Assuming you have a function like parseToken to decode the JWT

      const foundDepartment = await Department.findById(department._id).select(
        "role"
      );

      if (foundDepartment && foundDepartment.role === "trainingdepartment") {
        // Department has the required role, proceed to the next middleware or route
        next();
      } else {
        res
          .status(403)
          .json({ error: "Access forbidden. Not an accountdep department." });
      }
    } catch (error) {
      console.error("Error checking department role:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(401).json({ error: "Not authorized" });
  }
};

exports.ensuresupportdepartment = async (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    try {
      const department = parseToken(token);
      console.log(department); // Assuming you have a function like parseToken to decode the JWT

      const foundDepartment = await Department.findById(department._id).select(
        "role"
      );

      if (foundDepartment && foundDepartment.role === "trainingdepartment") {
        // Department has the required role, proceed to the next middleware or route
        next();
      } else {
        res
          .status(403)
          .json({ error: "Access forbidden. Not an accountdep department." });
      }
    } catch (error) {
      console.error("Error checking department role:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(401).json({ error: "Not authorized" });
  }
};

function parseToken(token) {
  try {
    return jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
  } catch (err) {
    return false;
  }
}
