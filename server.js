// Packages
const expressValidator = require("express-validator");
require("./stagingmode/stages");
const path = require("path");
const express = require("express");
require("express-async-errors");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8525;

const { runEveryMidnight, errorHandler } = require("./helpers");
const logger = require("./helpers/logger");
const runSeed = require("./seeds");
const { connectToDatabase } = require("./helpers/dbConnection");
const { setupGraphQLServer } = require("./GraphqlServer");

// Swagger UI implementation
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Hamro bus ticketing app API",
      version: "2.0.0",
      description: "This api is used for bus booking ticket system version 2.0",
      contact: {
        name: "Sagar Regmi",
        url: "https://github.com/sagarregmi2056",
        email: "sagarregmi2056@gmail.com",
      },
    },
  },
  apis: ["./routes/*.js", "./GraphqlServer.js"], // Add GraphQL server file to Swagger documentation
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Serve Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Database connection
connectToDatabase();

console.log("Seeding process started...");
// superadmin seeding
runSeed();

console.log("Seeding process completed.");

// Middlewares
logger(app);
app.use(cors());
app.use(express.json());
app.use(expressValidator());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to HAMRO BUS Home");
});

app.use("/api/auth-owner", require("./routes/auth-owner"));

app.use("/api/auth-user", require("./routes/auth-user"));
app.use("/api/bookings", require("./routes/booking"));
app.use("/api/bus", require("./routes/bus"));
app.use("/api/guests", require("./routes/guest"));
app.use("/api/locations", require("./routes/location"));
app.use("/api/owners", require("./routes/owner"));

app.use("/api/users", require("./routes/user"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/otpauth", require("./routes/otpauth"));
app.use("/api/payment", require("./routes/esewa"));
app.use("/api/coupon", require("./routes/couponDiscount"));
app.use("/api/department", require("./routes/department"));
app.use("/api/auth-department", require("./routes/auth-department"));
app.use("/api/query", require("./routes/Query"));

// using graphql server too

async function startServer() {
  await setupGraphQLServer(app);
  app.listen(port, () => {
    console.log(
      `Server is running on port ${port} at ${process.env.NODE_ENV} mode`
    );
    console.log("GraphQL server is ready at /graphql");
  });
}

app.use(function (err, req, res, next) {
  return res.status(500).json({
    error: errorHandler(err) || "Something went wrong! ****SERVER_ERROR****",
  });
});

// Run every-midnight to check if bus deporting date is passed
runEveryMidnight();

// to start the above function
startServer();
