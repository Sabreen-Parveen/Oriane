import { Builder } from "selenium-webdriver";
import { Options } from "selenium-webdriver/chrome.js";
import axeBuilder from "axe-webdriverjs";
import { logger } from "./test_runner.mjs";

export const getdriver = async () => {
  try {
    const options = new Options();
    options.addArguments("headless");

    const driver = new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();
    driver.manage().window().setSize(1280, 1024);
    return driver;
  } catch (err) {
    logger.error("Error encountered in using Selenium Webdriver: ");
    logger.error(err);
    process.exit(1);
  }
};

export const test_a11y = async (url) => {
  const driver = await getdriver();
  const report = await new Promise((resolve, reject) => {
    driver
      .get(url)
      .then(() => {
        console.log("Test case: ", 1);
        console.log(`Got ${url}`);
        console.log(`Testing ${url}`);

        axeBuilder(driver).analyze((result, err) => {
          if (err) {
            reject(err);
          }
          console.log(`Results for ${url} received`);
          resolve(result);
          driver.close();
        });
      })
      .catch((err) => console.log(err));
  });
  const violation = formatAccessibilityViolations(report.violations);
  console.log(`${url} found following violations: 
  ${violation}`);
  // console.log(`{
  //   url,
  //   violations: ${JSON.stringify(report.violations)},
  // passes: JSON.stringify(report.passes),
  // }`);
};

export const formatAccessibilityViolations = (violations) => {
  const messages = violations.map(
    (violation) =>
      `\r\n- ${violation.help} (${violation.nodes.length} elements affected)
            \r  Help: ${violation.helpUrl}\r\n`
  );
  return `${violations.length} violations found: ${messages.join()}`;
};
