const express = require("express");

const logger = require("./middleware/logger");

const app = express();
const PORT = process.env.PORT || 5000;

// Init Middleware
app.use(logger);

// Init Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Cookbook api routes
app.use("/api/cookbooks", require("./routes/api/cookbooks"));

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
