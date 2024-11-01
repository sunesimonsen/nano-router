export default {
  input: "src/index.js",
  output: {
    file: "dist/bundle.cjs",
    format: "cjs",
  },
  external: ["@nano-router/path"],
};
