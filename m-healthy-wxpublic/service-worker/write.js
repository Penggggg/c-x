const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const config = require("./config");

const getHash = () => {
  const current_date = new Date().valueOf().toString();
  const random = Math.random().toString();
  return crypto
    .createHash("sha1")
    .update(current_date + random)
    .digest("hex");
};
const copyFile = (src, dist) => {
  fs.createReadStream(src).pipe(fs.createWriteStream(dist));
};

const writeFile = () => {
  fs.access(
    `${path.join(__dirname, `..${config.rootPath}`, "/service-worker")}`,
    function(err) {
      if (err) {
        // 目录不存在时创建目录
        fs.mkdir(
          `${path.join(__dirname, `..${config.rootPath}`, "/service-worker")}`,
          err => {
            if (err) {
              throw Error("创建service-worker文件夹出错");
            }
            copy();
          }
        );
      }
      copy();
    }
  );
  const copy = () => {
    copyFile(
      `${path.resolve(__dirname, `./sw.js`)}`,
      `${path.resolve(
        __dirname,
        `..${config.rootPath}/service-worker/service-worker.js`
      )}`
    );
    copyFile(
      `${path.resolve(__dirname, `./registerSw.js`)}`,
      `${path.resolve(
        __dirname,
        `..${config.rootPath}/service-worker/registerSw.js`
      )}`
    );
    copyFile(
      `${path.resolve(__dirname, `./config.js`)}`,
      `${path.resolve(
        __dirname,
        `..${config.rootPath}/service-worker/config.js`
      )}`
    );
  };
};

// deleteFile();
writeFile();
