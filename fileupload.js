const fs = require("fs");
const path = require("path");
const axios = require("axios").default;
const helperMethod = require("./helper");

async function downloadFile(fileUrl, downloadFolder) {
  // Get the file name
  //   const fileName = path.basename(fileUrl);

  try {
    let extension = path.extname(fileUrl);
    if (!extension) {
      extension = ".jpg";
    }
    const fileName = helperMethod.maketoken(10) + extension;

    // The path of the downloaded file on our machine
    const localFilePath = path.resolve(__dirname, downloadFolder, fileName);
    const response = await axios({
      method: "GET",
      url: fileUrl,
      responseType: "stream",
    });

    const writer = response.data.pipe(fs.createWriteStream(localFilePath));
    return new Promise((resolve, reject) => {
      writer.on("finish", () => {
        console.log("Successfully downloaded file!");
        resolve(localFilePath);
      });
      writer.on("error", (err) => {
        console.log("Successfully downloaded file!");
        reject(err);
      });
    });
  } catch (err) {
    reject(err);
  }
}

// Testing
// const IMAGE_URL =
//   "https://www.kindacode.com/wp-content/uploads/2021/01/test.jpg";
// downloadFile(IMAGE_URL, "download");

// const VIDEO_URL =
//   'https://www.kindacode.com/wp-content/uploads/2021/01/example.mp4';
// downloadFile(VIDEO_URL, 'download');

module.exports = { downloadFile };
