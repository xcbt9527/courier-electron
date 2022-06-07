const dbname = "carrier";
import db from "../datastore/index";
import { returnJson } from "../utils/return";
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
      doc.name = new RegExp(data.name, "i");
    }
    if (data && data.phone) {
      doc.phone = new RegExp(data.phone, "i");
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
    data.name = data.name.replace(/\s*/g, "");
    // 如果没有有id则为插入
    if (!data._id) {
      db.findOne({ dbname, name: data.name }, (itemError, info) => {
        if (itemError) {
          return resolve(returnJson(info, -1, "系统报错"));
        }
        if (info) {
          return resolve(returnJson(info, 10001, "承运公司已存在"));
        }
        data.time = new Date().getTime();
        db.insert(data, (err, docs) => {
          if (err) {
            return resolve(returnJson(docs, -1, "系统报错"));
          }
          return resolve(returnJson(docs, 1000));
        });
      });
    } else {
      db.findOne({ dbname, name: data.name }, (itemError, info) => {
        if (itemError) {
          return resolve(returnJson(info, -1, "系统报错"));
        }
        db.update(
          { dbname, _id: data._id },
          {
            $set: {
              name: data.name,
              remark: data.remark,
              time: new Date().getTime()
            }
          },
          { upsert: true },
          function(err, docs) {
            if (err) {
              console.log(err);
              console.log(docs);
              return resolve(returnJson(docs, -1, "系统报错"));
            }
            return resolve(returnJson(docs, 1000));
          }
        );
      });
    }
  });
};

export const del = data => {
  return new Promise((resolve, reject) => {
    if (data._id) {
      const doc = {
        dbname: "ucuser",
        companyId: data._id
      };
      db.find(doc, {}, function(err, docs) {
        if (docs.length > 0) {
          return resolve(returnJson(docs, -1, "不可删除！客户价格已设置"));
          return;
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
