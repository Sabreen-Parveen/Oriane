const Logger = require("utility-logger");
const Crawler = require("../crawler/crawler");
const { test_a11y } = require("./test");
const url = process.argv.slice(2);

const logger = new Logger({
  level: "error",
});

exports.testA11y = async (url) => {
  const crawler = new Crawler({
    domain: url,
    depth: 1,
    logger: logger,
  });
  const linkQueue = await crawler.crawl();

  linkQueue.forEach(async (url) => {
    try {
      await test_a11y(url);
    } catch (err) {
      console.log(err);
    }
  });
};
// test_a11y("https://openlibrary.org");
