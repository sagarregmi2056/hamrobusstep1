// Packages
const expressValidator = require("express-validator");
const context = require("./context");
require("./stagingmode/stages");
const path = require("path");

const express = require("express");
require("express-async-errors");
const cors = require("cors");
require("dotenv").config();

const app = express();

const { readFileSync } = require("fs");
const { makeExecutableSchema } = require("@graphql-tools/schema");

const { gql } = require("graphql-tag");

// swagger ui implementation

const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Hamro bus ticketing app API",
      version: "2.0.0",
      description: "This api is used for bus booking ticket system ",
    },
  },
  apis: ["./routes/*.js"], // Replace with the actual path to your API route files
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const { runEveryMidnight, dbConnection, errorHandler } = require("./helpers");
const logger = require("./helpers/logger");
const runSeed = require("./seeds");
const mongoose = require("mongoose");
// database connection

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database is connected successfully");
  })
  .catch((err) => {
    console.log(`Error on database  ,${err}  `);
  });
runSeed();

const { ApolloServer } = require("apollo-server-express");
const graphqlPlayground =
  require("graphql-playground-middleware-express").default;

async function startServer() {
  const typeDefs = gql(readFileSync("./grqphqlschema/typeDefs.gql", "utf-8"));
  const resolvers = require("./grqphqlschema/resolvers");

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const server = new ApolloServer({
    schema,
    context,
    playground: true,
  });

  await server.start();
  server.applyMiddleware({ app });

  const port = process.env.PORT || 8525;

  app.listen(port, () => {
    console.log(
      `Server is running on port ${port} at ${process.env.NODE_ENV} mode`
    );
    console.log("GraphQL server is ready at /graphql");
  });
}

startServer();

// Middlewares
logger(app);
app.use(cors());
app.use(express.json());
app.use(expressValidator());
// app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.get("/graphql", graphqlPlayground({ endpoint: "/graphql" }));

// Routes
app.get("/", (req, res) => {
  // res.redirect("/api/users");
  res.send("welcome to HAMRO BUS Home ");
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

app.use("/api/admin", require("./routes/admin"));

app.use("/api/otpauth", require("./routes/otpauth"));
app.use("/api/payment", require("./routes/esewa"));

// Error handling middleware
app.use(function (err, req, res, next) {
  return res.status(500).json({
    error: errorHandler(err) || "Something went wrong! ****SERVER_ERROR****",
  });
});

// Run every-midnight to check if bus deporting date is passed
runEveryMidnight();
