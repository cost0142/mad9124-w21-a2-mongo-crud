const { response } = require("express");
const express = require("express");
const Course = require("../models/Course");
// const Model = require("../models/Student");
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
    const course = await Course.findById(req.params.id);
    if (!course) {
      throw new Error("Resource not found");
    }
    res.json({ data: formatResponseData("courses", course.toObject()) });
  } catch (error) {
    sendResourceNotFound(req, res);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { _id, ...attributes } = req.body.data.attributes;
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { _id: req.params.id, ...otherAttributes },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!course) {
      throw new Error("Resource not found");
    }
    res.json({ data: formatResponseData("courses", course.toObject()) });
  } catch (err) {
    sendResourceNotFound(req, res);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { _id, ...attributes } = req.body.data.attributes;
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { _id: req.params.id, ...otherAttributes },
      {
        new: true,
        overwrite: true,
        runValidators: true,
      }
    );
    if (!course) {
      throw new Error("Resource not found");
    }
    res.json({ data: formatResponseData("courses", course.toObject()) });
  } catch (err) {
    sendResourceNotFound(req, res);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const course = await Course.findByIdAndRemove(req.params.id);
    if (!course) throw new Error("Resource not found");
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
        description: `We could not find a course with id: ${req.params.id}`,
      },
    ],
  });
}

module.exports = router;
