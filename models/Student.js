const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  firstName: { type: String, require: true, maxlength: 64 },
  lastName: { type: String, require: true, maxlength: 64 },
  nickName: { type: String, require: true, maxlength: 64 },
  eMail: { type: String, require: true, maxlength: 512 },
});
const Model = mongoose.model("Student", schema);
module.exports = Model;
