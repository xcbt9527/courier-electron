export const tableConfig = {
  columns: [
    {
      title: "客户名称",
      key: "userName",
      type: "text"
    },
    {
      title: "运单号",
      key: "orderId",
      type: "text"
    },
    {
      title: "承运公司",
      key: "companyName",
      type: "text"
    },
    {
      title: "重量(kg)",
      key: "kilogram",
      type: "text"
    },
    {
      title: "错误信息",
      key: "remark",
      type: "html"
    },
    {
      title: "收录时间",
      key: "time",
      type: "text"
    }
  ],
  options: {
    align: "center",
    border: true,
    loading: true,
    loadingOptions: {
      text: "拼命加载中",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.8)"
    }
  },
  data: [],
  action: [
    {
      event: "Del",
      type: "text",
      title: "删除"
    }
  ],
  page: {
    currentPage: 1,
    pageSize: 10,
    pageSizes: [10, 20, 30, 40, 50, 100],
    pageTotal: 1
  },
  formOptions: {
    labelWidth: "80px",
    labelPosition: "left",
    saveLoading: false
  },
  editTemplate: {
    date: {
      title: "日期",
      value: ""
    },
    name: {
      title: "姓名",
      value: ""
    },
    address: {
      title: "地址",
      value: ""
    },
    forbidEdit: {
      title: "禁用按钮",
      value: false,
      component: {
        show: false
      }
    },
    showEditButton: {
      title: "显示按钮",
      value: true,
      component: {
        show: false
      }
    }
  }
};
export const tableConfigError = {
  columns: [
    {
      title: "客户名称",
      key: "userName",
      type: "text"
    },
    {
      title: "运单号",
      key: "orderId",
      type: "text"
    },
    {
      title: "承运公司",
      key: "companyName",
      type: "text"
    },
    {
      title: "重量(kg)",
      key: "kilogram",
      type: "text"
    },
    {
      title: "错误信息",
      key: "remark",
      type: "html"
    },
    {
      title: "收录时间",
      key: "time",
      type: "text"
    }
  ],
  options: {
    align: "center",
    border: true,
    loading: true,
    loadingOptions: {
      text: "拼命加载中",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.8)"
    }
  },
  data: [],
  action: [
    {
      event: "Del",
      type: "text",
      title: "删除"
    }
  ],
  page: {
    currentPage: 1,
    pageSize: 10,
    pageSizes: [10, 20, 30, 40, 50, 100],
    pageTotal: 1
  },
  formOptions: {
    labelWidth: "80px",
    labelPosition: "left",
    saveLoading: false
  },
  editTemplate: {
    date: {
      title: "日期",
      value: ""
    },
    name: {
      title: "姓名",
      value: ""
    },
    address: {
      title: "地址",
      value: ""
    },
    forbidEdit: {
      title: "禁用按钮",
      value: false,
      component: {
        show: false
      }
    },
    showEditButton: {
      title: "显示按钮",
      value: true,
      component: {
        show: false
      }
    }
  }
};

export const action = [
  {
    event: "Del",
    type: "text",
    title: "删除"
  }
];
