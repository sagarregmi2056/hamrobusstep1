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



module.exports = async () => {
    const self = module.exports;
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
        });
        console.log("DB Connected");
    } catch (err) {
        console.error("Failed to connect to mongo on startup - retrying in 5 sec", err);
        await new Promise(resolve => setTimeout(resolve, 5000));
        await self();
    }

};

// This retry mechanism allows the application to periodically attempt to reconnect to the database if the initial connection fails, which might be useful in scenarios where the database server is not immediately available or when the connection gets interrupted for some reason.