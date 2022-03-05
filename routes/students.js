const { response } = require("express");
const express = require("express");
const Student = require("../models/Student");
// const Model = require("../models/Student");
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
    const student = await Student.findById(req.params.id);
    if (!student) {
      throw new Error("Resource not found");
    }
    res.json({ data: formatResponseData("students", student.toObject()) });
  } catch (error) {
    sendResourceNotFound(req, res);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { _id, ...attributes } = req.body.data.attributes;
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { _id: req.params.id, ...otherAttributes },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!student) {
      throw new Error("Resource not found");
    }
    res.json({ data: formatResponseData("students", student.toObject()) });
  } catch (err) {
    sendResourceNotFound(req, res);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { _id, ...attributes } = req.body.data.attributes;
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { _id: req.params.id, ...otherAttributes },
      {
        new: true,
        overwrite: true,
        runValidators: true,
      }
    );
    if (!car) {
      throw new Error("Resource not found");
    }
    res.json({ data: formatResponseData("cars", car.toObject()) });
  } catch (err) {
    sendResourceNotFound(req, res);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndRemove(req.params.id);
    if (!student) throw new Error("Resource not found");
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
        description: `We could not find a student with id: ${req.params.id}`,
      },
    ],
  });
}

module.exports = router;
