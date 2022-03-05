const express = require("express");
const { format } = require("express");
const Course = require("../models/Course");
const Model = require("../models/Student");
const router = express.Router();

router.get("/", async (req, res) => {
  const courses = await Course.find();

  res.json({
    data: courses.map((course) =>
      formatResponseData("courses", course.toObject())
    ),
  });
});

router.post("/", async (req, res) => {
  let attributes = req.body.data.attributes;
  delete attributes._id;
  let newCourse = new Course(attributes);
  await newCourse.save();

  res
    .status(201)
    .json({ data: formatResponseData("courses", newCourse.toObject()) });
});

router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("owner");
    if (!course) {
      throw new Error("Resource not found");
    }
    res.json({ data: formatResponseData("courses", course.toObject()) });
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
