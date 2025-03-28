import { defineClientConfig } from "@vuepress/client";
import MusicPlayer from "./components/MusicPlayer.vue";
import { defineCatalogInfoGetter } from "@vuepress/plugin-catalog/client";

// 定义目录信息获取器，从元信息中提取标题、日期和排序信息
defineCatalogInfoGetter((meta) => {
  if (typeof meta.title === 'string') {
    return {
      title: meta.title,
      // 如果有日期信息，将其作为排序依据
      // 使用负数时间戳使较新的日期（时间戳较大）排在前面
      order: meta.date && typeof meta.date === 'string' ? -new Date(meta.date).getTime() : undefined
    };
  }
  return null;
});

export default defineClientConfig({
  enhance({ app }) {
    app.component("MusicPlayer", MusicPlayer);
  },
}); 