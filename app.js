const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const fileDownload = require("./fileupload");
const middleware = require("./middleware");
const helper = require("./helper");
const cron = require("./cron");
const compress_images = require("compress-images");

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
      // res.sendFile(resp);
      let newSubPath = "/images/" + helper.maketoken(10);
      let newPath = __dirname + newSubPath;

      compress_images(
        resp,
        newPath,
        { compress_force: false, statistic: true, autoupdate: true },
        false,
        { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
        { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
        { svg: { engine: "svgo", command: "--multipass" } },
        {
          gif: {
            engine: "gifsicle",
            command: ["--colors", "64", "--use-col=web"],
          },
        },
        function (error, completed, statistic) {
          console.log("-------------");
          console.log(error);
          console.log(completed);
          console.log(statistic);
          console.log("-------------");
          if (error) {
            res.sendFile(resp);
          } else {
            res.sendFile(statistic.path_out_new);
          }
        }
      );
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
  console.log("image link called ", req.query.url);
  fileDownload
    .downloadFile(req.query.url, "images")
    .then((resp) => {
      let imagePath = resp.replace(__dirname, "");
      // res.json(imagePath);
      let newerPath = `https://mediafiles.squlpt-tech.com/fileLink?url=${imagePath}`;
      // let newerPath = `http://localhost:3000/fileLink?url=${imagePath}`;
      if (!isImage(imagePath)) {
        res.redirect(newerPath);
      } else {
        let newSubPath = "/images/" + helper.maketoken(10);
        let newPath = __dirname + newSubPath;
        compress_images(
          resp,
          newPath,
          { compress_force: false, statistic: true, autoupdate: true },
          false,
          { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
          { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
          { svg: { engine: "svgo", command: "--multipass" } },
          {
            gif: {
              engine: "gifsicle",
              command: ["--colors", "64", "--use-col=web"],
            },
          },
          function (error, completed, statistic) {
            console.log("-------------");
            console.log(error);
            console.log(completed);
            console.log(statistic);
            console.log("-------------");
            // res.redirect(newerPath);
            let outputPath = statistic.path_out_new.split("images/");
            outputPath = "/images/" + outputPath[1];
            // let newerPath = `http://localhost:3000/fileLink?url=${outputPath}`;
            let newerPath = `https://mediafiles.squlpt-tech.com/fileLink?url=${imagePath}`;
            res.send(`
            <div oncontextmenu="return false;">
              <img src="${newerPath}" style="
              width: 100%;
              height: auto;
            " />
            </div>
          `);
          }
        );
      }
    })
    .catch((err) => {
      res.status(400).json({ error: err });
    });
});

function isImage(url) {
  return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
