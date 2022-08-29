const { initialRanges, createRange, test } = require("./rangeCreator");

function createDay(config) {
  return { ...config, ranges: initialRanges(config) };
}

module.exports = createDay;
