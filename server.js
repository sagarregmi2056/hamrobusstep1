// Packages
const expressValidator = require("express-validator");





const express = require("express");
require("express-async-errors");
const cors = require("cors");
require("dotenv").config();
const app = express();


// importing swaggerui 

const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");


// gql 





// app.use(
//   '/graphql',
//   graphqlHTTP({
//     schema: schema,
//     rootValue: root,
//     graphiql: true,
//   })
// );

// Import methods
const { runEveryMidnight, dbConnection, errorHandler } = require("./helpers");
const logger = require("./helpers/logger");
const runSeed = require("./seeds");
const mongoose = require("mongoose");
// database connection 

mongoose.connect(process.env.DATABASE,{
    
   
    useNewUrlParser: true, 
    useUnifiedTopology: true 
 
 }).then(()=>{
     console.log("DB CONNECTED VAYO HAI SOLTI")
 }).catch((err)=>{
     console.log(`data base ma error hanyo hai ,${err}  `)
 });
runSeed();

// Middlewares
logger(app);
app.use(cors());
app.use(express.json());
app.use(expressValidator());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));





// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "HAMRO  BUS API",
      version: "1.0.0",
      description: "BUS API information",
      contact: {
        name: " SAGAR REGMi",
      },
      servers: ["http://localhost:8525/api"],
    },
  },
  apis: ["./controllers/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.get("/", (req, res) => {
  res.redirect("/api/users");
});

app.use("/api/auth-owner", require("./routes/auth-owner"));
app.use("/api/auth-user", require("./routes/auth-user"));
app.use("/api/bookings", require("./routes/booking"));
app.use("/api/bus", require("./routes/bus"));
app.use("/api/guests", require("./routes/guest"));
app.use("/api/locations", require("./routes/location"));
app.use("/api/owners", require("./routes/owner"));
app.use("/api/travels", require("./routes/travel"));
app.use("/api/users", require("./routes/user"));

// Error handling middleware
app.use(function (err, req, res, next) {
  return res.status(500).json({
    error: errorHandler(err) || "Something went wrong! ****SERVER_ERROR****",
  });
});

// Run every-midnight to check if bus deporting date is passed
runEveryMidnight();

const port = process.env.PORT || 8525;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);

  
});