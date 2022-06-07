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
          orderId: "",
          free: ""
        }
      };
  return {
    title: "",
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
        label: "运单号",
        prop: "orderId",
        type: "input"
      },
      {
        label: "重量(KG)",
        prop: "kilogram",
        type: "input"
      },
      {
        label: "金额(元)",
        prop: "free",
        type: "input"
      }
    ],
    formData: data.formData,
    rules: {
      userId: [{ required: true, message: "请选择客户", trigger: "blur" }],
      companyId: [
        { required: true, message: "请选择承运公司", trigger: "blur" }
      ],
      free: [{ required: true, message: "请输入金额", trigger: "blur" }],
      orderId: [{ required: true, message: "请输入运单号", trigger: "blur" }],
      kilogram: [{ required: true, message: "请输入重量", trigger: "blur" }]
    }
  };
};
