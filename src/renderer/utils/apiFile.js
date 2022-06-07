/**
 * api发起请求
 * @param {String} url 例子：user/login 目前仅支持2级
 * @param {*} data 参数
 */
import fs from "fs";
import path from "path";

export const apiFile = (url, data) => {
  const filePath = url.split("/");
  const modulesFiles = require.context("../api", false, /\.js$/);
  const modules = modulesFiles.keys().reduce((modules, modulePath) => {
    let value = [];
    if (modulePath.indexOf(filePath[0]) > 0) {
      value = modulesFiles(modulePath);
      return value[filePath[1]];
    }
    return modules;
  }, {});
  return modules(data);
};

/**
 * 判断文件夹是否存在，不存在则创建
 * @param {string} dir 路径
 */
export const dirExists = dir => {
  return new Promise((resolve, reject) => {
    fs.exists(dir, exists => {
      if (!exists) {
        mkdir(dir).then(res => {
          res ? resolve() : reject(res);
        });
      } else {
        resolve();
      }
    });
  });
};
/**
 * 读取路径信息
 * @param {string} path 路径
 */
function getStat(path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err) {
        resolve(false);
      } else {
        resolve(stats);
      }
    });
  });
}

/**
 * 创建路径
 * @param {string} dir 路径
 */
export const mkdir = dir => {
  return new Promise((resolve, reject) => {
    fs.mkdir(dir, err => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};

export const findData = () => {
  const data = path.resolve(__dirname, "../../../data");
  const dataFind = path.resolve(__dirname, "../../../data/data.db");
  dirExists(data).then(res => {
    getStat(dataFind).then(ret => {
      if (!ret) {
        fs.writeFile(
          dataFind,
          `{"dbname":"login","username":"admin","password":"admin","status":"true","_id":"CQzz7LDaimVMidYs"}`,
          err => {
            if (err) return console.log(err);
            console.log(dataFind);
            console.log("初始化成功");
          }
        );
      }
    });
  });
};
