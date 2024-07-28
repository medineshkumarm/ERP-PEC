const express = require("express");
const path = require("path");
const session = require("express-session");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

const flash = require("connect-flash");
const multer = require('multer');


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
  const Assignment = require("./src/model/assignment");
  const Notice = require("./src/model/notice");


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
    res.status(400).json(error);
    res.redirect("/add-teacher.html")
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

/**
 * Assignment CRUD API
 */
const upload = multer({
  dest: 'uploads/', // Destination folder for uploaded files
  limits: { fileSize: 10000000 }, // Max file size (e.g., 10MB)
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|pdf)$/)) {
      return cb(new Error('Please upload a JPG, JPEG, PNG, or PDF file'));
    }
    cb(null, true);
  }
});

// Create - POST request to add a new assignment
app.post('/api/assignments', upload.single('file'), async (req, res) => {
  try {
    const assignment = new Assignment({
      date: req.body.date,
      time: req.body.time,
      heading: req.body.heading,
      link: req.file ? req.file.path : null // Store the file path as link
    });

    await assignment.save();
    console.log(assignment);
    // res.status(201).send(assignment);
    res.status(201).redirect("/all-assignment");
  } catch (error) {
    res.status(400).redirect("/add-assignment");

  }
});

// Read - GET request to get all assignments
app.get('/api/assignments', async (req, res) => {
  try {
    const assignments = await Assignment.find();
    res.status(200).send(assignments);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Read - GET request to get a specific assignment by ID
app.get('/api/assignments/:id', async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).send();
    }
    res.status(200).send(assignment);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update - PATCH request to update a specific assignment by ID
app.patch('/api/assignments/:id', async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!assignment) {
      return res.status(404).send();
    }
    res.status(200).send(assignment);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete - DELETE request to delete a specific assignment by ID
app.delete('/api/assignments/:id', async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) {
      return res.status(404).send();
    }
    res.status(200).send(assignment);
  } catch (error) {
    res.status(500).send(error);
  }
});


/**
 * Notice board APIs
 */
app.post('/api/notices', async (req, res) => {
  const { sender, message, date, document } = req.body;

  try {
      const newNotice = new Notice({
          sender,
          message,
          date,
          document, // Expecting a URL
      });

      await newNotice.save();
      res.status(201).json({ message: 'Notice created successfully!', notice: newNotice });
  } catch (error) {
      res.status(500).json({ message: 'Error creating notice.', error });
  }
});

// Read all notices
app.get('/api/notices', async (req, res) => {
  try {
      const notices = await Notice.find();
      res.redirect("/notice-board");
      res.status(200).json(notices);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching notices.', error });
  }
});

// Read a specific notice by ID
app.get('/api/notices/:id', async (req, res) => {
  try {
      const notice = await Notice.findById(req.params.id);
      if (!notice) return res.status(404).json({ message: 'Notice not found.' });
      res.status(200).json(notice);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching notice.', error });
  }
});

// Update a specific notice by ID
app.put('/api/notices/:id', async (req, res) => {
  const { sender, message, date, document } = req.body;

  try {
      const updatedNotice = await Notice.findByIdAndUpdate(req.params.id, { sender, message, date, document }, { new: true });
      if (!updatedNotice) return res.status(404).json({ message: 'Notice not found.' });
      res.status(200).json({ message: 'Notice updated successfully!', notice: updatedNotice });
  } catch (error) {
      res.status(500).json({ message: 'Error updating notice.', error });
  }
});

// Delete a specific notice by ID
app.delete('/api/notices/:id', async (req, res) => {
  try {
      const deletedNotice = await Notice.findByIdAndDelete(req.params.id);
      if (!deletedNotice) return res.status(404).json({ message: 'Notice not found.' });
      res.status(200).json({ message: 'Notice deleted successfully!' });
  } catch (error) {
      res.status(500).json({ message: 'Error deleting notice.', error });
  }
});

/**
 * mail service
 */

const { sendEmail } = require('./src/service/mailService');

// Route to handle form submission
app.post('/api/send-email', async (req, res) => {
  const { subject, recipient, message } = req.body;

  try {
      await sendEmail(recipient, subject, message);
      // console.error('mail Sent successfully');
      // res.render('response', { message: 'Email sent successfully!', type: 'success' });
      res.status(200).redirect("/mail-success");
      // res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
      console.error('Error sending email:', error);
      // res.status(500).json({ message: 'An error occurred. Please try again.' });
      res.status(500).redirect("/mail-failure");

  }
});
// Start the server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
