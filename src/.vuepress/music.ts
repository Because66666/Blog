interface MusicItem {
  name: string;
  artist: string;
  url: string;
  cover: string;
}

// 默认封面图片
const defaultCovers = {
  anime: "https://img.picui.cn/free/2025/03/28/67e67c860fa17.png", // 动漫音乐默认封面
  game: "https://img.picui.cn/free/2025/03/28/67e67c86108b7.png",  // 游戏音乐默认封面
  piano: "https://img.picui.cn/free/2025/03/28/67e67c85e4b7b.png", // 钢琴曲默认封面
  chinese: "https://img.picui.cn/free/2025/03/28/67e67c87327ad.png", // 中文歌曲默认封面
  movie: "https://img.picui.cn/free/2025/03/28/67e67c860fc00.png",  // 电影音乐默认封面
  default: "https://img.picui.cn/free/2025/03/28/67e67c84ca6f4.png" // 通用默认封面
};

// 获取类别封面
function getCoverByCategory(filename: string): string {
  if (filename.includes("超炮") || filename.includes("某科学的超电磁炮") || filename.includes("railgun")) {
    return defaultCovers.anime;
  } else if (filename.includes("原神") || filename.includes("蒙德") || filename.includes("须弥") || filename.includes("海祇")) {
    return defaultCovers.game;
  } else if (filename.includes("钢琴") || filename.includes("夜的钢琴")) {
    return defaultCovers.piano;
  } else if (filename.includes("千与千寻") || filename.includes("铃芽之旅") || filename.includes("你的名字")) {
    return defaultCovers.movie;
  } else if (filename.includes("荡起双桨") || filename.includes("童年") || filename.includes("成都") || filename.includes("十年") || filename.includes("将进酒")) {
    return defaultCovers.chinese;
  } else {
    return defaultCovers.default;
  }
}

// 获取歌手信息
function getArtistByFilename(filename: string): string {
  if (filename.includes(" - ")) {
    return filename.split(" - ")[0];
  } else if (filename.includes("——")) {
    return filename.split("——")[1];
  } else if (filename.includes("Disc")) {
    return "原神OST";
  } else if (filename.includes("超炮")) {
    return "科学超电磁炮系列";
  } else if (filename.includes("原神")) {
    return "原神OST";
  } else if (filename.includes("霍格沃兹") || filename.includes("海德薇")) {
    return "哈利波特OST";
  } else if (filename.includes("铃芽之旅") || filename.includes("天气之子")) {
    return "新海诚电影OST";
  } else if (filename.includes("千与千寻")) {
    return "宫崎骏电影OST";
  } else {
    return "未知艺术家";
  }
}

// 美化歌曲名称
function beautifyTitle(filename: string): string {
  let title = filename;
  
  // 移除文件扩展名
  title = title.replace(".mp3", "");
  
  // 处理带有艺术家的情况
  if (title.includes(" - ")) {
    title = title.split(" - ")[1];
  }
  
  // 处理带有哔哩哔哩标识的情况
  title = title.replace("_哔哩哔哩_bilibili", "");
  
  // 处理特殊标题格式
  if (title.includes("超炮")) {
    const parts = title.split(",");
    if (parts.length > 1) {
      title = `科学超电磁炮 ${parts[0].replace("超炮", "")} ${parts[1]}`;
    }
  }
  
  return title;
}

