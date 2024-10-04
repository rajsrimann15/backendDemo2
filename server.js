const express = require("express");
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middleware/errorHandler");

connectDb();
const app = express();

const port = 5000;

app.use(express.json());
app.use("/chips", require("./routes/chipRoutes"));
app.use("/medDetails", require("./routes/medDetailsRoutes"));
app.use("/doctors", require("./routes/doctorRoutes"));
app.use("/users", require("./routes/userRoutes"));
// app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });