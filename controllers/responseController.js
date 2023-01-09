// eslint-disable-next-line no-multi-assign, no-undef
module.exports = sendResponse = (statusCode, doc, res) => {
  res.status(statusCode).json({
    status: 'success',
    data: {
      doc,
    },
  });
};
