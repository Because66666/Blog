/**
 * 这个脚本用于自动生成music-list.json文件
 * 使用方法: node update-music-list.js
 */

const fs = require('fs');
const path = require('path');

// 音乐文件目录路径
const musicDir = path.resolve(__dirname, 'public/assets/music');
// 输出JSON文件路径
const outputFile = path.resolve(__dirname, 'public/assets/music-list.json');

// 读取音乐目录
try {
  console.log('正在读取音乐目录...');
  const files = fs.readdirSync(musicDir);
  
  // 过滤出mp3文件
  const musicFiles = files.filter(file => file.toLowerCase().endsWith('.mp3'));
  
  console.log(`找到 ${musicFiles.length} 个MP3文件`);
  
  // 创建JSON数据
  const jsonData = {
    files: musicFiles,
    lastUpdated: new Date().toISOString()
  };
  
  // 写入JSON文件
  fs.writeFileSync(outputFile, JSON.stringify(jsonData, null, 2), 'utf8');
  
  console.log(`已成功生成 music-list.json 文件，包含 ${musicFiles.length} 首音乐`);
} catch (error) {
  console.error('生成音乐列表失败:', error);
  process.exit(1);
} 