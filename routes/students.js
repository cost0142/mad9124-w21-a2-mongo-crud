const express = require("express");
const { format } = require("express");
const Student = require("../models/Student");
const Model = require("../models/Student");
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

router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate("owner");
    if (!student) {
      throw new Error("Resource not found");
    }
    res.json({ data: formatResponseData("students", student.toObject()) });
  } catch (error) {
    sendResourceNotFound(req, res);
  }
});

function formatResponseData(type, resource) {
  const { id, ...attributes } = resource;
  return { type, id, attributes };
}

function sendResourceNotFound(req, res) {
  res.status(404).send({
    errors: [
      {
        status: "404",
        title: "Resource does not exist",
        description: `We could not find a car with id: ${req.params.id}`,
      },
    ],
  });
}

module.exports = router;
