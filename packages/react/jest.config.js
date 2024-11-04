export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  modulePathIgnorePatterns: ["<rootDir>/dist/", "<rootDir>/lib/"],
  transform: {
    "\\.(ts|tsx)$": "ts-jest",
  },
  setupFilesAfterEnv: ["<rootDir>/test/setupAfterEnv.ts"],
};
