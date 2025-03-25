import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/Blog/",

  lang: "zh-CN",
  title: "Because的个人博客",
  description: "Because的个人博客",

  theme,

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
