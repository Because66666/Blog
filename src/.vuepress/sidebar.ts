import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    {
      text:"主页",
      icon:"house",
      link:"/",
    },
    {
      text:"编程历史",
      icon:"laptop-code",
      link:"/intro",
    },
    {
      text: "文章",
      icon: "book",
      prefix: "posts/",
      link: "posts/",
      children: "structure",
    },
  ],
});
