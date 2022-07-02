const validator = require("validator");
const { isURL } = validator;

const notMedia = (url) => {
  return (
    !/(uploads\/\d{4}\/\d{2}\/)/.test(url) &&
    !/attachment_id/.test(url) &&
    !/\.(exe|wmv|avi|flv|mov|mkv|mp..?|swf|ra.?|rm|as.|m4[av]|smi.?|doc|docx|ppt|pptx|pps|ppsx|jpg|png|gif|pdf)$/.test(
      url
    )
  );
};

isDoc = (url) => {
  return (
    /(uploads\/\d{4}\/\d{2}\/)/.test(url) &&
    /\.(doc|docx|ppt|pptx|pps|ppsx|pdf|xls|xlsx)$/.test(url)
  );
};

matchDomain = (domain) => {
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

exports.filterLinks = (opts) => {
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
