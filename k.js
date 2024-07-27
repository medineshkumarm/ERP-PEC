const express = require("express");
const path = require("path");
const session = require("express-session");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

const flash = require("connect-flash");

const baseDir = path.join(__dirname, "public");
app.use(express.static(baseDir));
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


mongoose
  .connect(
    "mongodb+srv://dineshkumarminfomatronics:gtn2CDlJ3RJPrSlR@cluster0.ioneyxl.mongodb.net/erpsss"
  )
  .then(() => {
    console.log("db connected...");
  })
  .catch((err) => console.log(err));

  const Faculty = require("./src/model/faculty");
  const Student = require("./src/model/student");

// Mock user data for demonstration
const users = {
  admin: { username: "admin", password: "admin123", role: "admin" },
  hod: { username: "hod", password: "hod123", role: "hod" },
  faculty: { username: "faculty", password: "faculty123", role: "faculty" },
  student: { username: "student", password: "student123", role: "student" },
};

// Middleware to serve static files based on user role
const roleDirs = {
  admin: path.join(baseDir, "admin"),
  hod: path.join(baseDir, "hod"),
  faculty: path.join(baseDir, "faculty"),
  student: path.join(baseDir, "student"),
};
// Serve the login page
app.get("/login", (req, res) => {
  res.sendFile(path.join(baseDir, "views","login.html"));
});

// Handle login form submission
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = Object.values(users).find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.status(401).send("Unauthorized");
  }
});


app.use((req, res, next) => {
  const user = req.session.user;
  if (!user) return res.redirect("/login");

  const role = user.role;
  const folderPath = roleDirs[role];

  console.log(`Serving files from: ${folderPath}`);
  express.static(folderPath)(req, res, next);
});

// Route to serve the index file for each role
app.get("/", (req, res) => {
  const user = req.session.user;
  if (!user) return res.redirect("/login");

  const role = user.role;
  const indexPath = path.join(roleDirs[role], "index.html");

  res.sendFile(indexPath);
});

// Logout route
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

/**
 * serving all pages in each folder
 */

app.get("/:page", (req, res) => {
  const user = req.session.user;
  const role = user.role;

  
  if (user) {
    const page = req.params.page;
    const filePath = path.join(roleDirs[role], `${page}.html`);
    res.sendFile(filePath, (err) => {
      if (err) {
        res.status(404).send("Page not found");
      }
    });
  } else {
    res.redirect("/login");
  }
});

app.post("/api/post/faculty", async (req, res) => {
  try {
    const faculty = new Faculty(req.body);
    await faculty.save();
    req.flash('success', 'Faculty member created successfully');

    res.status(201).redirect("/all-teacher");
    // res.status(201).json({ message: "created faculty member " + faculty });
  } catch (error) {
    req.flash('error', 'An error occurred while creating the faculty member');
    res.status(400).send(error);
  }
});

app.get("/api/faculty", async (req, res) => {
  try {
    const AllFaculty = await Faculty.find();
    if (!AllFaculty) {
      return res.status(404).send("Faculty member not found");
    }
    res.status(200).send(AllFaculty);
  } catch (error) {
    res.status(500).send(error);
  }
});
// Read a specific faculty member by ID
// app.get("/api/faculty/:id", async (req, res) => {
//   try {
//     const faculty = await Faculty.findOne({ id: req.params.id });
//     if (!faculty) {
//       return res.status(404).send("Faculty member not found");
//     }
//     res.status(200).send(faculty);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// Update a faculty member by ID
// app.put("/api/faculty/:id", async (req, res) => {
//   try {
//     const faculty = await Faculty.findOneAndUpdate(
//       { id: req.params.id },
//       req.body,
//       { new: true }
//     );
//     if (!faculty) {
//       return res.status(404).send("Faculty member not found");
//     }
//     res.status(200).send(faculty);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Delete a faculty member by ID
// app.delete("/api/faculty/:id", async (req, res) => {
//   try {
//     const result = await Faculty.findOneAndDelete({ id: req.params.id });
//     if (!result) {
//       return res.status(404).send("Faculty member not found");
//     }
//     res.status(200).send("Faculty member deleted");
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });


/**
 * Student API
 */
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).send(students);
  } catch (error) {
    res.status(500).send(error);
  }
});


// Start the server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
