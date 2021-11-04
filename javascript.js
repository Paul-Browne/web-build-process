import { rollup } from "rollup";
import { babel } from "@rollup/plugin-babel";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import commonjs from "@rollup/plugin-commonjs";
import html from 'rollup-plugin-html';
import postcss from 'rollup-plugin-postcss'

export default async (inPath, outPath, sourceMaps) => {
  const bundle = await rollup({
    input: inPath,
    plugins: [
      nodeResolve(),
      commonjs({ transformMixedEsModules: true }),
      html({
        include: '**/*.html',
        htmlMinifierOptions: {
          removeAttributeQuotes: false,
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true,
          removeComments: true,
          decodeEntities: true,
        }        
      }),
      postcss({
        plugins: []
      }),
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
    sourcemap: sourceMaps,
  });
};