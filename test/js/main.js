import sleep from "./async.js";
import index from "../html/index.html";

const test1 = sleep(2000, function () {
  return "hello world";
});

console.log(test1);
console.log(index);
