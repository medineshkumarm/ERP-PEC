const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const MONGODB_URI =
  "mongodb+srv://dineshkumarminfomatronics:gtn2CDlJ3RJPrSlR@cluster0.ioneyxl.mongodb.net/erp";
// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("db connected.."))
  .catch((err) => console.log(err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, "..", "public")));
// Static files directory
const staticDir = path.join('D:', 'CODE', 'nodejs', 'ERP-demo', 'erppanimalar', 'ltrfaculty');
app.use(express.static(staticDir));


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Listening to ${PORT}`);
});
