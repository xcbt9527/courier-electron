const zipper = require("zip-local");
import { dirExists } from "../utils/apiFile";
import fs from "fs";
import path from "path";
import db from "../datastore/index";
import { returnJson } from "../utils/return";
import moment from "moment";
/**
 * 备份
 */
export const backup = () => {
  return new Promise((resolve, reject) => {
    const download = path.resolve(__dirname, "../../../download");
    dirExists(download)
      .then(res => {
        zipper.zip(path.resolve(__dirname, "../../../data/data.db"), function(
          error,
          zipped
        ) {
          if (!error) {
            zipped.compress(); // compress before exporting
            // or save the zipped file to disk
            zipped.save(
              `${download}/数据备份-${moment(new Date()).format(
                "YYYY年MM月DD日 HH时mm分ss秒"
              )}.zip`,
              function(error) {
                if (!error) {
                  if (
                    confirm(
                      `备份成功文件名字为：${download}/数据备份-${moment(
                        new Date()
                      ).format(
                        "YYYY年MM月DD日 HH时mm分ss秒"
                      )}.zip,是否打开文件夹？`
                    )
                  ) {
                    const { shell } = require("electron").remote;
                    shell.showItemInFolder(download);
                  }
                } else {
                  reject(error);
                  alert(`备份失败具体原因：${error}`);
                }
              }
            );
            resolve();
          } else {
            reject(error);
            alert(`备份失败具体原因：${error}`);
          }
        });
      })
      .catch(e => {
        reject(e);
        alert("请联络管理员");
      });
  });
};
/**
 * 清除杂费和寄件运费
 * otherchargeTemporary:临时导入杂费
 * @param {*} data
 */
export const clean = () => {
  return new Promise((resolve, reject) => {
    db.remove(
      {
        dbname: {
          $in: [
            "othercharge",
            "price",
            "otherchargeTemporary",
            "errorsend",
            "send"
          ]
        }
      },
      { multi: true },
      function(err, numRemoved) {
        if (err) {
          return resolve(returnJson(numRemoved, -1, "系统报错"));
        }
        return resolve(returnJson(numRemoved, 1000, "清理成功"));
      }
    );
  });
};
/**
 * 解压数据库
 */
export const unzip = data => {
  return new Promise((resolve, reject) => {
    const download = path.resolve(__dirname, "../../../download");
    dirExists(download)
      .then(res => {
        const datadbpath = path.resolve(__dirname, "../../../data");
        zipper.zip(datadbpath, function(error, zipped) {
          if (!error) {
            zipped.compress(); // compress before exporting
            // or save the zipped file to disk
            zipped.save(
              `${download}/数据备份-${moment(new Date()).format(
                "YYYY年MM月DD日 HH时mm分ss秒"
              )}.zip`,
              function(error) {
                if (!error) {
                  const datadbpathNedb = path.resolve(
                    __dirname,
                    "../../../data/data.db"
                  );
                  const delfile = fs.unlinkSync(datadbpathNedb);
                  if (!delfile) {
                    const unzippedfs = zipper.sync.unzip(data.url).memory();
                    for (const fileName of unzippedfs.contents()) {
                      var buff = unzippedfs.read(fileName, "buffer");
                      let fileDeepPath = path.resolve(
                        __dirname,
                        `../../../data/${fileName}`
                      );
                      fs.writeFileSync(fileDeepPath, buff);
                    }
                    const msg = `备份成功，文件名字为数据备份-${moment(
                      new Date()
                    ).format("YYYY年MM月DD日 HH时mm分ss秒")}.zip`;
                    return resolve(returnJson("", 1000, msg));
                  } else {
                    return resolve(returnJson(delfile, -1, "文件删除失败"));
                  }
                } else {
                  alert(`备份失败具体原因：${error}`);
                }
              }
            );
            resolve();
          } else {
            return resolve(returnJson(error, -1, "请联络管理员"));
          }
        });
      })
      .catch(e => {
        return resolve(returnJson(e, -1, "请联络管理员"));
      });
  });
};

export const modifyPwd = data => {
  return new Promise((resolve, reject) => {
    const doc = {
      dbname: "login",
      username: data.username
    };
    db.findOne(doc, function(err, docs) {
      if (err) {
        resolve(returnJson(docs, -1, "系统报错"));
        return;
      }
      if (data.newPwd1 !== data.newPwd) {
        resolve(returnJson(data, -1, "新密码不一致，请重新设置新密码"));
        return;
      }
      if (data.password !== docs.password) {
        resolve(returnJson(docs, -1, "旧密码不一致，请重新输入"));
        return;
      }
      docs.password = data.newPwd;
      db.update({ _id: docs._id }, data, { multi: true }, function(err, docs) {
        if (err) {
          return resolve(returnJson(docs, -1, "系统报错"));
        }
        return resolve(returnJson(docs, 1000));
      });
    });
  });
};
