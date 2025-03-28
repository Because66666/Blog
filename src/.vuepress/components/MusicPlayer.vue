<template>
  <div class="music-player">
    <h2>{{ title }}</h2>
    
    <div class="search-and-filter">
      <div class="category-filter">
        <button 
          v-for="category in categories" 
          :key="category.value"
          :class="{ active: currentCategory === category.value }"
          @click="currentCategory = category.value"
        >
          {{ category.label }}
        </button>
      </div>
      
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="搜索音乐..."
          @input="currentPage = 1"
        />
        <button class="clear-btn" v-if="searchQuery" @click="searchQuery = ''">×</button>
      </div>
    </div>
    
    <div class="music-content">
      <div class="music-list-container">
        <div class="music-list">
          <div 
            v-for="(item, index) in paginatedMusicList" 
            :key="index" 
            class="music-item"
            :class="{ 'active': currentIndex === getOriginalIndex(index) }"
            @click="selectTrack(getOriginalIndex(index))"
          >
            <div class="music-cover">
              <img :src="item.cover" :alt="item.name">
              <div class="play-icon" v-if="currentIndex !== getOriginalIndex(index)">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </div>
              <div class="pause-icon" v-else>
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="6" y="4" width="4" height="16"></rect>
                  <rect x="14" y="4" width="4" height="16"></rect>
                </svg>
              </div>
            </div>
            <div class="music-info">
              <div class="music-name">{{ item.name }}</div>
              <div class="music-artist">{{ item.artist }}</div>
            </div>
          </div>
        </div>
        
        <div class="pagination" v-if="totalPages > 1">
          <button 
            @click="currentPage > 1 && (currentPage--)" 
            :disabled="currentPage === 1"
          >
            上一页
          </button>
          <span>{{ currentPage }} / {{ totalPages }}</span>
          <button 
            @click="currentPage < totalPages && (currentPage++)" 
            :disabled="currentPage === totalPages"
          >
            下一页
          </button>
        </div>
      </div>
      
      <div class="player-container" v-if="currentTrack">
        <div class="now-playing">
          <img :src="currentTrack.cover" :alt="currentTrack.name" class="mini-cover">
          <div class="now-playing-info">
            <div class="now-playing-name">{{ currentTrack.name }}</div>
            <div class="now-playing-artist">{{ currentTrack.artist }}</div>
          </div>
        </div>
        <VidStack
          ref="audioPlayer"
          :key="currentTrack.url"
          :src="currentTrack.url"
          :title="currentTrack.name"
          :poster="currentTrack.cover"
          :autoplay="true"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, onMounted, nextTick } from 'vue';
import { musicList, getMusicList } from '../music';

const props = defineProps({
  title: {
    type: String,
    default: '我的音乐库'
  }
});

// 分类设置
const categories = [
  { label: '全部', value: 'all' },
  { label: '动漫', value: 'anime' },
  { label: '游戏', value: 'game' },
  { label: '钢琴', value: 'piano' },
  { label: '电影', value: 'movie' },
  { label: '中文', value: 'chinese' }
];

const currentCategory = ref('all');
const searchQuery = ref('');
const currentIndex = ref(-1);
const currentPage = ref(1);
const itemsPerPage = 10;
const audioPlayer = ref(null);
const dynamicMusicList = ref([...musicList]); // 初始化为默认音乐列表
const isLoading = ref(false);

// 处理音乐播放结束，播放下一首
const handleTrackEnd = () => {
  // 检查是否处于单曲循环模式
  const mediaElement = audioPlayer.value?.$el?.querySelector('audio, video');
  if (mediaElement?.loop) {
    // 如果是单曲循环模式，不执行下一曲逻辑
    return;
  }
  
  // 不是单曲循环模式，播放下一首
  if (currentIndex.value < dynamicMusicList.value.length - 1) {
    // 还有下一首歌，播放下一首
    selectTrack(currentIndex.value + 1);
  }
};

// 组件加载时获取动态音乐列表
onMounted(async () => {
  try {
    isLoading.value = true;
    const musicItems = await getMusicList();
    if (musicItems && musicItems.length > 0) {
      dynamicMusicList.value = musicItems;
    }
    
    // 在组件挂载后设置媒体元素的ended事件监听
    nextTick(() => {
      setupMediaElementListener();
    });
  } catch (error) {
    console.error('加载音乐列表失败:', error);
  } finally {
    isLoading.value = false;
  }
});

