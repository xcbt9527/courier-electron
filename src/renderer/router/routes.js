import layoutHeaderAside from "@/layout/header-aside";

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require("@/libs/util.import." + process.env.NODE_ENV);

/**
 * 在主框架内显示
 */
const frameIn = [
  {
    path: "/",
    redirect: { name: "index" },
    component: layoutHeaderAside,
    children: [
      // 首页
      {
        path: "index",
        name: "index",
        meta: {
          auth: true,
          title: "生成账单"
        },
        component: _import("system/index")
      },
      // 演示页面
      {
        path: "member",
        name: "member",
        meta: {
          title: "客户管理",
          auth: true
        },
        component: _import("manager/member/index")
      },
      {
        path: "company",
        name: "company",
        meta: {
          title: "承运公司管理",
          auth: true
        },
        component: _import("manager/company/index")
      },
      {
        path: "mailiCost",
        name: "mailiCost",
        meta: {
          title: "寄件管理",
          auth: true
        },
        component: _import("manager/mailiCost/index"),
        children: [
          {
            path: "customer",
            name: "customer",
            redirect: { name: "customerlist" },
            meta: {
              title: "客户价格设置",
              auth: true
            },
            component: _import("manager/otherCost/index"),
            children: [
              {
                path: "customerlist",
                name: "customerlist",
                meta: {
                  title: "客户价格设置",
                  auth: true
                },
                component: _import("manager/mailiCost/customer/index")
              },
              {
                path: "/customerDetails/:id",
                name: "customerDetails",
                meta: {
                  title: "价格设置模版",
                  auth: true
                },
                component: _import("manager/mailiCost/customer/detail")
              }
            ]
          },
          {
            path: "settlementMenu",
            name: "settlement",
            redirect: { name: "/mailiCost/settlement" },
            meta: {
              title: "寄件运费结算",
              auth: true
            },
            component: _import("manager/otherCost/index"),
            children: [
              {
                path: "/mailiCost/settlement",
                name: "settlement",
                meta: {
                  title: "寄件运费结算",
                  auth: true
                },
                component: _import("manager/mailiCost/settlement/index")
              },
              {
                path: "/mailiCost/settlementDetail",
                name: "settlementDetail",
                meta: {
                  title: "寄件运费确认导入",
                  auth: true
                },
                component: _import("manager/mailiCost/settlement/detail/index")
              }
            ]
          },
          {
            path: "/mailiCost/settlementFail",
            name: "settlementFail",
            meta: {
              title: "结算失败件",
              auth: true
            },
            component: _import("manager/mailiCost/settlementFail/index")
          }
        ]
      },
      {
        path: "otherCost",
        name: "otherCost",
        redirect: { name: "otherCostList" },
        meta: {
          title: "杂费入账",
          auth: true
        },
        component: _import("manager/otherCost/index"),
        children: [
          {
            path: "otherCostList",
            name: "otherCostList",
            meta: {
              title: "杂费入账",
              auth: true
            },
            component: _import("manager/otherCost/list")
          },
          {
            path: "/otherCostDetails/:id",
            name: "otherCostDetails",
            meta: {
              title: "杂费导入详情页面",
              auth: true
            },
            component: _import("manager/otherCost/details/index")
          }
        ]
      },
      {
        path: "backup",
        name: "backup",
        meta: {
          title: "系统管理",
          auth: true
        },
        component: _import("manager/backup/index")
      },
      // 系统 前端日志
      {
        path: "log",
        name: "log",
        meta: {
          title: "前端日志",
          auth: true
        },
        component: _import("system/log")
      },
      // 刷新页面 必须保留
      {
        path: "refresh",
        name: "refresh",
        hidden: true,
        component: _import("system/function/refresh")
      },
      // 页面重定向 必须保留
      {
        path: "redirect/:route*",
        name: "redirect",
        hidden: true,
        component: _import("system/function/redirect")
      }
    ]
  }
];

/**
 * 在主框架之外显示
 */
const frameOut = [
  // 登录
  {
    path: "/login",
    name: "login",
    component: _import("system/login")
  }
];

/**
 * 错误页面
 */
const errorPage = [
  {
    path: "*",
    name: "404",
    component: _import("system/error/404")
  }
];

// 导出需要显示菜单的
export const frameInRoutes = frameIn;

// 重新组织后导出
export default [...frameIn, ...frameOut, ...errorPage];
