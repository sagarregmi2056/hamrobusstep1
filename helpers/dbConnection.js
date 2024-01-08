const mongoose = require("mongoose");

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database is connected successfully");
  } catch (err) {
    console.log(`Error on database, ${err}`);
    // Optionally, you can rethrow the error to let the calling code handle it
    throw err;
  }
};

module.exports = { connectToDatabase };

// This retry mechanism allows the application to periodically attempt to reconnect to the database if the initial connection fails, which might be useful in scenarios where the database server is not immediately available or when the connection gets interrupted for some reason.
