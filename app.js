const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const Faculty = require("./src/model/faculty");
const Student = require("./src/model/student");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// const FacultycDir = path.join(
//   "D:",
//   "CODE",
//   "nodejs",
//   "ERP-demo",
//   "erppanimalar",
//   "ltrfaculty"
// );
// const HODDir = path.join(
//   "D:",
//   "CODE",
//   "nodejs",
//   "ERP-demo",
//   "erppanimalar",
//   "ltrhod"
// );
// const stdDir = path.join(
//   "D:",
//   "CODE",
//   "nodejs",
//   "ERP-demo",
//   "erppanimalar",
//   "ltrhod"
// );

const baseDir = path.join(__dirname, "erppanimalar");

// Append specific subdirectories to the base directory
const FacultycDir = path.join(baseDir, "ltrfaculty");
const HODDir = path.join(baseDir, "ltrhod");
const stdDir = path.join(baseDir, "ltrstudent");

app.use(express.static(FacultycDir));
app.use(express.static(HODDir));
app.use(express.static(stdDir));
// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://dineshkumarminfomatronics:gtn2CDlJ3RJPrSlR@cluster0.ioneyxl.mongodb.net/erpsss"
  )
  .then(() => {
    console.log("db connected...");
  })
  .catch((err) => console.log(err));
const sampleData = [
  {
    id: 1,
    name: "Dr. S. RAJAKUMAR",
    qualifications: "M.E., Ph.D.",
    designation: "Professor & HOD",
    email: "ecehod@panimalar.ac.in",
    contactNumber: "1234567890",
    scopusLink: "https://www.scopus.com/authid/detail.uri?authorId=57195713766",
  },
  {
    id: 2,
    name: "Dr. A. JAMES",
    qualifications: "M.Sc., Ph.D.",
    designation: "Associate Professor",
    email: "ajames@panimalar.ac.in",
    contactNumber: "0987654321",
    scopusLink: "https://www.scopus.com/authid/detail.uri?authorId=12345678901",
  },
];

// Function to insert sample data
// const insertSampleData = async () => {
//   try {
//     await Faculty.deleteMany();
//     await Faculty.insertMany(sampleData);
//     console.log("Sample data inserted");
//   } catch (error) {
//     console.error("Error inserting sample data:", error);
//   }
// };


app.get("/f", (req, res) => {
  res.sendFile(path.join(FacultycDir, "all-teacher.html"));
});

app.get("/h", (req, res) => {
  res.sendFile(path.join(HODDir, "all-teacher.html"));
});

app.get("/s", (req, res) => {
  res.sendFile(path.join(stdDir, "all-teacher.html"));
});

app.get("/api/post", (req, res) => {
  res.sendFile(path.join(HODDir, "add-teacher.html"));
});
// Create a new faculty member
app.post("/api/post/faculty", async (req, res) => {
  try {
    const faculty = new Faculty(req.body);
    await faculty.save();
    // res.status(201).redirect("/");
    res.status(201).json({ message: "created faculty member " + faculty });
  } catch (error) {
    res.status(400).send(error);
  }
});

// insertSampleData();

// Read all faculty members
app.get("/api/faculty", async (req, res) => {
  try {
    const facultyMembers = await Faculty.find();
    res.status(200).send(facultyMembers);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Read a specific faculty member by ID
app.get("/api/faculty/:id", async (req, res) => {
  try {
    const faculty = await Faculty.findOne({ id: req.params.id });
    if (!faculty) {
      return res.status(404).send("Faculty member not found");
    }
    res.status(200).send(faculty);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a faculty member by ID
app.put("/api/faculty/:id", async (req, res) => {
  try {
    const faculty = await Faculty.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!faculty) {
      return res.status(404).send("Faculty member not found");
    }
    res.status(200).send(faculty);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a faculty member by ID
app.delete("/api/faculty/:id", async (req, res) => {
  try {
    const result = await Faculty.findOneAndDelete({ id: req.params.id });
    if (!result) {
      return res.status(404).send("Faculty member not found");
    }
    res.status(200).send("Faculty member deleted");
  } catch (error) {
    res.status(500).send(error);
  }
});

/**
 * for students API routes
 */
const sampleStudents = [
  {
    rollNumber: 2021,
    studentName: "Khalid M",
    gender: "Male",
    year: 2,
    section: "A",
    parentName: "Malik Basha",
    address: "Chidhambaram, Cuddalore",
    dateOfBirth: "2004-07-25T00:00:00.000Z",
    contactNumber: "+91 3322989555",
    parentContactNumber: "+91 9952328209",
    studentEmail: "khalid123@gmail.com",
    studentDocs: [
      "https://example.com/docs/khalid_id_card.pdf",
      "https://example.com/docs/khalid_admission_form.pdf",
    ],
  },
  {
    rollNumber: 2022,
    studentName: "Ayesha S",
    gender: "Female",
    year: 1,
    section: "B",
    parentName: "Sofia S",
    address: "Tindivanam, Villupuram",
    dateOfBirth: "2005-08-10T00:00:00.000Z",
    contactNumber: "+91 9876543210",
    parentContactNumber: "+91 8765432109",
    studentEmail: "ayesha.s@gmail.com",
    studentDocs: [
      "https://example.com/docs/ayesha_id_card.pdf",
      "https://example.com/docs/ayesha_admission_form.pdf",
    ],
  },
  {
    rollNumber: 2023,
    studentName: "Ravi K",
    gender: "Male",
    year: 3,
    section: "C",
    parentName: "Ramesh K",
    address: "Nellikuppam, Cuddalore",
    dateOfBirth: "2003-12-15T00:00:00.000Z",
    contactNumber: "+91 3344556677",
    parentContactNumber: "+91 9988776655",
    studentEmail: "ravi.k@gmail.com",
    studentDocs: [
      "https://example.com/docs/ravi_id_card.pdf",
      "https://example.com/docs/ravi_admission_form.pdf",
    ],
  },
];

// Function to insert sample data
const insertSampleData = async () => {
  try {
    await Student.insertMany(sampleStudents); // Insert sample data
    console.log("Student Sample data inserted");
  } catch (error) {
    console.error("Error inserting sample data:", error);
  }
};

// Insert sample data when server starts
// insertSampleData();

app.get("/f/students", (req, res) => {
  res.sendFile(path.join(FacultycDir, "all-student.html"));
});
app.get("/h/students", (req, res) => {
  res.sendFile(path.join(HODDir, "all-student.html"));
});
app.get("/s/students", (req, res) => {
  res.sendFile(path.join(stdDir, "all-student.html"));
});

// CRUD routes for students
app.post("/api/students", async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).send(student);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).send(students);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findOne({ rollNumber: req.params.id });
    if (!student) {
      return res.status(404).send("Student not found");
    }
    res.status(200).send(student);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { rollNumber: req.params.id },
      req.body,
      { new: true }
    );
    if (!student) {
      return res.status(404).send("Student not found");
    }
    res.status(200).send(student);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.delete("/api/students/:id", async (req, res) => {
  try {
    const result = await Student.findOneAndDelete({
      rollNumber: req.params.id,
    });
    if (!result) {
      return res.status(404).send("Student not found");
    }
    res.status(200).send("Student deleted");
  } catch (error) {
    res.status(500).send(error);
  }
});
// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
