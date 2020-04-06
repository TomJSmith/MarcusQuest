const marcusUrl = "https://www.madebymarcus.ca/pickup/yyc/pint-4-pack";
const moment = require("moment");
const opn = require("opn");
const notifier = require("node-notifier");

const checkStock = async () => {
  const axios = require("axios");
  const cheerio = require("cheerio");

  const fetchDate = async () => {
    const result = await axios.get(marcusUrl);
    return cheerio.load(result.data);
  }

  const $ = await fetchDate();
  return !$(".product-mark").hasClass("sold-out");
};

const notify = () => {
  notifier.notify({
    message: "Ice cream is in stock!",
    title: "Made By Marcus",
    sound: "true",
    wait: true 
  },
  function name(error, result) {
    opn(marcusUrl);
  });
};

const timer = setInterval(() => {
  console.log(`[${moment().format("MMM D, YYYY HH:mm:ss")}] checking...`);
  checkStock().then((inStock) => {
    if (inStock) {
      notify();
      clearInterval(timer);
      setTimeout(() => {
      }, 10000);
    }
  });
}, 30000);
