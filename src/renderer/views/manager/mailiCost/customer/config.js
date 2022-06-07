export const config = data => {
  data = data
    ? data
    : {
        title: "新建",
        userList: [],
        priceList: [],
        list: [],
        formData: {
          userId: "",
          userName: "",
          companyId: "",
          pricename: ""
        }
      };
  return {
    title: "",
    labelWidth: "100px",
    list: data.list,
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
      }
    ],
    formData: data.formData,
    rules: {
      userId: [{ required: true, message: "请选择客户", trigger: "blur" }],
      companyId: [
        { required: true, message: "请选中承运公司", trigger: "blur" }
      ]
    },
    listRules: {
      list: [{ required: true, message: "请上传价格模版", trigger: "blur" }]
    }
  };
};
