export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  modulePathIgnorePatterns: ["<rootDir>/dist/", "<rootDir>/lib/"],
  moduleNameMapper: { "(.+)\\.js": "$1" },
  setupFilesAfterEnv: ["<rootDir>/test/setupAfterEnv.ts"],
};
