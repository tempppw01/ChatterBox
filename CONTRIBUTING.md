# 贡献指南

感谢您对 TTS生成器项目感兴趣！我们欢迎所有形式的贡献。

## 📋 贡献方式

### 报告问题

如果您发现了bug或有功能建议：

1. 先搜索 [Issues](https://github.com/yourusername/tts-generator/issues) 确认问题是否已存在
2. 如果没有，创建新的Issue
3. 详细描述问题或建议，包括：
   - 问题描述
   - 复现步骤
   - 预期行为
   - 实际行为
   - 浏览器版本
   - 截图（如果适用）

### 提交代码

1. **Fork 项目**
   ```bash
   # 点击 GitHub 页面右上角的 "Fork" 按钮
   ```

2. **克隆您的 Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/tts-generator.git
   cd tts-generator
   ```

3. **创建分支**
   ```bash
   git checkout -b feature/your-feature-name
   # 或
   git checkout -b fix/your-bug-fix
   ```

4. **进行修改**
   - 保持代码风格一致
   - 添加必要的注释
   - 测试您的更改

5. **提交更改**
   ```bash
   git add .
   git commit -m "feat: 添加某某功能"
   # 或
   git commit -m "fix: 修复某某问题"
   ```

6. **推送到您的 Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **创建 Pull Request**
   - 访问您的 Fork 页面
   - 点击 "New Pull Request"
   - 填写 PR 描述
   - 等待审核

## 📝 提交信息规范

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat:` 新功能
- `fix:` 修复bug
- `docs:` 文档更新
- `style:` 代码格式调整（不影响功能）
- `refactor:` 重构代码
- `test:` 测试相关
- `chore:` 构建过程或辅助工具的变动

示例：
```
feat: 添加语音速度控制功能
fix: 修复音频无法播放的问题
docs: 更新API使用文档
```

## 🎨 代码规范

### HTML
- 使用语义化标签
- 保持良好的缩进（2空格）
- 添加必要的注释

### CSS
- 使用 CSS 变量统一样式
- 遵循 BEM 命名规范
- 移动优先的响应式设计

### JavaScript
- 使用 ES6+ 语法
- 变量命名要有意义
- 函数应该单一职责
- 添加 JSDoc 注释

```javascript
/**
 * 上传音色文件到服务器
 * @param {string} apiKey - API密钥
 * @param {string} model - 模型ID
 * @param {File} voiceFile - 音频文件
 * @param {string} referenceText - 参考文本
 * @returns {Promise<string>} 音色ID
 */
async function uploadVoice(apiKey, model, voiceFile, referenceText) {
    // 实现代码
}
```

## 🧪 测试

在提交PR之前，请确保：

- [ ] 代码可以正常运行
- [ ] 在主流浏览器中测试（Chrome, Firefox, Safari）
- [ ] 移动端表现良好
- [ ] 没有控制台错误
- [ ] 所有功能正常工作

## 📚 文档

如果您的更改影响了用户使用：

- 更新 README.md
- 添加使用示例
- 更新 CHANGELOG（如果有）

## ❓ 需要帮助？

如有任何问题，欢迎：

- 在 Issues 中提问
- 发邮件联系维护者
- 加入我们的社区讨论

## 🙏 感谢

再次感谢您的贡献！每一个PR都让这个项目变得更好。

---

## 🔄 版本说明

当前版本：**v0.01beta**

这是一个测试版本，包含以下新功能：
- ⚡ 语音速度控制（6档调节）
- 📜 历史记录管理（最多50条）
- 📏 文本长度限制（500字）
- 📦 文件大小限制（3MB）
- 🐛 内存泄漏修复
- ✨ 改进的错误处理

我们欢迎您测试并反馈问题！

### 测试重点

在测试时，请特别关注：
1. 语音速度调节是否正常工作
2. 历史记录的保存和回放功能
3. 文本长度和文件大小的验证
4. 长时间使用后的内存占用情况

### 已知限制

- 历史记录仅保存在本地浏览器
- 清除浏览器数据会丢失历史记录
- 文本长度限制为500字
- 音频文件大小限制为3MB