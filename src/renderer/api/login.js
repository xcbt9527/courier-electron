const dbname = "login";
import db from "../datastore/index";
import { returnJson } from "../utils/return";

export const login = data => {
  return new Promise((resolve, reject) => {
    const doc = {
      dbname,
      username: data.username
    };
    db.findOne(doc, function(err, docs) {
      if (err) {
        resolve(returnJson(docs, -1, "系统报错"));
        return;
      }
      /**
       * 默认admin为系统管理账号
       */
      if (!docs && data.username === "admin") {
        const insertData = Object.assign({}, doc, {
          password: data.password
        });
        db.insert(insertData, function(err, docsUpdate) {
          if (err) {
            resolve(returnJson(docsUpdate, -1, "没有此账号"));
            return;
          }
          return resolve(returnJson(docsUpdate, 1000));
        });
        return;
      } else if (docs.password === data.password) {
        return resolve(returnJson(docs, 1000));
      }
      return resolve(returnJson({}, -1, "请输入正确的账号与密码"));
    });
  });
};

export const reg = data => {
  return new Promise((resolve, reject) => {
    const doc = {
      dbname,
      ...data
    };
    db.insert(doc, function(err, docs) {
      if (err) {
        resolve(returnJson(docs, -1, "系统报错"));
        return;
      }
      return resolve(returnJson(docs, 1000));
    });
  });
};
