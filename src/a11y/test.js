const { Builder } = require("selenium-webdriver");
const { Options } = require("selenium-webdriver/chrome.js");
var AxeBuilder = require("axe-webdriverjs");
const Logger = require("utility-logger");
const chalk = require("chalk");

const logger = new Logger({
  level: "error",
});
const getdriver = async () => {
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

exports.test_a11y = async (url) => {
  const driver = await getdriver();
  const report = await new Promise((resolve, reject) => {
    driver
      .get(url)
      .then(() => {
        console.log(`Got ${url}`);
        console.log(`Testing ${url}`);

        AxeBuilder(driver).analyze((err, result) => {
          if (err) {
            reject(err);
          }
          console.log(chalk.cyan(`Results for ${url} received`));
          resolve(result);
          driver.close();
        });
      })
      .catch((err) => console.log(err));
  });
  const violation = formatAccessibilityViolations(report.violations);
  console.log(
    chalk.magenta.underline.bold(`${url} found following violations:
    `),
    chalk.blue(`${violation}`)
  );
  // console.log(`{
  //   url,
  //   violations: ${JSON.stringify(report.violations)},
  // passes: ${JSON.stringify(report.passes)},
  // }`);
};

const formatAccessibilityViolations = (violations) => {
  const messages = violations.map(
    (violation) =>
      `\r\n- ${violation.help} (${violation.nodes.length} elements affected)`
  );
  return `${violations.length} violations found: ${messages.join()}`;
};
