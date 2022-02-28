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
