const wbp = require(".");

wbp({
  source: "test",
  dist: "public",
  port: 8899,
  forceBuild: true
});

// wbp({
//   source: "test",
//   dist: "dist",
//   forceBuild: true,
//   buildOnly: true
// });

