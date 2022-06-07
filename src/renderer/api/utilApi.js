import db from "../datastore/index";
import path from "path";
import fs from "fs";
import { dirExists } from "../utils/apiFile";
const nodeXlsx = require("node-xlsx");
import { returnJson } from "../utils/return";
/**
 * 查找所有数据
 */
export const findData = doc => {
  return new Promise((resolve, reject) => {
    db.find(doc).exec(function(err, docs) {
      if (err) {
        reject(returnJson(err, -1, "系统报错"));
        return;
      }
      return resolve(docs);
    });
  });
};
/**
 * 查找一条数据
 */
export const findOneData = doc => {
  return new Promise((resolve, reject) => {
    db.findOne(doc).exec(function(err, docs) {
      if (err) {
        reject(returnJson(err, -1, "系统报错"));
        return;
      }
      return resolve(docs);
    });
  });
};

/**
 * 批量插入
 * @param {Array} list 数组
 */
export const insertList = list => {
  return new Promise((resolve, reject) => {
    db.insert(list, function(err, docs) {
      if (err) {
        return reject(err);
      }
      return resolve(docs);
    });
  });
};
/**
 * 导出
 * @param {*} fileData
 */
export const exportFile = data => {
  return new Promise((resolve, reject) => {
    const download = path.resolve(__dirname, "../../../download");
    const chekced = data.chekced === false ? data.chekced : true;
    dirExists(download)
      .then(res => {
        // /重要数据${Date.parse(new Date()
        const buffer = nodeXlsx.build([{ name: "1", data: data.list }]);
        const name = `${data.name}_${time()}.xls`;
        const downloadName = data.downloadName || data.name;
        const dataDir = path.resolve(
          __dirname,
          "../../../download/" + downloadName
        );
        dirExists(dataDir)
          .then(() => {
            fs.writeFile(
              `${download}/${downloadName}/${name}`,
              buffer,
              function(err) {
                if (err) {
                  return resolve(returnJson(err, -1, "系统报错"));
                }
                if (chekced) {
                  openFile(downloadName);
                }
                resolve(returnJson(null, 1000, "导出成功"));
              }
            );
          })
          .catch(e => {
            exportFile(data);
          });
      })
      .catch(e => {
        reject(e);
      });
  });
};
export const time = (time = +new Date()) => {
  var date = new Date(time + 8 * 3600 * 1000);
  return date
    .toJSON()
    .substr(0, 10)
    .replace("T", " ");
};
export const openFile = title => {
  const download = path.resolve(__dirname, "../../../download");
  if (confirm(`导出成功文件名为:${title},是否打开文件夹？`)) {
    const { shell } = require("electron").remote;
    shell.showItemInFolder(download);
  }
};
export const isNumber = val => {
  var regPos = /^\d+(\.\d+)?$/; //非负浮点数
  var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
  if (regPos.test(val) || regNeg.test(val)) {
    return true;
  } else {
    return false;
  }
};