// 设置媒体元素的事件监听
const setupMediaElementListener = () => {
  // 延迟一点时间确保DOM已更新
  setTimeout(() => {
    if (audioPlayer.value && audioPlayer.value.$el) {
      const mediaElement = audioPlayer.value.$el.querySelector('audio, video');
      if (mediaElement) {
        // 移除之前可能存在的监听
        mediaElement.removeEventListener('ended', handleTrackEnd);
        // 添加新的监听
        mediaElement.addEventListener('ended', handleTrackEnd);
        console.log('已设置音频结束事件监听器');
      }
    }
  }, 500);
};

// 当前曲目改变时重新设置事件监听
watchEffect(() => {
  if (currentIndex.value >= 0) {
    nextTick(() => {
      setupMediaElementListener();
    });
  }
});

// 根据分类和搜索过滤音乐列表
const filteredMusicList = computed(() => {
  let result = [...dynamicMusicList.value];
  
  // 分类过滤
  if (currentCategory.value !== 'all') {
    result = result.filter(item => {
      switch (currentCategory.value) {
        case 'anime':
          return item.name.includes('科学超电磁炮') || item.name.includes('railgun') ||
                 item.artist.includes('科学超电磁炮');
        case 'game':
          return item.name.includes('原神') || item.name.includes('蒙德') || 
                 item.name.includes('须弥') || item.name.includes('海祇') ||
                 item.artist.includes('原神');
        case 'piano':
          return item.name.includes('钢琴');
        case 'movie':
          return item.name.includes('千与千寻') || item.name.includes('铃芽之旅') || 
                 item.name.includes('你的名字') || item.name.includes('天气之子') ||
                 item.artist.includes('电影');
        case 'chinese':
          return (item.artist.includes('中国') || item.name.includes('让我们荡起双桨') || 
                 item.name.includes('童年') || item.name.includes('成都') || 
                 item.name.includes('十年') || item.name.includes('将进酒') ||
                 item.name.includes('少年中国说') || item.name.includes('孤勇者') ||
                 item.name.includes('最伟大的作品')) && 
                 !item.name.includes('railgun');
        default:
          return true;
      }
    });
  }
  
  // 搜索过滤
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(item => 
      item.name.toLowerCase().includes(query) || 
      item.artist.toLowerCase().includes(query)
    );
  }
  
  return result;
});

// 分页处理
const totalPages = computed(() => 
  Math.ceil(filteredMusicList.value.length / itemsPerPage)
);

const paginatedMusicList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredMusicList.value.slice(start, start + itemsPerPage);
});

// 获取原始索引
const getOriginalIndex = (paginatedIndex) => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const filteredIndex = start + paginatedIndex;
  return dynamicMusicList.value.findIndex(item => 
    item === filteredMusicList.value[filteredIndex]
  );
};

const currentTrack = computed(() => 
  currentIndex.value >= 0 ? dynamicMusicList.value[currentIndex.value] : null
);

const selectTrack = async (index: number) => {
  // 如果点击的是当前播放的音乐，无需处理
  if (currentIndex.value === index) return;
  
  // 先停止当前正在播放的音乐（如果有）
  if (audioPlayer.value && audioPlayer.value.$el) {
    try {
      const mediaElement = audioPlayer.value.$el.querySelector('audio, video');
      if (mediaElement) {
        // 移除之前的事件监听
        mediaElement.removeEventListener('ended', handleTrackEnd);
        // 暂停当前音乐
        mediaElement.pause();
        // 重置进度
        mediaElement.currentTime = 0;
      }
    } catch (error) {
      console.error('停止当前音乐失败:', error);
    }
  }
  
  // 设置当前索引
  currentIndex.value = index;
  
  // 等待DOM更新后，尝试自动播放
  await nextTick();
  
  // 播放新选择的音乐
  if (audioPlayer.value && audioPlayer.value.$el) {
    try {
      // 查找媒体元素并播放
      const mediaElement = audioPlayer.value.$el.querySelector('audio, video');
      if (mediaElement) {
        // 添加结束事件监听
        mediaElement.addEventListener('ended', handleTrackEnd);
        
        // 强制加载新音频
        mediaElement.load();
        
        // 尝试播放
        const playPromise = mediaElement.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log('播放失败，可能是浏览器政策限制:', error);
            // 在用户交互后再次尝试播放
            document.addEventListener('click', function tryPlay() {
              mediaElement.play().then(() => {
                document.removeEventListener('click', tryPlay);
              }).catch(() => {
                // 继续等待用户交互
              });
            }, { once: false });
          });
        }
      }
    } catch (error) {
      console.error('自动播放失败:', error);
    }
  }
};