// 硬编码获取音乐文件名的备选列表
// 这个列表只是作为备用，实际会通过客户端代码动态获取
const fallbackMusicFiles = [
  "兰纳罗合唱.mp3",
  "大梦的曲调.mp3",
  "恒那兰那（夜晚1）.mp3",
  "恒那兰那（夜晚2）.mp3",
  "无忧节.mp3",
  "海祇之岛.mp3",
  "溢彩华庭.mp3",
  "轻链.mp3",
  "须弥（翻新）.mp3",
  "净善相继.mp3",
  "希穆兰卡-赐福森林.mp3",
  "幻想真境剧诗.mp3",
  "恒那兰那（白天1）.mp3",
  "未行之路.mp3",
  "原神-蒙德.mp3",
  "超炮2,ED1_哔哩哔哩_bilibili.mp3",
  "超炮2,ED2.5_哔哩哔哩_bilibili.mp3",
  "超炮2,ED2_哔哩哔哩_bilibili.mp3",
  "超炮2,OP1_哔哩哔哩_bilibili.mp3",
  "超炮2,OP2_哔哩哔哩_bilibili.mp3",
  "超炮3,ED1_哔哩哔哩_bilibili.mp3",
  "超炮3,ED2_哔哩哔哩_bilibili.mp3",
  "超炮3,OP1_哔哩哔哩_bilibili.mp3",
  "超炮3,OP2_哔哩哔哩_bilibili.mp3",
  "超炮OVA,ED_哔哩哔哩_bilibili.mp3",
  "超炮OVA,OP_哔哩哔哩_bilibili.mp3",
  "only my railgun钢琴曲.mp3",
  "something just like this.mp3",
  "梦的光点.mp3",
  "超炮1,ED1-1_哔哩哔哩_bilibili.mp3",
  "超炮1,ED1-2_哔哩哔哩_bilibili.mp3",
  "超炮1,ED2_哔哩哔哩_bilibili.mp3",
  "超炮1,OP1_哔哩哔哩_bilibili.mp3",
  "超炮1,OP2_哔哩哔哩_bilibili.mp3",
  "超炮2,ED1.5(上琴)_哔哩哔哩_bilibili.mp3",
  "超炮2,ED1.5（真上琴）_哔哩哔哩_bilibili.mp3",
  "铃芽之旅-钢琴组曲.mp3",
  "你的名字MV.mp3",
  "千与千寻钢琴曲.mp3",
  "夜航星.mp3",
  "少年中国说.mp3",
  "海德薇变奏曲.mp3",
  "霍格沃兹主题曲.mp3",
  "马步谣——双笙.mp3",
  "dream it possible.mp3",
  "千与千寻 与你同在.mp3",
  "千与千寻英文歌曲.mp3",
  "天气之子片中曲(1).mp3",
  "将进酒-凤凰传奇.mp3",
  "某科学的超电磁炮.mp3",
  "铃芽之旅MV .mp3",
  "annie wonderland.mp3",
  "α波オルゴール - 最初から今まで.mp3",
  "中国人民解放军军乐团 - 光荣啊!中国共青团.mp3",
  "岳阳楼记.mp3",
  "成都.mp3",
  "未知歌手 - 军港之夜 (葫芦丝).mp3",
  "罗大佑 - 童年.mp3",
  "蓝天合唱团 - 让我们荡起双桨.mp3",
  "铃芽之旅主题曲.mp3",
  "陈奕迅 - 十年 (Live).mp3",
  "雲翼星辰 - 黑暗森林.mp3",
  "孤勇者.mp3",
  "最伟大的作品.mp3",
  "某科学的超电磁炮T.mp3"
];

// API接口获取音乐文件列表
async function fetchMusicFiles(): Promise<string[]> {
  // 在客户端环境下执行
  if (typeof window !== 'undefined') {
    try {
      // 尝试从服务器端获取音乐文件列表
      const response = await fetch('./assets/music-list.json');
      if (response.ok) {
        const data = await response.json();
        return data.files || [];
      }
    } catch (error) {
      console.error('获取音乐文件列表失败:', error);
    }
    
    // 如果无法从服务器获取，则使用备选列表
    return fallbackMusicFiles;
  } else {
    // 服务器端渲染时返回备选列表
    return fallbackMusicFiles;
  }
}

// 动态生成音乐列表
export async function getMusicList(): Promise<MusicItem[]> {
  const files = await fetchMusicFiles();
  return files.map(filename => ({
    name: beautifyTitle(filename),
    artist: getArtistByFilename(filename),
    url: `/assets/music/${filename}`,
    cover: getCoverByCategory(filename)
  }));
}

// 导出默认音乐列表（用于初始化）
export const musicList: MusicItem[] = fallbackMusicFiles.map(filename => ({
  name: beautifyTitle(filename),
  artist: getArtistByFilename(filename),
  url: `/assets/music/${filename}`,
  cover: getCoverByCategory(filename)
}));
