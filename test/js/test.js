import { numberCubed, vowAll } from "./abc.js";
var plus21 = require("./plus21.js");

const square = x => x * x;

const test_literal = `the square of 21 is ${square(
  21
)} and 10 x 100 is ${numberCubed(100)}`;

function sum(x, y, z) {
  return x + y + z;
}

const numbers = [1, 2, 3];

console.log(sum(...numbers));
console.log(test_literal);
console.log(plus21(100));
