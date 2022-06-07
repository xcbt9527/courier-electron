export const config = data => {
  data = data
    ? data
    : {
        title: "新建",
        userList: [],
        companyList: [],
        formData: {
          userId: "",
          userName: "",
          companyId: "",
          companyName: "",
          kilogram: "",
          orderId: "",
          free: ""
        }
      };
  return {
    title: data.title,
    labelWidth: "100px",
    formList: [
      {
        label: "客户名称",
        prop: "userId",
        type: "select",
        data: {
          id: "_id",
          name: "name",
          list: data.userList
        }
      },
      {
        label: "承运公司",
        prop: "companyId",
        type: "select",
        data: {
          id: "_id",
          name: "name",
          list: data.companyList
        }
      },
      {
        label: "重量(kg)",
        prop: "kilogram",
        type: "input"
      },
      {
        label: "运单号",
        prop: "orderId",
        type: "input"
      },
      {
        label: "金额",
        prop: "free",
        type: "input"
      }
    ],
    formData: data.formData,
    rules: {
      userId: [{ required: true, message: "请选择客户", trigger: "blur" }],
      companyName: [{ required: true, message: "请选择承运公司", trigger: "blur" }],
      kilogram: [{ required: true, message: "请输入重量", trigger: "blur" }],
      free: [{ required: true, message: "请输入金额", trigger: "blur" }],
      orderId: [{ required: true, message: "请输入运单号", trigger: "blur" }]
    }
  };
};
