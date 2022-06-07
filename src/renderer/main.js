import Vue from "vue";
import i18n from "./i18n";
import axios from "axios";

import App from "./App";

// 核心插件
import d2Admin from "@/plugin/d2admin";
// store
import store from "./store";

// 菜单和路由设置
import router from "./router";
import menuHeader from "@/menu/header";
import menuAside from "@/menu/aside";
import { frameInRoutes } from "@/router/routes";
import { findData } from "./utils/apiFile";
findData();
import { ipcMain } from "electron";
// ipcMain.on("info", (event, arg) => {
//   console.log(arg);
//   store.dispatch('d2admin/log/push', {
//     message: data
//   })
// });
if (process.env.NODE_ENV === "development") {
  require("./mock/index");
}
import { apiFile } from "./utils/apiFile";
Vue.prototype.$api = apiFile;
// 核心插件
Vue.use(d2Admin);
if (!process.env.IS_WEB) Vue.use(require("vue-electron"));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;
// 本地数据库
import db from "./datastore/index";
Vue.prototype.$db = db;
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  i18n,
  template: "<App/>",
  created() {
    // 处理路由 得到每一级的路由设置
    this.$store.commit("d2admin/page/init", frameInRoutes);
    // 设置顶栏菜单
    this.$store.commit("d2admin/menu/headerSet", menuHeader);
    // 设置侧边栏菜单
    this.$store.commit("d2admin/menu/asideSet", menuAside);
    // 初始化菜单搜索功能
    this.$store.commit("d2admin/search/init", menuHeader);
  },
  mounted() {
    // 展示系统信息
    this.$store.commit("d2admin/releases/versionShow");
    // 用户登录后从数据库加载一系列的设置
    this.$store.dispatch("d2admin/account/load");
    // 获取并记录用户 UA
    this.$store.commit("d2admin/ua/get");
    // 初始化全屏监听
    this.$store.dispatch("d2admin/fullscreen/listen");
  }
}).$mount("#app");
