export default {
  preset: "ts-jest",
  testEnvironment: "node",
  modulePathIgnorePatterns: ["<rootDir>/dist/", "<rootDir>/lib/"],
  moduleNameMapper: { "(.+)\\.js": "$1" },
};
