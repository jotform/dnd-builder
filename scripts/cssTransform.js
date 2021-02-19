module.exports = {
  getCacheKey() {
    // The output is always the same.
    return 'cssTransform';
  },
  process() {
    return 'module.exports = {};';
  },
};
