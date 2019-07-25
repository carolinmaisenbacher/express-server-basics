const express = require("express");

const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.end("hello world"); // bare http method, will just send a string, without any headers set
  //   res.send("<h1>hello world</h1>"); // express specific function, sets content type in header automatically (so this will be html)
});

app.get("/file/", (req, res) => {
  // manual way of sending static files
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
