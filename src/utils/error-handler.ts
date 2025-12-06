const errorHandler = (error: unknown, fallback: string = "Unknown error!") => {
  let errMsg: { message: string; statusCode: number } = {
    message: fallback,
    statusCode: 500,
  };
  if (error instanceof Error) {
    errMsg.message = error.message;
    errMsg.statusCode = (error as any).statusCode || 500;
  } else if (typeof error === "string") {
    errMsg.message = error;
    errMsg.statusCode = 500;
  } else {
    errMsg.message = fallback;
    errMsg.statusCode = 500;
  }

  return errMsg;
};

export default errorHandler;
