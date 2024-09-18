const express = require("express");
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middleware/errorHandler");
require('./controllers/authController');

connectDb();
const app = express();

const port = 5001;

app.use(express.json());
app.use("/orders/packingAndMoving", require("./routes/PackingAndMovingRoutes"));
app.use("/orders/longDistanceMoving", require("./routes/LongDistanceMovingRoutes"));
app.use("/orders/localDistanceMoving", require("./routes/LocalDistanceMovingRoutes"));
app.use("/admin", require("./routes/adminRoutes"));
app.use(errorHandler);
app.use('/', require("./routes/authRoutes"));


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  
  function sendRequestEvery8Minutes(url) {
    // Helper function to send the request
    async function sendRequest() {
      try {
        const response = await fetch(url);
      } catch (error) {
        console.error('Request failed:', error);
      }
    }
  
    // Initial request
    sendRequest();
  
    // Create an interval to send requests every 8 minutes
    setInterval(sendRequest, 5 * 60 * 1000); // Convert 8 minutes to milliseconds
  }
  
  // Example usage:
  const myUrl = 'https://shiftstream.onrender.com/admin/orders';
  sendRequestEvery8Minutes(myUrl);
  
});
