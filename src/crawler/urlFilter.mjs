import validator from "validator";
const { isURL } = validator;

export const selectSampleSet = (opts) => {
  return (urlList, url) => {
    if (!opts.random) {
      urlList.push(url);
      return urlList;
    }

    if (Math.random() < opts.random) {
      urlList.push(url);
      return urlList;
    }

    return urlList;
  };
};

export const notMedia = (url) => {
  return (
    !/(uploads\/\d{4}\/\d{2}\/)/.test(url) &&
    !/attachment_id/.test(url) &&
    !/\.(exe|wmv|avi|flv|mov|mkv|mp..?|swf|ra.?|rm|as.|m4[av]|smi.?|doc|docx|ppt|pptx|pps|ppsx|jpg|png|gif|pdf)$/.test(
      url
    )
  );
};

export const isDoc = (url) => {
  return (
    /(uploads\/\d{4}\/\d{2}\/)/.test(url) &&
    /\.(doc|docx|ppt|pptx|pps|ppsx|pdf|xls|xlsx)$/.test(url)
  );
};

export const matchDomain = (domain) => {
  return (url) =>
    new RegExp(`^https?://([\\w&&[^\\?=\\&\\.]]*\\.?)*?${domain}/?.*$`).test(
      url
    ) || /^\/\w+/.test(url);
};

const notEmailLink = (link) => {
  const mailLinkRE = new RegExp("mailto:\\w+");
  return !mailLinkRE.test(link);
};

const notTelLink = (link) => {
  const telLinkRE = new RegExp("tel:\\+?\\d+");
  return !telLinkRE.test(link);
};

const notSamePageLink = (link) => {
  const samePageLinkRE = new RegExp("https?://.*#[^/]*$");
  return !samePageLinkRE.test(link);
};

export const filterLinks = (opts) => {
  const { domain, ignore, whitelist } = opts;
  const ignoreRegex = new RegExp(ignore || "^$");
  const whiteListRegex = new RegExp(whitelist || ".*");

  return (link) =>
    isURL(link) &&
    notMedia(link) &&
    notEmailLink(link) &&
    notTelLink(link) &&
    matchDomain(domain)(link) &&
    whiteListRegex.test(link) &&
    (whitelist ? true : !ignoreRegex.test(link)); // whitelist overrides ignore
};

// export const isNatural = (num) => {
//   if (num < 0) return false;
//   return Number.isInteger(num);
// };

export const createURLViewSet = (opts) => {
  return (links, url) => {
    opts.viewPorts.forEach((viewPort) => {
      links.push({ url, viewPort });
    });
    return links;
  };
};
