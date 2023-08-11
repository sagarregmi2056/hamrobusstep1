const mongoose = require("mongoose");



    // The function starts by creating a reference to module.exports and stores it in the variable self. This is done to enable a retry mechanism in case the database connection fails initially.
    
// module.exports = () => {
//     const self = module.exports;
//     return mongoose
//         .connect(process.env.MONGO_URI, {
//             useNewUrlParser: true,
//         })
//         .then(() => console.log("DB Connected"))
//         .catch(err => {
//             console.error(
//                 " hey admin Failed to connect to mongo on startup - retrying in 5 sec  ", err
//             );
//             setTimeout(self, 5000);
//         });
// };

const connectDB = async()=>{
    try{
        // passing url to the connection string 
      const conec = await mongoose.connect(process.env.MONGO_LOCAL_URL)
      console.log(`connected to the mongodb database ${mongoose.connection.host}`)
    }catch(error){
        console.log(`its a mongodb error ${error}`);

    }
}
module.exports= connectDB;


// This retry mechanism allows the application to periodically attempt to reconnect to the database if the initial connection fails, which might be useful in scenarios where the database server is not immediately available or when the connection gets interrupted for some reason.