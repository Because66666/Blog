import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  
  "/": [
    {
      text:"主页",
      icon:"house",
      link:"/",
    },
    {
      text:"介绍",
      icon:"id-card",
      link:"/portfolio",
    },
    {
      text: "音乐",
      icon: "music",
      link: "/music",
    },
    {
      text: "视频",
      icon: "video",
      prefix: "videos/",
      link: "videos/",
      children: "structure",
    },
    {
      text:"编程",
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
