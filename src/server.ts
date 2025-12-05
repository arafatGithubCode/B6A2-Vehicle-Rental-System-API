import app from "./app";
import config from "./config";

const { port, appName } = config.app;

app.listen(port, () => {
  console.log(`🌟 ${appName}'s server is running on http://localhost:${port}`);
});
