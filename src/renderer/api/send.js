const dbname = "send";
const errordbname = "errorsend";
import db from "../datastore/index";
import { returnJson } from "../utils/return";
import { EventBus, SEND_IMPORT } from "../utils/EventBus";
import moment from "moment";
import { insertList, findData, findOneData, isNumber } from "./utilApi";
// let doc = {
//   id: 1,
//   password:'admin',
//   user:'admin',
//   name: 'user'
// }
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
    if (data && data.orderId) {
      doc.orderId = data.orderId;
    }
    if (data && data.pricename) {
      doc.companyName = data.pricename;
    }
    db.find(doc).exec(function(err, docs) {
      if (err) {
        resolve(returnJson(docs, -1, "系统报错"));
        return;
      }
      // docs = docs.sort((a, b) => {
      //   return (
      //     moment(b.time, "YYYY-MM-DD").valueOf() -
      //     moment(a.time, "YYYY-MM-DD").valueOf()
      //   );
      // });
      return resolve(returnJson(docs, 1000));
    });
  });
};
/**
 * 失败件结算
 */
export const errorlist = data => {
  data = data || {};
  return new Promise((resolve, reject) => {
    const doc = {
      dbname: errordbname
    };
    if (data.name) {
      doc.userName = data.name || "";
    }
    if (data.orderId) {
      doc.orderId = data.orderId || "";
    }
    db.find(doc).exec(function(err, docs) {
      if (err) {
        resolve(returnJson(docs, -1, "系统报错"));
        return;
      }
      docs = docs.sort((a, b) => {
        return (
          moment(b.time, "YYYY-MM-DD").valueOf() -
          moment(a.time, "YYYY-MM-DD").valueOf()
        );
      });
      return resolve(returnJson(docs, 1000));
    });
  });
};
/**
 * 失败件更新
 * @param {Object} data
 */
