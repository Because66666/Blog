import { navbar } from "vuepress-theme-hope";

export default navbar([
  {
    text:"主页",
    icon:"house",
    link:"/",
  },
  {
    text:"介绍",
    icon:"id-card",
    link:"portfolio"
  },
  {
    text:"编程历史",
    icon:"laptop-code",
    link:"/intro",
  },
  {
    text: "文章",
    icon: "book",
    link:"/posts/"
  },
  {
    text: "音乐",
    icon: "music",
    link: "/music"
  }
]);
