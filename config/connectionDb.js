const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(`mongodb+srv://rajsrimann:admin@contact.lyuvpsp.mongodb.net/?retryWrites=true&w=majority&appName=contact`);
    console.log(
      "Database connected: ",
      connect.connection.host,
      connect.connection.name
    );
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDb;
