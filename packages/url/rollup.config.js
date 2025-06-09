import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default [
  {
    input: "lib/index.js",
    output: {
      file: "dist/bundle.cjs",
      format: "cjs",
    },
    external: ["querystring", "@nano-router/path"],
  },
  {
    input: "lib/index.js",
    output: {
      file: "dist/bundle.mjs",
      format: "es",
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
