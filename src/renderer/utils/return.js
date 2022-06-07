/**
 * json返回格式
 */
export const returnJson = (data, code, msg) => {
  return {
    data,
    code,
    msg: msg ? msg : ""
  };
};
