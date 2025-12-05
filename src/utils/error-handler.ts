const errorHandler = (error: unknown, fallback: string = "Unknown error!") => {
  let errMsg: string = "";
  if (error instanceof Error) {
    errMsg = error.message;
  } else if (typeof error === "string") {
    errMsg = error;
  } else {
    errMsg = fallback;
  }

  return errMsg;
};

export default errorHandler;
