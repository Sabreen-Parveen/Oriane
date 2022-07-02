import Logger from "utility-logger";
import Crawler from "../crawler/crawler.mjs";
import { test_a11y } from "./test.mjs";
export const logger = new Logger({
  level: "error",
});
const crawler = new Crawler({
  domain: "sourceqwik.com/",
  depth: 5,
  logger: logger,
});
const linkQueue = await crawler.crawl();
console.log(linkQueue);

linkQueue.forEach(async (url) => {
  try {
    await test_a11y(url);
  } catch (err) {
    console.log(err);
  }
});

// await test_a11y("https://sourceqwik.com/");
