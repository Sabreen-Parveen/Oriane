// Get url and create a set all valid urls.
const validator = require("validator");
const { isURL } = validator;
const axios = require("axios");
const cheerio = require("cheerio");
const { filterLinks } = require("./urlFilter.js");

const OPTIONS = Symbol("Options");
const UNIQUE_LINKS = Symbol("Set of unique links to be tested");

// Methods
const QUEUE_LINKS = Symbol("Add all links on a page to UNIQUE_LINKS");
const FILTER_LINKS = Symbol("Filter out broken, invalid, media, etc. links");
const BATCH_GET_CONTENT = Symbol(
  "Perform axios.get on each url in an array and return array of completed responses"
);
const BATCH_PARSE_LINKS = Symbol(
  "Build a set of links scraped from an array of axios reponses"
);

/* --- Class Declaration and Public Method Implementations --- */
module.exports = class Crawler {
  constructor(opts) {
    // Values
    this[OPTIONS] = opts;
    this[UNIQUE_LINKS] = new Set();

    // Methods
    this[QUEUE_LINKS] = queueLinks.bind(this);
    this[FILTER_LINKS] = filterLinks(opts);
    this[BATCH_GET_CONTENT] = batchGetContent.bind(this); //bind creates a new fun with this keyword pointing to the passed this keyword as by default in js this keyword inside a function points to null
    this[BATCH_PARSE_LINKS] = batchParseLinks.bind(this);
    // console.log(this);
  }

  async crawl() {
    const { domain, depth = 5, logger } = this[OPTIONS];
    console.log(domain);
    // Validate url and throw error if invalid, else add to unique set
    const firstUrl = `http://${domain}`;
    if (domain == undefined) {
      console.log("No domain provided.  Exiting...");
      return process.exit(0);
    } else if (!isURL(firstUrl)) {
      logger.error(new Error(`Invalid url: ${firstUrl}`));
      return process.exit(1);
    }
    this[UNIQUE_LINKS].add(firstUrl);

    // Fast return if depth === 0
    if (depth === 0) {
      return this[UNIQUE_LINKS];
    }

    try {
      console.log(`Crawling ${firstUrl}`);
      let links = this[UNIQUE_LINKS];

      for (let i = 0; i < depth; i += 1) {
        const linkedContent = await this[BATCH_GET_CONTENT](links);
        links = this[BATCH_PARSE_LINKS](linkedContent);

        if (links.size === 0) {
          break;
        }

        console.log(`${links.size} links found`);
        for (const address of links) {
          this[UNIQUE_LINKS].add(address);
        }
      }

      return this[UNIQUE_LINKS];
    } catch (err) {
      logger.error("Error crawling for links: ", err);
      return process.exit(1);
    }
  }
};

function batchParseLinks(linkedContent) {
  const { domain } = this[OPTIONS];
  return linkedContent
    .filter((content) => {
      const x = !(content instanceof Error);
      // console.log(x);
      return x;
    })
    .map((newPage) => {
      // console.log(newPage);
      return this[QUEUE_LINKS](domain, newPage);
    })
    .reduce(combineLinkSets, new Set());
}

const batchGetContent = async (links) => {
  // console.log(`batchGetContent: ${links}`);
  const content = [];
  await [...links].reduce(
    (promise, url, i) =>
      promise.then(() => {
        console.log(`Fetching #${i + 1}: ${url}`);
        return axios
          .get(url)
          .catch((err) => err)
          .then((result) => content.push(result));
      }),
    Promise.resolve([])
  );
  // console.log(content);
  return content;
};

function getHref(currentURL, links) {
  console.log("currentURL: ", currentURL);
  const currentDomain = currentURL.replace(
    new RegExp("^(https?://(\\w+\\.?)+)/(.*)$"),
    "$1"
  );
  console.log("current domain: ", currentDomain);
  return (key) => {
    if (links[key].attribs) {
      const link = links[key].attribs.href;
      if (link) {
        //replaces relative links and add domain name in beginning
        return link
          .replace(
            new RegExp(`^(?!https?://)(?!${currentURL}/)(/?)(.*)`),
            `${currentDomain}/$2`
          )
          .replace(new RegExp(`^${currentDomain}//`), "http://");
      }
    }
    return null;
  };
}

function queueLinks(domain, pageContent) {
  //this function looks for links in the given page passed by getBatchContent
  if (pageContent === undefined) {
    return new Set();
  }
  if (pageContent.status === 200) {
    const links = cheerio.load(pageContent.data)("a"); //loads all the anchor tag elements
    // console.log(links);
    //links is an object of nodes wconsole.log(linkQueue);hich has a property href, for links we want the href attribute
    const currentURL = pageContent.config.url;

    return new Set(
      Object.keys(links)
        .map(getHref(currentURL, links))
        .filter((url) => typeof url === "string")
        .filter(this[FILTER_LINKS]) //filters links whether it is an email address or have same domain or not
        .map((url) => url.replace(/^https:\/\//, "http://"))
    );
  }
  return new Set(); //when status is not 200
}

function combineLinkSets(urlList, urlSet) {
  //urlSet is an empty set
  // console.log(urlList);
  if (urlList instanceof Set) {
    for (const address of urlList) {
      urlSet.add(address);
    }
    // console.log(urlSet);
    return urlSet;
  }
  return urlSet;
}
