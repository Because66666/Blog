import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",
  theme,
  shouldPrefetch: false,
  locales: {
    "/": {
      lang: "zh-CN",
      title: "Because的博客",
      description: "Because的博客",
    },
  },
  // 扩展页面，添加元数据用于排序
  extendsPage: (page) => {
    // 在 routeMeta 中设置目录信息
    page.routeMeta = {
      ...page.routeMeta,
      title: page.title,
      // 如果页面有日期信息，添加到routeMeta中
      date: page.frontmatter.date,
    };
  },
});
