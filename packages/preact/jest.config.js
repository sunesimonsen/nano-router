export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    customExportConditions: ["node", "require"],
  },
  modulePathIgnorePatterns: ["<rootDir>/dist/", "<rootDir>/lib/"],
  moduleNameMapper: { "(.+)\\.js": "$1" },
  setupFilesAfterEnv: ["<rootDir>/test/setupAfterEnv.ts"],
  transformIgnorePatterns: [
    "node_modules/(?!(preact|@testing-library/preact)/)",
  ],
};
