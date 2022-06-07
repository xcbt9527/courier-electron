const dbname = "othercharge";
import db from "../datastore/index";
import { returnJson } from "../utils/return";
import { insertList } from "./utilApi";
import moment from "moment";
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
    if (data && data.userName) {
      doc.userName = new RegExp(data.userName, "i");
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
    data.time = moment(new Date()).format("YYYY-MM-DD");
    // 如果没有有id则为插入
    if (!data._id) {
      db.insert(data, (err, docs) => {
        if (err) {
          return resolve(returnJson(docs, -1, "系统报错"));
        }
        return resolve(returnJson(docs, 1000));
      });
    } else {
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
/**
 * 导入数据
 */
export const lead = list => {
  const data = {
    dbname: "otherchargeTemporary",
    list
  };
  list.forEach(res => {
    if (!res.userId) {
      res.remind = "没有此客户，不允导入。";
    }
    if (!res.amount) {
      res.remind = `${res.remind}没有产生费用`;
    }
    res.time = moment(new Date()).format("YYYY-MM-DD");
  });
  return new Promise((resolve, reject) => {
    db.insert(data, (err, docs) => {
      if (err) {
        return resolve(returnJson(docs, -1, "系统报错"));
      }
      return resolve(returnJson(docs, 1000));
    });
  });
};
/**
 * 导入数据列表
 */
export const downList = data => {
  const doc = {
    dbname: "otherchargeTemporary",
    _id: data.id
  };
  return new Promise((resolve, reject) => {
    db.find(doc).exec(function(err, docs) {
      if (err) {
        resolve(returnJson(docs, -1, "系统报错"));
        return;
      }
      let list = [];
      if (docs.length > 0) {
        docs.forEach(item => {
          list = list.concat(item.list);
        });
      }
      return resolve(returnJson(list, 1000));
    });
  });
};
/**
 * 导入数据
 * @param {Array} data 数组
 */
export const downOhter = data => {
  return new Promise((resolve, reject) => {
    /**
     * 判断如果没有此客户，自动为其创建
     */
    data.list = data.list.filter(res => {
      res.dbname = dbname;
      if (res.userId) {
        return true;
      } else {
        return false;
      }
    });
    /**
     * 插入杂费
     */
    if (data.list.length === 0) {
      return resolve(returnJson("", -1, "没有可导入数据"));
    }
    insertList(data.list)
      .then(res => {
        if (res.length === data.list.length) {
          db.remove(
            { dbname: "otherchargeTemporary" },
            { multi: true },
            function(err, numRemoved) {
              if (err) {
                return resolve(returnJson(numRemoved, -1, "系统报错"));
              }
              return resolve(returnJson(res, 1000));
            }
          );
        } else {
          return resolve(returnJson(res, -1, "导入数据不正确，请联系管理员"));
        }
      })
      .catch(e => {
        return resolve(returnJson(e, -1, "系统报错"));
      });
  });
};
