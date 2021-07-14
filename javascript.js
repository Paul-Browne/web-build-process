const { rollup } = require("rollup");
const { babel } = require("@rollup/plugin-babel");
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const { terser } = require("rollup-plugin-terser");
const commonjs = require("@rollup/plugin-commonjs");

const buildJs = async (inPath, outPath) => {
  const bundle = await rollup({
    input: inPath,
    plugins: [
      nodeResolve(),
      commonjs({ transformMixedEsModules: true }),
      babel({
        babelHelpers: "runtime",
        presets: [
          [
            "@babel/preset-env",
            {
              exclude: ["@babel/plugin-transform-typeof-symbol"],
              targets: {
                browsers: ["last 2 versions", "IE >= 11"],
              },
            },
          ],
        ],
        plugins: [
            "@babel/plugin-transform-runtime"
        ]        
      }),
      terser(),
    ],
  });
  bundle.write({
    format: "iife",
    file: outPath,
    sourcemap: true,
  });
};

module.exports = (inPath, outPath) => {
  buildJs(inPath, outPath);
};
