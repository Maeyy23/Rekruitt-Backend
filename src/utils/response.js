const buildFailureResponse = (message, statusCode) => {
  return {
    message,
    statusCode,
    status: "Failure",
  };
};

const buildSuccessResponse = (message, statusCode, data) => {
  if (data) {
    return {
      message,
      statusCode,
      status: "success",
      data,
    };
  }
  return {
    message,
    statusCode,
    status: "Success",
  };
};

module.exports = {
  buildFailureResponse,
  buildSuccessResponse,
};
