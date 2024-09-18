const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(`mongodb+srv://Ronaldo029:Ronaldo%40MongoDB@shiftstreamdatabase.hgxipri.mongodb.net/?retryWrites=true&w=majority&appName=ShiftStreamDatabase`);
    console.log(
      "Database connected: ",
      connect.connection.host,
      connect.connection.name
    );
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDb;
