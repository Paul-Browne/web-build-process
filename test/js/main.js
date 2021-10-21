import sleep from "./async.js";

const test1 = sleep(2000, function () {
  return "hello world";
});

console.log(test1);
