const express = require("express");
const middleware = require("./middleware/middleware");
const routes = require("./routes/summaryRoutes");

const app = express();
app.use(middleware);
app.use(routes);

app.listen(5000, () => {
  console.log("Server is listening on port 5000");
});
