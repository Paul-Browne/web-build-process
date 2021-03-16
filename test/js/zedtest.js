import Z from "zedjs";

Z.mount({
  id: "greeting",
  render: function (state, prev) {
    return `
    	<button onclick='Z.update("greeting", {state: {name:"Tina", age:24} })'>Update!</button>
    	<h1>Hello ${state.name}!</h1>
    `;
  },
  inner: document.getElementsByTagName("body")[0],
  state: {
    name: "Paul",
  },
});

Z.watch("greeting", function () {
  alert(Z.greeting.name + " use the force!");
});
