export default {
  input: "lib/index.js",
  output: [
    {
      file: "dist/bundle.cjs",
      format: "cjs",
    },
    {
      file: "dist/bundle.mjs",
      format: "es",
    },
  ],
  external: ["@nano-router/router", "react"],
};
