export const config = data => {
  data = data || {
    title: "",
    formData: {
      name: "",
      companyId: "",
      companyName: ""
    },
    companyList: []
  };
  return {
    title: data.title,
    formData: data.formData,
    labelWidth: "120px",
    formList: [
      {
        label: "模版名称:",
        prop: "name",
        type: "input"
      },
      {
        label: "承运公司:",
        prop: "companyId",
        type: "select",
        data: {
          id: "_id",
          name: "name",
          list: data.companyList
        }
      }
    ],
    rules: {
      name: [{ required: true, message: "请填写模版名称", trigger: "blur" }],
      companyId: [
        { required: true, message: "请选择承运公司", trigger: "blur" }
      ]
    }
  };
};
