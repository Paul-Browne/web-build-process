const fileWalker = require("recursive-file-walker");
const prettifyThis = require("prettify-this");

fileWalker({
  id: "clean",
  entry: __dirname,
  ignoreDir: ["node_modules", "public", ".git"],
  onFile: (response) => {
    prettifyThis(response.path);
  },
});