// 确保滚动到播放区域
watchEffect(() => {
  if (currentIndex.value >= 0) {
    nextTick(() => {
      const playerContainer = document.querySelector('.player-container');
      if (playerContainer) {
        // 检测是否在移动设备上（根据视口宽度判断）
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
          // 在移动设备上平滑滚动到播放器区域
          playerContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    });
  }
});

// 当过滤条件改变时重置页码
watchEffect(() => {
  if (currentPage.value > totalPages.value && totalPages.value > 0) {
    currentPage.value = 1;
  }
});
</script>

<style scoped>
.music-player {
  margin: 30px 0;
  padding: 20px;
  border-radius: 12px;
  background-color: var(--card-bg-color, #f5f5f5);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.search-and-filter {
  margin-bottom: 20px;
}

.category-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
}

.category-filter button {
  padding: 6px 12px;
  border: none;
  border-radius: 20px;
  background-color: #e8e8e8;
  color: #333;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.category-filter button.active {
  background-color: var(--theme-color, #3eaf7c);
  color: white;
}

.search-box {
  position: relative;
  margin-bottom: 10px;
}

.search-box input {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
}

.search-box input:focus {
  border-color: var(--theme-color, #3eaf7c);
}

.clear-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #999;
  font-size: 18px;
  cursor: pointer;
}

.music-content {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.music-list-container {
  flex: 1;
  min-width: 300px;
}

.music-list {
  display: grid;
  gap: 15px;
  margin-bottom: 15px;
  max-height: 500px;
  overflow-y: auto;
  padding-right: 5px;
}

.music-list::-webkit-scrollbar {
  width: 6px;
}

.music-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.music-list::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 10px;
}

.music-list::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}

.music-item {
  display: flex;
  padding: 12px;
  border-radius: 10px;
  background-color: var(--bg-color, #fff);
  cursor: pointer;
  transition: all 0.3s ease;
}

.music-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
}

.music-item.active {
  background-color: var(--theme-color, #3eaf7c);
  color: white;
}

.music-cover {
  position: relative;
  width: 60px;
  height: 60px;
  overflow: hidden;
  border-radius: 8px;
  margin-right: 15px;
  flex-shrink: 0;
}

.music-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.play-icon, .pause-icon {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.music-item:hover .play-icon,
.music-item:hover .pause-icon,
.music-item.active .pause-icon {
  opacity: 1;
}

.play-icon svg, .pause-icon svg {
  width: 24px;
  height: 24px;
  stroke: white;
}

.music-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}

.music-name {
  font-weight: bold;
  font-size: 1rem;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.music-artist {
  font-size: 0.875rem;
  color: var(--text-color-light, #666);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.music-item.active .music-artist {
  color: rgba(255, 255, 255, 0.8);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin: 10px 0;
}

.pagination button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background-color: var(--theme-color, #3eaf7c);
  color: white;
  cursor: pointer;
  transition: opacity 0.3s;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.player-container {
  flex: 1;
  min-width: 300px;
  padding: 15px;
  border-radius: 10px;
  background-color: var(--bg-color, #fff);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  align-self: flex-start;
  position: sticky;
  top: 80px;
}

.now-playing {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.mini-cover {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
  margin-right: 15px;
}

.now-playing-info {
  overflow: hidden;
}

.now-playing-name {
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.now-playing-artist {
  font-size: 0.9rem;
  color: var(--text-color-light, #666);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 768px) {
  .music-content {
    flex-direction: column;
  }
  
  .player-container {
    position: relative;
    top: 0;
  }
  
  .music-list {
    max-height: 400px;
  }
}

@media (max-width: 719px) {
  .music-player {
    padding: 15px;
  }
  
  .category-filter button {
    padding: 4px 8px;
    font-size: 12px;
  }
  
  .music-item {
    padding: 8px;
  }
  
  .music-cover {
    width: 50px;
    height: 50px;
    margin-right: 10px;
  }
  
  .music-name {
    font-size: 0.9rem;
  }
  
  .music-artist {
    font-size: 0.8rem;
  }
  
  .mini-cover {
    width: 40px;
    height: 40px;
  }
  
  .now-playing-name {
    font-size: 1rem;
  }
  
  .pagination button {
    padding: 6px 12px;
    font-size: 0.9rem;
  }
  
  .music-list {
    max-height: 350px;
  }
}
</style> 