
document.addEventListener('DOMContentLoaded', () => {
    // === 常量配置 ===
    const MAX_TEXT_LENGTH = 500;
    const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB
    const MAX_HISTORY_ITEMS = 50;
    
    // === UI 元素 ===
    const synthesizeBtn = document.getElementById('synthesize-btn');
    const audioPlayer = document.getElementById('audio-player');
    const audioPlaceholder = document.getElementById('audio-placeholder');
    const textInput = document.getElementById('text-input');
    const modelSelect = document.getElementById('model-select');
    const refreshModelsBtn = document.getElementById('refresh-models-btn');
    const apiKeyInput = document.getElementById('api-key-input');
    
    // 语音速度控制
    const speedSelect = document.getElementById('speed-select');
    
    // 音色模式选择
    const voiceModeSelect = document.getElementById('voice-mode-select');
    const systemVoiceRow = document.getElementById('system-voice-row');
    const systemVoiceSelect = document.getElementById('system-voice-select');
    const uploadVoiceBox = document.getElementById('upload-voice-box');
    const referenceTextInput = document.getElementById('reference-text-input');
    
    // 音频上传相关元素
    const voiceAudioUpload = document.getElementById('voice-audio-upload');
    const voiceUploadArea = document.getElementById('voice-upload-area');
    const voiceFileInfo = document.getElementById('voice-file-info');
    const voiceFileName = document.getElementById('voice-file-name');
    const removeVoiceBtn = document.getElementById('remove-voice-btn');
    
    // 历史记录相关元素
    const historyToggleBtn = document.getElementById('history-toggle-btn');
    const historyPanel = document.getElementById('history-panel');
    const historyCloseBtn = document.getElementById('history-close-btn');
    const historyContent = document.getElementById('history-content');
    const clearHistoryBtn = document.getElementById('clear-history-btn');
    
    let selectedVoiceFile = null;
    let uploadedVoiceUri = null;
    let currentAudioUrl = null;
    let historyList = [];

    // === 初始化 ===
    loadHistory();
    renderHistory();

    // === 音色模式切换 ===
    voiceModeSelect.addEventListener('change', () => {
        const mode = voiceModeSelect.value;
        if (mode === 'system') {
            systemVoiceRow.style.display = 'grid';
            uploadVoiceBox.style.display = 'none';
        } else {
            systemVoiceRow.style.display = 'none';
            uploadVoiceBox.style.display = 'block';
        }
    });

    // === 文件上传处理 ===
    voiceUploadArea.addEventListener('click', () => {
        if (!selectedVoiceFile) {
            voiceAudioUpload.click();
        }
    });

    voiceAudioUpload.addEventListener('change', (e) => {
        handleFileSelect(e.target.files[0]);
    });

    voiceUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        voiceUploadArea.classList.add('drag-over');
    });

    voiceUploadArea.addEventListener('dragleave', () => {
        voiceUploadArea.classList.remove('drag-over');
    });

    voiceUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        voiceUploadArea.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('audio/')) {
            handleFileSelect(file);
        } else {
            showError('请上传音频文件');
        }
    });

    removeVoiceBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeFile();
    });

    function handleFileSelect(file) {
        if (file) {
            // 检查文件大小
            if (file.size > MAX_FILE_SIZE) {
                showError(`文件大小不能超过 ${MAX_FILE_SIZE / 1024 / 1024}MB`);
                return;
            }
            
            selectedVoiceFile = file;
            uploadedVoiceUri = null;
            voiceFileName.textContent = `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
            voiceUploadArea.querySelector('.upload-content').style.display = 'none';
            voiceFileInfo.style.display = 'flex';
        }
    }

    function removeFile() {
        selectedVoiceFile = null;
        uploadedVoiceUri = null;
        voiceAudioUpload.value = '';
        voiceUploadArea.querySelector('.upload-content').style.display = 'block';
        voiceFileInfo.style.display = 'none';
    }

    // === 刷新模型列表 ===
    refreshModelsBtn.addEventListener('click', async () => {
        await fetchModelList();
    });

    async function fetchModelList() {
        const apiKey = apiKeyInput.value.trim();
        
        if (!apiKey) {
            showError('请先填写 API 密钥');
            return;
        }

        refreshModelsBtn.textContent = '⏳';
        refreshModelsBtn.disabled = true;

        try {
            const response = await fetch('https://api.siliconflow.cn/v1/models', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            
            modelSelect.innerHTML = '';
            
            // 筛选TTS模型
            if (data.data && Array.isArray(data.data)) {
                const ttsModels = data.data.filter(model => 
                    model.id && (
                        model.id.includes('TTS') || 
                        model.id.includes('tts') ||
                        model.id.includes('CosyVoice') ||
                        model.id.includes('fishaudio') ||
                        model.id.includes('GPT-SoVITS')
                    )
                );
                
                if (ttsModels.length === 0) {
                    modelSelect.innerHTML = '<option value="">未找到TTS模型</option>';
                } else {
                    ttsModels.forEach(model => {
                        const option = document.createElement('option');
                        option.value = model.id;
                        option.textContent = model.id;
                        modelSelect.appendChild(option);
                    });
                }
            }

            showSuccess(`已加载 ${modelSelect.options.length} 个TTS模型`);

        } catch (error) {
            console.error('获取模型列表错误:', error);
            showError(`获取失败: ${error.message}`);
        } finally {
            refreshModelsBtn.textContent = '🔄';
            refreshModelsBtn.disabled = false;
        }
    }

    // === 上传音色（用户自定义） ===
    async function uploadVoice(apiKey, model, voiceFile, referenceText) {
        console.log('📤 上传音色文件...');
        
        const formData = new FormData();
        formData.append('file', voiceFile);
        formData.append('model', model);
        formData.append('customName', voiceFile.name.split('.')[0]);
        formData.append('text', referenceText || '这是一段参考音频');

        const response = await fetch('https://api.siliconflow.cn/v1/uploads/audio/voice', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
            },
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `上传失败 (${response.status})`);
        }

        const data = await response.json();
        console.log('✅ 音色上传成功:', data);
        
        if (!data.uri) {
            throw new Error('未获取到音色ID');
        }
        
        return data.uri;
    }

    // === 生成语音 ===
    synthesizeBtn.addEventListener('click', async () => {
        const apiKey = apiKeyInput.value.trim();
        const text = textInput.value.trim();
        const model = modelSelect.value;
        const voiceMode = voiceModeSelect.value;

        // 验证
        if (!apiKey) {
            showError('请填写 API 密钥');
            return;
        }

        if (!model) {
            showError('请先刷新并选择模型');
            return;
        }

        if (!text) {
            showError('请输入要转换的文本');
            return;
        }

        // 检查文本长度
        if (text.length > MAX_TEXT_LENGTH) {
            showError(`文本长度不能超过 ${MAX_TEXT_LENGTH} 字`);
            return;
        }

        // 根据音色模式验证
        if (voiceMode === 'upload') {
            if (!selectedVoiceFile) {
                showError('请上传音色音频文件');
                return;
            }
        }

        await synthesizeSpeech(apiKey, model, text, voiceMode);
    });

    async function synthesizeSpeech(apiKey, model, text, voiceMode) {
        synthesizeBtn.textContent = '⏳ 处理中...';
        synthesizeBtn.disabled = true;
        audioPlayer.style.display = 'none';
        
        try {
            let voiceId;

            // 确定音色ID
            if (voiceMode === 'system') {
                voiceId = systemVoiceSelect.value;
                console.log('🎵 使用系统音色:', voiceId);
                updatePlaceholder('⏳', '正在生成语音...', `模型: ${model} | 音色: 系统预置`);
            } else {
                if (!uploadedVoiceUri) {
                    updatePlaceholder('📤', '正在上传音色文件...', `文件: ${selectedVoiceFile.name}`);
                    const referenceText = referenceTextInput.value.trim() || '这是一段参考音频';
                    uploadedVoiceUri = await uploadVoice(apiKey, model, selectedVoiceFile, referenceText);
                    console.log('🎵 获得音色ID:', uploadedVoiceUri);
                }
                voiceId = uploadedVoiceUri;
                updatePlaceholder('⏳', '正在生成语音...', `模型: ${model} | 音色: 自定义`);
            }

            // 生成语音
            console.log('📝 生成语音...');
            console.log('模型:', model);
            console.log('音色ID:', voiceId);
            console.log('文本:', text);

            const response = await fetch('https://api.siliconflow.cn/v1/audio/speech', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: model,
                    input: text,
                    voice: voiceId,
                    response_format: "mp3"
                })
            });

            console.log('响应状态:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('错误详情:', errorData);
                throw new Error(errorData.message || `生成失败 (${response.status})`);
            }

            const audioBlob = await response.blob();
            console.log('✅ 音频生成成功，大小:', (audioBlob.size / 1024).toFixed(2), 'KB');
            
            // 清理旧的 Blob URL
            if (currentAudioUrl) {
                URL.revokeObjectURL(currentAudioUrl);
            }
            
            currentAudioUrl = URL.createObjectURL(audioBlob);

            // 应用语音速度
            const speed = parseFloat(speedSelect.value);
            audioPlayer.playbackRate = speed;
            audioPlayer.src = currentAudioUrl;
            audioPlayer.style.display = 'block';
            audioPlaceholder.style.display = 'none';

            // 添加到历史记录
            addToHistory({
                text: text,
                model: model,
                voiceMode: voiceMode === 'system' ? '系统预置' : '自定义',
                speed: speed,
                audioUrl: currentAudioUrl,
                timestamp: new Date().toISOString()
            });

            showSuccess('语音生成成功！');

        } catch (error) {
            console.error('❌ 错误:', error);
            updatePlaceholder('❌', '生成失败', error.message, '#DC2626');
            showError(`生成失败: ${error.message}`);
            
            if (error.message.includes('上传')) {
                uploadedVoiceUri = null;
            }

        } finally {
            synthesizeBtn.textContent = '🎵 生成语音';
            synthesizeBtn.disabled = false;
        }
    }

    // === 辅助函数：更新占位符 ===
    function updatePlaceholder(icon, text, hint, color = '') {
        const colorStyle = color ? `style="color: ${color};"` : '';
        audioPlaceholder.innerHTML = `
            <div class="placeholder-icon" ${colorStyle}>${icon}</div>
            <div class="placeholder-text" ${colorStyle}>${text}</div>
            <div class="placeholder-hint">${hint}</div>
        `;
    }

    // === 历史记录功能 ===
    historyToggleBtn.addEventListener('click', () => {
        historyPanel.classList.add('active');
    });

    historyCloseBtn.addEventListener('click', () => {
        historyPanel.classList.remove('active');
    });

    clearHistoryBtn.addEventListener('click', () => {
        if (confirm('确定要清空所有历史记录吗？')) {
            historyList = [];
            saveHistory();
            renderHistory();
            showSuccess('历史记录已清空');
        }
    });

    function addToHistory(item) {
        historyList.unshift(item);
        if (historyList.length > MAX_HISTORY_ITEMS) {
            historyList = historyList.slice(0, MAX_HISTORY_ITEMS);
        }
        saveHistory();
        renderHistory();
    }

    function loadHistory() {
        const saved = localStorage.getItem('tts_history');
        if (saved) {
            try {
                historyList = JSON.parse(saved);
            } catch (e) {
                console.error('加载历史记录失败:', e);
                historyList = [];
            }
        }
    }

    function saveHistory() {
        localStorage.setItem('tts_history', JSON.stringify(historyList));
    
    }

    function renderHistory() {
        if (historyList.length === 0) {
            historyContent.innerHTML = '<div class="history-empty">暂无历史记录</div>';
            return;
        }

        historyContent.innerHTML = historyList.map((item, index) => {
            const date = new Date(item.timestamp);
            const timeStr = date.toLocaleString('zh-CN', {
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            return `
                <div class="history-item">
                    <div class="history-item-header">
                        <span class="history-item-time">${timeStr}</span>
                        <div class="history-item-actions">
                            <button class="history-item-btn" onclick="window.replayHistory(${index})">▶️</button>
                            <button class="history-item-btn" onclick="window.deleteHistory(${index})">🗑️</button>
                        </div>
                    </div>
                    <div class="history-item-text">${item.text}</div>
                    <div class="history-item-info">
                        <span>模型: ${item.model.split('/').pop()}</span>
                        <span>音色: ${item.voiceMode}</span>
                        <span>速度: ${item.speed}x</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    // 全局函数供历史记录按钮调用
    window.replayHistory = (index) => {
        const item = historyList[index];
        if (item && item.audioUrl) {
            audioPlayer.src = item.audioUrl;
            audioPlayer.playbackRate = item.speed;
            audioPlayer.style.display = 'block';
            audioPlaceholder.style.display = 'none';
            audioPlayer.play();
            historyPanel.classList.remove('active');
        }
    };

    window.deleteHistory = (index) => {
        historyList.splice(index, 1);
        saveHistory();
        renderHistory();
    };

    function showError(message) {
        alert('❌ ' + message);
    }

    function showSuccess(message) {
        console.log('✅ ' + message);
    }

    // === 自动保存配置 ===
    apiKeyInput.addEventListener('change', () => {
        localStorage.setItem('tts_api_key', apiKeyInput.value);
    });

    modelSelect.addEventListener('change', () => {
        localStorage.setItem('tts_model', modelSelect.value);
    });

    voiceModeSelect.addEventListener('change', () => {
        localStorage.setItem('tts_voice_mode', voiceModeSelect.value);
    });

    systemVoiceSelect.addEventListener('change', () => {
        localStorage.setItem('tts_system_voice', systemVoiceSelect.value);
    });

    speedSelect.addEventListener('change', () => {
        localStorage.setItem('tts_speed', speedSelect.value);
    });

    // === 恢复保存的配置 ===
    const savedKey = localStorage.getItem('tts_api_key');
    const savedModel = localStorage.getItem('tts_model');
    const savedVoiceMode = localStorage.getItem('tts_voice_mode');
    const savedSystemVoice = localStorage.getItem('tts_system_voice');
    const savedSpeed = localStorage.getItem('tts_speed');

    if (savedKey) apiKeyInput.value = savedKey;
    if (savedModel) modelSelect.value = savedModel;
    if (savedVoiceMode) {
        voiceModeSelect.value = savedVoiceMode;
        voiceModeSelect.dispatchEvent(new Event('change'));
    }
    if (savedSystemVoice) {
        // 确保保存的值仍然有效
        if (Array.from(systemVoiceSelect.options).some(opt => opt.value === savedSystemVoice)) {
            systemVoiceSelect.value = savedSystemVoice;
        }
    }
    if (savedSpeed) speedSelect.value = savedSpeed;
});