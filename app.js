const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const fileDownload = require("./fileupload");
const middleware = require("./middleware");

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/fileUpload", middleware.authenticated, async (req, res) => {
  fileDownload
    .downloadFile(req.query.url, "images")
    .then((resp) => {
      res.sendFile(resp);
    })
    .catch((err) => {
      res.status(400).json({ error: err });
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
