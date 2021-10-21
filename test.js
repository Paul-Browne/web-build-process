import wbp, {reset} from "./index.js";

const t = Date.now();
await reset("qwerty");
await wbp({
  source: "test",
  dist: "public",
  prettify: true,
  port: 8899,
  id: "qwerty",
  verbose: true
});

console.log("time taken: " + (Date.now() - t));