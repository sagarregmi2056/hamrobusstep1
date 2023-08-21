// Packages
const expressValidator = require("express-validator");





const bodyParser = require('body-parser');


const express = require("express");
require("express-async-errors");
const cors = require("cors");
require("dotenv").config();
const app = express();


// importing swaggerui 

// const swaggerUi = require("swagger-ui-express");
// const swaggerJsDoc = require("swagger-jsdoc");


// gql 







// Import methods
// db connection is useless here due seeding process causes a error 
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






// Routes
app.get("/", (req, res) => {
  // res.redirect("/api/users");
  res.send("welcome to HAMRO BUS signup dashbord of user");
  
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






// graphql with mongodb 

const { ApolloServer } = require("@apollo/server");
const{ExpressMiddleware, expressMiddleware}= require('@apollo/server/express4')
const {default:axios}= require('axios')


async function startServer(){

  const app = express();
  const server = new ApolloServer({
  //    same like data type here like schema of mongoose jastai as well as ! is like a required true in mongoose 
  typeDefs:`

  type User{
      id:ID!
      name:String!
      username:String!
      email:String!
      phone:String!
      website:String!
  }
  type TODO{

      
      id:ID!
      title:String!
      completed:Boolean

  }

  type Query{
      getTodos:[TODO]
      getAllUsers:[User]
      getUser(id:ID!):User
  }

  `,

  resolvers:{
      Query:{
          getTodos: async()=>
          
         ( await axios.get('https://jsonplaceholder.typicode.com/todos')).data,

         getAllUsers:async()=>
          
         ( await axios.get('https://jsonplaceholder.typicode.com/users')).data,

      //    fetching single user according to the id 

         getUser:async(parent,{id})=>
          
         ( await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)).data,
      },
  },
});   
app.use(bodyParser.json()); //  starting server
await server.start()




app.use("/graphql",expressMiddleware(server));
// app.listen(8525,()=>console.log("server started at PORT 8000"));
const port = process.env.PORT || 8525;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);

  
});

}
startServer();