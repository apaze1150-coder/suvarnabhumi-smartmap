module.exports = {
  testMatch: ["<rootDir>/tests/**/*.test.js"],
  transformIgnorePatterns: [
    "/node_modules/(?!(puppeteer|puppeteer-core|@puppeteer)/)"
  ]
};
