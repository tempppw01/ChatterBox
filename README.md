# ChatterBox | Text-to-Speech Generator

<div align="center">

![Version](https://img.shields.io/badge/version-0.01beta-blue.svg)![License](https://img.shields.io/badge/license-MIT-green.svg)![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

一个基于 SiliconFlow API 的现代化文本转语音 Web 应用

[立即使用](http://yuyin.shuaihong.online/)

</div>

---

## 📖 简介

ChatterBox 是一个简洁、优雅的文本转语音Web应用，采用Gradio风格的界面设计，支持系统预置音色和自定义音色克隆两种模式。无需后端服务器，完全在浏览器中运行。

### 🌟 主要特点

- 🎨 **现代化界面** - 采用Gradio风格设计，清爽简洁
- 🎵 **双音色模式** - 支持系统预置音色和自定义音色上传
- ⚡ **语音速度控制** - 6档速度调节（0.5x - 2.0x）
- 📜 **历史记录** - 自动保存生成记录，支持快速回放
- 🔄 **动态模型加载** - 从API实时获取最新TTS模型列表
- 💾 **配置自动保存** - 浏览器本地存储，下次访问自动恢复
- 📱 **响应式设计** - 完美适配桌面和移动设备
- 🔒 **安全可靠** - 所有请求通过HTTPS，API密钥安全存储
- 📏 **智能限制** - 文本长度限制500字，文件大小限制3MB

---

## ✨ 功能特性

### 🎙️ 音色系统

#### 系统预置音色
- Alex (英文男声) - 清晰专业的男性声音

#### 自定义音色克隆
- 上传参考音频（支持 MP3, WAV, M4A 等格式）
- 提供参考文本以提高克隆质量
- 音色ID自动缓存，避免重复上传

### 🤖 模型支持

支持所有 SiliconFlow TTS 模型，包括但不限于：
- FunAudioLLM/CosyVoice2-0.5B
- fishaudio 系列
- GPT-SoVITS 系列
- IndexTeam/IndexTTS-2

### 🛠️ 其他功能

- 拖拽上传音频文件
- 实时进度提示
- 详细错误信息
- 音频在线播放
- 控制台调试日志
- 历史记录管理（最多保存50条）
- 语音速度实时调节
- 文件大小和文本长度验证

---

## 🚀 快速开始

### 前置要求

1. 一个现代浏览器（Chrome, Firefox, Safari, Edge）
2. SiliconFlow API密钥（[获取地址](https://cloud.siliconflow.cn/account/ak)）

### 安装部署

#### 方法一：直接使用（推荐）

```bash
# 克隆仓库
git clone https://github.com/yourusername/tts-generator.git

# 进入项目目录
cd tts-generator

# 使用任意HTTP服务器启动
# Python 3
python -m http.server 8000

# Node.js
npx http-server

# PHP
php -S localhost:8000
```

然后访问 `http://localhost:8000`

#### 方法二：部署到Web服务器

直接将以下文件上传到您的Web服务器：
- `index.html`
- `style.css`
- `script.js`

---

## 📚 使用指南

### 基础使用流程

#### 1️⃣ 使用系统预置音色（快速）

```
1. 填写 SiliconFlow API 密钥
2. 点击 🔄 按钮刷新模型列表
3. 选择一个 TTS 模型
4. 保持"系统预置音色"模式
5. 选择一个系统音色
6. 选择语音速度（可选，默认1.0x）
7. 输入要转换的文本（最多500字）
8. 点击"🎵 生成语音"
9. 等待生成完成并播放
```

#### 2️⃣ 使用自定义音色（高级）

```
1. 填写 SiliconFlow API 密钥
2. 点击 🔄 按钮刷新模型列表
3. 选择一个 TTS 模型
4. 切换到"上传自定义音色"模式
5. 上传参考音频文件（最大3MB）
6. 填写参考文本（可选，用于提高克隆质量）
7. 选择语音速度（可选）
8. 输入要合成的文本（最多500字）
9. 点击"🎵 生成语音"
10. 系统会先上传音色，再生成语音
```

#### 3️⃣ 使用历史记录

```
1. 点击右下角的 📜 按钮打开历史记录面板
2. 查看之前生成的语音记录
3. 点击 ▶️ 按钮快速回放历史音频
4. 点击 🗑️ 按钮删除单条记录
5. 点击"清空历史"按钮清除所有记录
```

### 高级功能

#### 语音速度控制

支持6档速度调节：
- 0.5x - 很慢（适合学习）
- 0.75x - 慢速
- 1.0x - 正常速度（默认）
- 1.25x - 快速
- 1.5x - 很快
- 2.0x - 极快（适合快速浏览）

#### 情感控制

某些模型支持情感标记，例如：

```
你能用高兴的情感说吗？<|endofprompt|>今天真是太开心了，马上要放假了！
```

#### 音频格式

默认输出格式为 MP3，API 还支持：
- WAV
- PCM
- OPUS

可以在代码中修改 `response_format` 参数。

---

## 🔧 配置说明

### API 配置

所有配置保存在浏览器的 localStorage 中：

| 键名 | 说明 |
|------|------|
| `tts_api_key` | SiliconFlow API 密钥 |
| `tts_model` | 选择的模型ID |
| `tts_voice_mode` | 音色模式 (system/upload) |
| `tts_system_voice` | 系统音色ID |
| `tts_speed` | 语音速度 |
| `tts_history` | 历史记录（最多50条）|

### 清除配置

打开浏览器控制台（F12），执行：

```javascript
localStorage.clear();
location.reload();
```

---

## 📁 项目结构

```
tts-generator/
│
├── index.html          # 主HTML文件
├── style.css           # Gradio风格样式
├── script.js           # 核心JavaScript逻辑
└── README.md          # 项目文档
```

### 核心文件说明

#### `index.html`
- 页面结构和布局
- 表单元素和控件
- 响应式设计

#### `style.css`
- Gradio风格样式
- 现代化UI组件
- 动画和过渡效果

#### `script.js`
- API调用逻辑
- 音色上传处理
- 音频生成和播放
- 配置管理

---

## 🔌 API 集成

### 支持的 API 端点

#### 1. 获取模型列表

```javascript
GET https://api.siliconflow.cn/v1/models
Headers: {
  "Authorization": "Bearer YOUR_API_KEY"
}
```

#### 2. 上传自定义音色

```javascript
POST https://api.siliconflow.cn/v1/uploads/audio/voice
Headers: {
  "Authorization": "Bearer YOUR_API_KEY"
}
Body: FormData {
  file: <音频文件>,
  model: "模型ID",
  customName: "音色名称",
  text: "参考文本"
}
```

#### 3. 生成语音

```javascript
POST https://api.siliconflow.cn/v1/audio/speech
Headers: {
  "Authorization": "Bearer YOUR_API_KEY",
  "Content-Type": "application/json"
}
Body: {
  model: "模型ID",
  input: "要转换的文本",
  voice: "音色ID",
  response_format: "mp3"
}
```

---

## 🐛 常见问题

### Q: 提示"API请求失败"？
**A:** 检查以下几点：
1. API密钥是否正确
2. 是否已实名认证（自定义音色需要）
3. 网络连接是否正常
4. 控制台是否有详细错误信息

### Q: 模型列表为空？
**A:**
1. 确认API密钥有效
2. 点击🔄按钮刷新
3. 检查浏览器控制台的错误信息

### Q: 自定义音色上传失败？
**A:**
1. 确认已完成实名认证
2. 检查音频文件格式是否支持
3. 确认文件大小不超过3MB
4. 填写参考文本以提高成功率

### Q: 生成的音频无法播放？
**A:**
1. 检查浏览器是否支持音频播放
2. 尝试下载音频文件播放
3. 更换浏览器尝试

### Q: 提示"文本长度超过限制"？
**A:**
1. 当前版本限制文本长度为500字
2. 请分段处理较长文本
3. 可以使用历史记录功能管理多段音频

### Q: 历史记录不见了？
**A:**
1. 历史记录保存在浏览器localStorage中
2. 清除浏览器数据会删除历史记录
3. 最多保存50条记录，超出会自动删除最旧的

---

## 🛡️ 安全建议

1. **API密钥保护**
   - 不要在公开代码中硬编码API密钥
   - 定期更换API密钥
   - 使用环境变量存储敏感信息

2. **HTTPS部署**
   - 生产环境必须使用HTTPS
   - 确保API调用安全

3. **输入验证**
   - 验证用户输入的文本长度
   - 限制音频文件大小
   - 防止XSS攻击

---

## 📝 更新日志

### v0.01beta (2025-11-05)
- ⚡ 新增语音速度控制（6档调节）
- 📜 新增历史记录功能（最多50条）
- 📏 添加文本长度限制（500字）
- 📦 添加文件大小限制（3MB）
- 🎨 优化用户界面
- 🐛 修复内存泄漏问题
- ✨ 改进错误处理

### v2.0.0 (2024-10-14)
- ✨ 新增双音色模式支持
- ✨ 添加系统预置音色
- ✨ 支持自定义音色克隆
- 🎨 全新Gradio风格界面
- 🔄 动态模型列表加载
- 💾 配置自动保存
- 🐛 修复多个已知问题

### v1.0.0 (2024-08-20)
- 🎉 项目初始发布
- ✨ 基础TTS功能
- 🎨 简洁UI设计

---

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

---

## 🙏 致谢

- [SiliconFlow](https://siliconflow.cn) - 提供强大的TTS API
- [Gradio](https://gradio.app) - UI设计灵感来源
- 所有贡献者和用户

---

<div align="center">

![应用截图](https://youke1.picui.cn/s1/2025/11/05/690ac470b9315.png)

**如果觉得这个项目对您有帮助，请给个 ⭐️ Star 支持一下！**

Made with ❤️ by [Your Name]

</div>