import sleep from "./async.js";
import index from "../html/index.html";
import style from "../css/style.css";
import sass from "../sass/test_scss.scss";

const test1 = sleep(2000, function () {
  return "hello world";
});

console.log(test1);
console.log(index);
console.log(style);
console.log(sass);
