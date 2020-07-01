const userErrorMessage = "Is this unprecedented?. Press the magic button";
const success = (data = {}) => ({ success: true, ...data });

const error = (data = {}) => ({
  success: false,
  message: userErrorMessage,
  ...data
});

const apiError = (err, req, res, next) => {
  res.status(err.status || 401).json(error({ message: err.message }));
};

module.exports = { success, error, apiError };
