const dbname = "ucuser";
import db from "../datastore/index";
import { returnJson } from "../utils/return";
/**
 * 查找
 * @param {*} data
 */
export const findData = data => {
  return new Promise((resolve, reject) => {
    db.findOne({ _id: data.id }, function(error, doc) {
      if (error) {
        resolve(returnJson(error, -1, "系统报错"));
        return;
      }
      resolve(returnJson(doc, 1000, "获取成功"));
    });
  });
};
/**
 * 列表
 */
export const list = data => {
  return new Promise((resolve, reject) => {
    const doc = {
      dbname
    };
    if (data && data.name) {
      doc.userName = data.name;
    }
    if (data && data.pricename) {
      doc.pricename = data.pricename;
    }
    db.find(doc).exec(function(err, docs) {
      if (err) {
        resolve(returnJson(docs, -1, "系统报错"));
        return;
      }
      // docs = docs.sort((a, b) => {
      //   return b.time - a.time;
      // });
      return resolve(returnJson(docs, 1000));
    });
  });
};
/**
 * 更新
 * @param {Object} data 参数
 * @param {String}  data.id id唯一
 * @param {String}  data.name 客户名称
 * @param {String}  data.remark 备注
 */
export const edit = data => {
  return new Promise((resolve, reject) => {
    data.dbname = dbname;
    // 如果没有有id则为插入
    if (!data._id) {
      db.find(
        { dbname, companyId: data.companyId, userId: data.userId },
        (usererr, userList) => {
          if (usererr) {
            return resolve(returnJson(userList, -1, "系统报错"));
          }
          if (userList.length > 0) {
            return resolve(returnJson(userList, -1, "已存在该客户的同一模板"));
          }
          data.time = new Date().getTime();
          db.insert(data, (err, docs) => {
            if (err) {
              return resolve(returnJson(docs, -1, "系统报错"));
            }
            return resolve(returnJson(docs, 1000));
          });
        }
      );
    } else {
      data.time = new Date().getTime();
      db.update({ dbname, _id: data._id }, data, { upsert: true }, function(
        err,
        docs
      ) {
        if (err) {
          return resolve(returnJson(docs, -1, "系统报错"));
        }
        return resolve(returnJson(docs, 1000));
      });
    }
  });
};

export const del = data => {
  return new Promise((resolve, reject) => {
    if (data._id) {
      db.remove({ dbname, _id: data._id }, {}, function(err, numRemoved) {
        if (err) {
          return resolve(returnJson(numRemoved, -1, "系统报错"));
        }
        return resolve(returnJson(numRemoved, 1000));
      });
    } else {
      return resolve(returnJson("", 10001, "没有唯一id"));
    }
  });
};
