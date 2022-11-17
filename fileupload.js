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

async function downloadMultipleFiles(fileUrls, downloadFolder) {
  // Get the file name
  //   const fileName = path.basename(fileUrl);
  console.log("fileUrls = ", fileUrls);
  try {
    let imagesPath = [];
    for (let i = 0; i < fileUrls.length; i++) {
      let image = await uploadImage(fileUrls[i],downloadFolder);
      console.log("image = ", image);
      imagesPath.push(image);
    }
    console.log("imagesPath = ", imagesPath);
    return imagesPath;
  } catch (err) {
    return err;
    // reject(err);
  }
}

async function uploadImage(fileUrl, downloadFolder) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("fileUrl here = ",fileUrl)
      let extension = path.extname(fileUrl);
      console.log("extension = ",extension);
      if (!extension) {
        extension = ".jpg";
      }
      const fileName = helperMethod.maketoken(10) + extension;
      console.log("fileName = ",fileName);
      // The path of the downloaded file on our machine
      console.log("__dirname = ",__dirname);
      console.log("downloadFolder = ",downloadFolder);
      console.log("fileName = ",fileName);

      const localFilePath = path.resolve(__dirname, downloadFolder, fileName);
      const response = await axios({
        method: "GET",
        url: fileUrl,
        responseType: "stream",
      });

      const writer = response.data.pipe(fs.createWriteStream(localFilePath));
      writer.on("finish", () => {
        console.log("Successfully downloaded file!");
        resolve(localFilePath);
      });
      writer.on("error", (err) => {
        console.log("Successfully downloaded file!");
        reject(err);
      });
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { downloadFile, downloadMultipleFiles };
