// utils/response.js
function successResponse(
  res,
  message = "Operation was successful",
  data,
  code = 200
) {
  return res.status(code).json({
    success: true,
    code,
    status: "OK",
    message,
    data,
  });
}

function errorResponse(
  res,
  message,
  code = 500,
  status = "INTERNAL_SERVER_ERROR",
  details = []
) {
  if (!code || typeof code !== "number" || code < 100 || code > 599) {
    code = 500;
  }

  return res.status(code).json({
    success: false,
    code,
    status,
    error: {
      message,
      details,
    },
  });
}

module.exports = { successResponse, errorResponse };
