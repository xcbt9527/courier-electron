const dbname = "price";
import db from "../datastore/index";
import { returnJson } from "../utils/return";
import { findOneData } from "./utilApi";
// let doc = {
//   id: 1,
//   password:'admin',
//   user:'admin',
//   name: 'user'
// }
// this.$db.insert(doc, function(err, new_doc) {
//   'use strict'
//   console.log(err, new_doc)
// })
/**
 * 列表
 */
export const list = data => {
  return new Promise((resolve, reject) => {
    const doc = {
      dbname
    };
    if (data && data.name) {
      doc.name = data.name;
    }
    if (data && data.companyName) {
      doc.companyName = data.companyName;
    }
    db.find(doc).exec(function(err, docs) {
      if (err) {
        resolve(returnJson(docs, -1, "系统报错"));
        return;
      }
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
    data.name = data.name.replace(/\s*/g, "");
    // 如果没有有id则为插入
    if (!data._id) {
      db.insert(data, (err, docs) => {
        if (err) {
          return resolve(returnJson(docs, -1, "系统报错"));
        }
        return resolve(returnJson(docs, 1000));
      });
    } else {
      db.findOne({ _id: data._id }, function(error, doc) {
        if (error) {
          resolve(returnJson(docs, -1, "系统报错"));
          return;
        }
        data.list = data.list && data.list.length > 0 ? data.list : doc.list;
        db.update({ dbname, _id: data._id }, data, { multi: true }, function(
          err,
          docs
        ) {
          if (err) {
            return resolve(returnJson(docs, -1, "系统报错"));
          }
          return resolve(returnJson(docs, 1000));
        });
      });
    }
  });
};
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
 * 删除
 */
export const del = data => {
  return new Promise((resolve, reject) => {
    if (data._id) {
      findOneData({ dbname: "ucuser", priceId: data._id }).then(res => {
        if (res) {
          return resolve(
            returnJson(
              res,
              -1,
              "已有客户使用该模版，请先删除客户设置的价格模版"
            )
          );
        }
        db.remove({ dbname, _id: data._id }, {}, function(err, numRemoved) {
          if (err) {
            return resolve(returnJson(numRemoved, -1, "系统报错"));
          }
          return resolve(returnJson(numRemoved, 1000));
        });
      });
    } else {
      return resolve(returnJson("", 10001, "没有唯一id"));
    }
  });
};
/**
 * 导入
 * @param {*} data
 */
export const exportDown = data => {
  return new Promise((resolve, reject) => {
    resolve();
  });
};
