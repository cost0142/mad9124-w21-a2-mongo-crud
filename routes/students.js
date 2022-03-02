const express = require("express");
const { format } = require("express");
const Student = require("../models/Student");
const router = express.Router();

router.get("/", async (req, res) => {
  const students = await Student.find();

  res.json({
    data: students.map((Student) =>
      formatResponseData("students", Student.toObject())
    ),
  });
});

router.post("/", async (req, res) => {
  let attributes = req.body.data.attributes;
  delete attributes._id;
  let newStudent = new Student(attributes);
  await newStudent.save();

  res
    .status(201)
    .json({ data: formatResponseData("students", newStudent.toObject()) });
});

module.exports = router;
