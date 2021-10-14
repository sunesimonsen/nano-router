import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import { babel } from "@rollup/plugin-babel";

const plugins = [
  commonjs(),
  nodeResolve(),
  babel({
    babelHelpers: "bundled",
    plugins: [
      [
        "htm",
        {
          import: "@depository/view",
          useBuiltIns: true,
          useNativeSpread: true,
        },
      ],
    ],
  }),
];

const minifyPlugins = [
  terser({
    compress: true,
    mangle: {
      properties: {
        regex: /^_/,
      },
    },
  }),
];

export default [
  {
    input: "src/index.js",
    output: {
      file: "dist/nano-router-depository-view.esm.js",
      format: "esm",
    },
    plugins,
  },
  {
    input: "src/index.js",
    output: {
      file: "dist/nano-router-depository-view.min.js",
      format: "esm",
    },
    plugins: plugins.concat(minifyPlugins),
  },
];
