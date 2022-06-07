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
    const dbSearch = [{ dbname: "send" }, { dbname: "othercharge" }];
    dbSearch.forEach(res => {
      if (data && data.userName) {
        res.userName = data.userName;
      }
    });
    const doc = {
      $or: dbSearch
    };
    db.find(doc).exec(function(err, docs) {
      if (err) {
        resolve(returnJson(docs, -1, "系统报错"));
        return;
      }
      var hash = {};
      var i = 0;
      var newArr = [];
      docs.forEach(function(item) {
        var userId = item.userId;
        if (hash[userId]) {
          newArr[hash[userId] - 1].data.push(item);
        } else {
          hash[userId] = ++i;
          const itemObj = Object.assign({}, item, {
            data: []
          });
          itemObj.data.push(item);
          newArr.push(itemObj);
        }
      });
      newArr.forEach(res => {
        res.free = 0;
        res.sendFree = 0;
        res.otherchargeFree = 0;
        res.data.forEach(ret => {
          if (ret.dbname === "send") {
            res.free += Number(ret.free);
            res.sendFree += Number(ret.free);
          } else if (ret.dbname === "othercharge") {
            res.free += Number(ret.amount);
            res.otherchargeFree += Number(ret.amount);
          }
        });
        const sendList = res.data.filter(
          filterItem => filterItem.dbname === "send"
        );
        const otherchargeList = res.data.filter(
          filterItem => filterItem.dbname === "othercharge"
        );
        res.data = [...sendList, ...otherchargeList];
        res.free = res.free ? res.free.toFixed(2) : "";
        res.sendFree = res.sendFree ? res.sendFree.toFixed(2) : "";
        res.otherchargeFree = res.otherchargeFree
          ? res.otherchargeFree.toFixed(2)
          : "";
      });
      return resolve(returnJson(newArr, 1000));
    });
  });
};
