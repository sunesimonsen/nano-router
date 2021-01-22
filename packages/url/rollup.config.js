import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default [
  {
    input: "src/index.js",
    output: {
      file: "dist/url.cjs",
      format: "cjs",
    },
    external: ["querystring", "@nano-router/path"],
  },
  {
    input: "src/index.js",
    output: {
      file: "dist/url.js",
      format: "esm",
    },
    plugins: [
      commonjs(),
      nodeResolve({
        preferBuiltins: false,
      }),
    ],
    external: ["@nano-router/path"],
  },
];
