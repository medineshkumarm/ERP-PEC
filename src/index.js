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
app.use(express.static(path.join(__dirname, "..", "public")));

app.use(
  session({
    secret: "askdljasdjasd",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: MONGODB_URI }),
  })
);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Listening to ${PORT}`);
});
