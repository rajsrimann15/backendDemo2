const express = require("express");
const connectDb = require("./config/connectionDb");
const app = express();
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT;
const bodyParser = require('body-parser');
const errorHandler=require("./middlewares/errorHandler");


app.use(bodyParser.json());
app.use(cors());
connectDb();


app.use(express.json());
app.use(errorHandler);
app.use("/users", require("./routes/userRoutes"));
app.use("/complaints", require("./routes/complaintRoutes"));

//hi
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });  