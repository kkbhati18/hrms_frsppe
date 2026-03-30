/**
 * Standardised API response helpers.
 */
const sendSuccess = (res, data = {}, message = "Success", statusCode = 200) =>
  res.status(statusCode).json({ success: true, message, data });

const sendCreated = (res, data = {}, message = "Created successfully") =>
  sendSuccess(res, data, message, 201);

const sendError = (res, message = "Error", statusCode = 400, errors = null) => {
  const payload = { success: false, message };
  if (errors) payload.errors = errors;
  return res.status(statusCode).json(payload);
};

module.exports = { sendSuccess, sendCreated, sendError };
