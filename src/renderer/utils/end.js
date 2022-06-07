
import moment from "moment";
const endDateStr = '2022-7-10';
const beginDateStr = '2022-6-7';
// 试用
export const trial = () => {
 var curDate = new Date(),
  beginDate = new Date(moment(beginDateStr)),
  endDate = new Date(moment(endDateStr));
 if (curDate >= beginDate && curDate <= endDate) {
  return true;
 }
 return false;
};