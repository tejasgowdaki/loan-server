const userErrorMessage = 'Is this unprecedented?. Press the magic button';
const success = (data = {}) => ({ success: true, ...data });

const error = (message = null, data = {}) => ({
  success: false,
  message: message || userErrorMessage,
  ...data
});

const apiError = (err, req, res, next) => {
  console.error('apiError -> err', err);
  res.status(err.status || 401).json(error({ message: err.message }));
};

module.exports = { success, error, apiError };
