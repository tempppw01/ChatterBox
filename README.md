# TTS生成器 | Text-to-Speech Generator

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

一个基于 SiliconFlow API 的现代化文本转语音 Web 应用

[在线演示](#) | [功能特性](#功能特性) | [快速开始](#快速开始) | [使用指南](#使用指南)

</div>

---

## 📖 简介

TTS生成器是一个简洁、优雅的文本转语音Web应用，采用Gradio风格的界面设计，支持系统预置音色和自定义音色克隆两种模式。无需后端服务器，完全在浏览器中运行。

### 🌟 主要特点

- 🎨 **现代化界面** - 采用Gradio风格设计，清爽简洁
- 🎵 **双音色模式** - 支持系统预置音色和自定义音色上传
- 🔄 **动态模型加载** - 从API实时获取最新TTS模型列表
- 💾 **配置自动保存** - 浏览器本地存储，下次访问自动恢复
- 📱 **响应式设计** - 完美适配桌面和移动设备
- 🔒 **安全可靠** - 所有请求通过HTTPS，API密钥安全存储

---

## ✨ 功能特性

### 🎙️ 音色系统

#### 系统预置音色
- Alex (英文男声) - 清晰专业的男性声音
- Luna (英文女声) - 温柔悦耳的女性声音
- Echo (中性音色) - 平衡的中性音色

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
6. 输入要转换的文本
7. 点击"🎵 生成语音"
8. 等待生成完成并播放
```

#### 2️⃣ 使用自定义音色（高级）

```
1. 填写 SiliconFlow API 密钥
2. 点击 🔄 按钮刷新模型列表
3. 选择一个 TTS 模型
4. 切换到"上传自定义音色"模式
5. 上传参考音频文件
6. 填写参考文本（可选，用于提高克隆质量）
7. 输入要合成的文本
8. 点击"🎵 生成语音"
9. 系统会先上传音色，再生成语音
```

### 高级功能

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
3. 确认文件大小不超过限制
4. 填写参考文本以提高成功率

### Q: 生成的音频无法播放？
**A:**
1. 检查浏览器是否支持音频播放
2. 尝试下载音频文件播放
3. 更换浏览器尝试

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

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 开发建议

- 遵循现有代码风格
- 添加必要的注释
- 测试所有功能
- 更新文档

---

## 📝 更新日志

### v2.0.0 (2024-10-14)
- ✨ 新增双音色模式支持
- ✨ 添加系统预置音色
- ✨ 支持自定义音色克隆
- 🎨 全新Gradio风格界面
- 🔄 动态模型列表加载
- 💾 配置自动保存
- 🐛 修复多个已知问题

### v1.0.0 (初始版本)
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

## 📞 联系方式

- 项目主页: [https://github.com/yourusername/tts-generator](https://github.com/yourusername/tts-generator)
- 问题反馈: [Issues](https://github.com/yourusername/tts-generator/issues)
- 邮箱: your.email@example.com

---

<div align="center">

**如果觉得这个项目对您有帮助，请给个 ⭐️ Star 支持一下！**

Made with ❤️ by [Your Name]

</div>