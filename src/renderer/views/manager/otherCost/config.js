export const config = data => {
  data = data
    ? data
    : {
        title: "新建",
        userList: [],
        formData: {
          userId: "",
          userName: "",
          amount: "",
          info: "",
          remark: ""
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
        label: "金额",
        prop: "amount",
        type: "input"
      },
      {
        label: "项目信息",
        prop: "info",
        type: "input"
      },
      {
        label: "备注",
        prop: "remark",
        type: "input"
      }
    ],
    formData: data.formData,
    rules: {
      userId: [{ required: true, message: "请选择客户", trigger: "blur" }],
      amount: [
        {
          required: true,
          message: "正数金额代表向客户收取，负数金额代表支付给客户",
          trigger: "blur"
        }
        //{ required: true, message: '请填写金额', trigger: 'change' }
      ],
      info: [{ required: true, message: "请填写项目信息", trigger: "blur" }]
    }
  };
};
