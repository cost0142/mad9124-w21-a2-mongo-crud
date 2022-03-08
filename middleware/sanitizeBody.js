const xss = require("xss");

const sanitize = (srcString) => {
  return xss(srcString, {
    whiteList: [],
    stripIgnoreTag: true,
    stripIgnoreTagBody: ["script"],
  });
};

const stripTags = (payload) => {
  const attributes = Object.assign({}, payload);
  // {...payload}
  for (let key in attributes) {
    if (attributes[key] instanceof Array) {
      attributes[key] = attributes[key].map((element) => {
        if (typeof element === "string") {
          return sanitize(element);
        } else {
          return stripTags(element);
        }
      });
    } else if (attributes[key] instanceof Object) {
      attributes[key] = stripTags(attributes[key]);
    } else {
      attributes[key] = sanitize(attributes[key]);
    }
  }
  return attributes;
};

module.exports = function (req, res, next) {
  //clean stuff
  const { id, _id, ...attributes } = req.body;
  req.body = stripTags(attributes);
  next();
};
