import { nodeResolve } from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import { babel } from "@rollup/plugin-babel";

const plugins = [
  nodeResolve(),
  babel({
    babelHelpers: "bundled",
    plugins: [
      [
        "htm",
        {
          import: "@dependable/view",
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

const external = ["@dependable/state"];

export default [
  {
    input: "src/index.js",
    output: {
      file: "dist/nano-router-dependable-view.esm.js",
      format: "esm",
    },
    external,
    plugins,
  },
  {
    input: "src/index.js",
    output: {
      file: "dist/nano-router-dependable-view.esm.min.js",
      format: "esm",
    },
    external,
    plugins: plugins.concat(minifyPlugins),
  },
];
