// 菜单 侧边栏
export default [
  // { path: '/index', title: '首页', icon: 'home' },
  { path: "/index", title: "生成账单" },
  { path: "/member", title: "客户管理" },
  { path: "/company", title: "承运公司管理" },
  {
    path: "/mailiCost",
    title: "寄件管理",
    children: [
      {
        path: "/mailiCost/customer",
        title: "客户价格设置"
      },
      {
        path: "/mailiCost/settlement",
        title: "寄件运费结算"
      },
      {
        path: "/mailiCost/settlementFail",
        title: "结算失败件"
      }
    ]
  },
  { path: "/otherCost", title: "杂费入账" },
  // { path: '/account', title: '生成账单' },
  { path: "/backup", title: "系统管理" }
];