export const errorEdit = data => {
  return new Promise((resolve, reject) => {
    data.dbname = dbname;
    data.time = moment(new Date()).format("YYYY-MM-DD");
    db.remove({ dbname: errordbname, _id: data._id }, {}, function(
      err,
      numRemoved
    ) {
      if (err) {
        return resolve(returnJson(numRemoved, -1, "系统报错"));
      }
      delete data._id;
      // 如果没有有id则为插入
      db.insert(data, (err, docs) => {
        if (err) {
          return resolve(returnJson(docs, -1, "系统报错"));
        }
        return resolve(returnJson(docs, 1000));
      });
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
 * 失败件结算
 * @param {*} data
 */
export const errorDel = data => {
  return new Promise((resolve, reject) => {
    if (data._id) {
      db.remove({ dbname: errordbname, _id: data._id }, {}, function(
        err,
        numRemoved
      ) {
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
  return new Promise((resolve, reject) => {
    // 获取运货公司的id
    dataDispose(list).then(async leadList => {
      setTimeout(() => {
        const newLeadList = [...leadList];
        const successData = newLeadList.filter(item => {
          if (!item.remark) {
            item.dbname = dbname;
            return true;
          }
        });
        const errorData = newLeadList.filter(item => {
          if (item.remark) {
            item.dbname = errordbname;
            return true;
          }
        });
        EventBus.$emit(SEND_IMPORT, { successData, errorData });
        resolve(returnJson("", 1000, "获取成功"));
      }, 2000);
    });
  });
};
/**
 * 数据处理
 * @param {Array} list 需处理数据
 * @param {Array} priceList 价格模版数组
 */
export const dataDispose = list => {
  return new Promise(resolve => {
    let i = 1;
    list.forEach(async res => {
      res.updateTime = Date.parse(new Date());
      if (res.time) {
        res.time = moment(excel_time_to_timestamp(res.time)).format(
          "YYYY-MM-DD"
        );
      }
      res.checked = false;
      res.remark = res.remark ? res.remark : "";
      res.orderId = res.orderId ? String(res.orderId) : "";
      if (!res.userId) {
        res.remark += `<div style="color:#f00;">没有此客户,请先设立客户再设置客户价格模版</div>`;
        ++i;
        if (i === list.length) {
          resolve(list);
        }
        return;
      }
      const companyName = res.companyName;
      const doc = {
        dbname: "ucuser",
        userId: res.userId,
        pricename: companyName
      };
      const docData = await findOneData(doc);
      if (docData) {
        res.companyId = docData.companyId;
      }
      if (!res.orderId) {
        res.remark += `<div style="color:#f00;">单号缺失</div>`;
        ++i;
        if (i === list.length) {
          resolve(list);
        }
        return;
      }
      if (!res.companyName) {
        res.remark += `<div style="color:#f00;">无此公司</div>`;
        ++i;
        if (i === list.length) {
          resolve(list);
        }
        return;
      }
      if (!res.userId && !res.companyId) {
        res.remark += `<div style="color:#f00;">此客户为本系统新客户，请先建立客户信息和设置价格模版</div>`;
        ++i;
        if (i === list.length) {
          resolve(list);
        }
        return;
      }
      if (res.userId && !res.companyId) {
        res.remark += `<div style="color:#f00;">未找到此承运公司</div>`;
        ++i;
        if (i === list.length) {
          resolve(list);
        }
        return;
      }
      if (!isNumber(res.kilogram)) {
        res.remark += `<div style="color:#f00;">无此公斤数</div>`;
        ++i;
        if (i === list.length) {
          resolve(list);
        }
        return;
      }
      if (!res.kilogram || (res.kilogram && res.kilogram < 0)) {
        res.remark += `<div style="color:#f00;">此客户本次运费没有重量</div>`;
        ++i;
        if (i === list.length) {
          resolve(list);
        }
        return;
      }
      /**
       * 计算运费
       */
      const kilogram = Math.ceil(res.kilogram);
      res.newkilogram = kilogram;
      let checkedAddress = true;
      let checkedKilogram = true;
      const priceDoc = {
        dbname: "ucuser",
        userId: res.userId,
        companyId: res.companyId
      };
      const priceTemaplate = await findOneData(priceDoc);
      /**
       * 计算价格
       */
      if (priceTemaplate) {
        const priceTemaplateList = priceTemaplate.list;
        priceTemaplateList.forEach(priceData => {
          if (priceData.address === res.address) {
            checkedAddress = false;
            priceData.list.forEach(kilogramList => {
              if (kilogramList.kilogram === kilogram) {
                res.free = kilogramList.price;
                checkedKilogram = false;
                res.checked = true;
              }
            });
          }
        });
        if (checkedAddress) {
          res.remark += `<div style="color:#f00;">客户价格模版内未找到目的地</div>`;
        }
        ++i;
        if (i === list.length) {
          resolve(list);
        }
      }
      if (!checkedAddress && checkedKilogram) {
        res.remark += `<div style="color:#f00;">客户价格模版内无此公斤数</div>`;
      }
      ++i;
      if (i === list.length) {
        resolve(list);
      }
    });
  });
};
/**
 * 查找导入数据
 */
export const sendTemporaryDetail = data => {
  const doc = {
    dbname: "sendTemporary",
    _id: data.id
  };
  return new Promise((resolve, reject) => {
    db.findOne(doc, (err, docs) => {
      if (err) {
        return resolve(returnJson(docs, -1, "系统报错"));
      }
      return resolve(returnJson(docs, 1000));
    });
  });
};
/**
 * 五位数转换日期
 * @param {*} excelTime
 */
export const excel_time_to_timestamp = excelTime => {
  const second = 25569,
    day_timestamp = 24 * 60 * 60 * 1000;
  return (+excelTime - second) * day_timestamp;
};
/**
 * 批量导入成功和失败的数据
 * @param {Array} successdata 成功的数据
 * @param {Array} errordata 失败的数据
 */
export const leadDb = (successdata, errordata) => {
  successdata = successdata.map(res => {
    res.dbname = dbname;
    return res;
  });
  errordata = errordata.map(res => {
    res.dbname = errordbname;
    return res;
  });
  const list = successdata.concat(errordata);
  return insertList(list);
};
