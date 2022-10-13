const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const fileDownload = require("./fileupload");
const middleware = require("./middleware");
const fs = require("fs");

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/fileUpload", middleware.authenticated, async (req, res) => {
  fileDownload
    .downloadFile(req.query.url, "images")
    .then((resp) => {
      console.log("resp = ", resp);
      //   res.sendFile(resp);
      let imagePath = resp.replace(__dirname, "");
      console.log("imagePath = ", imagePath);

      res.json(imagePath);
    })
    .catch((err) => {
      res.status(400).json({ error: err });
    });
});
app.get("/imageViewer", async (req, res) => {
  //   res.sendFile('ImageViewer/imageViewer.html');
  //   res.sendFile('ImageViewer/imageViewer.html', {root: __dirname });
  //   res.render('ImageViewer/imageViewer.html', {root: __dirname });

  fs.readFile(
    __dirname + "/ImageViewer/imageViewer.html",
    "utf8",
    (err, text) => {
      res.send(text);
    }
  );
});

app.get("/fileLink", async (req, res) => {
  console.log("req.query.url = ", req.query.url);

  res.sendFile(__dirname + req.query.url);
  // fs.readFile(
  //   __dirname + "/ImageViewer/imageLoad.html",
  //   "utf8",
  //   (err, text) => {
  //     res.send(text);
  //   }
  // );
});

app.get("/imageLink", middleware.authenticated, async (req, res) => {
  fileDownload
    .downloadFile(req.query.url, "images")
    .then((resp) => {
      console.log("resp = ", resp);
      //   res.sendFile(resp);
      let imagePath = resp.replace(__dirname, "");
      console.log("imagePath = ", imagePath);

      // res.json(imagePath);
      let newerPath = `http://localhost:3000/fileLink?url=${imagePath}`;
      const validImageTypes = ["gif", "jpeg", "png" , "jpg"];
      if (!newerPath.includes(validImageTypes)) {
        res.redirect(newerPath);
      } else {
        res.send(`
      <div>
        <img src="${newerPath} "style="
        width: 100%;
        height: auto;
      " />
      </div>
    `);
      }
    })
    .catch((err) => {
      res.status(400).json({ error: err });
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
