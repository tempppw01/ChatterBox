document.addEventListener('DOMContentLoaded', () => {
    // === UI 元素 ===
    const synthesizeBtn = document.getElementById('synthesize-btn');
    const audioPlayer = document.getElementById('audio-player');
    const audioPlaceholder = document.getElementById('audio-placeholder');
    const textInput = document.getElementById('text-input');
    const modelSelect = document.getElementById('model-select');
    const refreshModelsBtn = document.getElementById('refresh-models-btn');
    const apiKeyInput = document.getElementById('api-key-input');
    
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
    
    let selectedVoiceFile = null;
    let uploadedVoiceUri = null;

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
                // 使用系统预置音色
                voiceId = systemVoiceSelect.value;
                console.log('🎵 使用系统音色:', voiceId);
                
                audioPlaceholder.innerHTML = `
                    <div class="placeholder-icon">⏳</div>
                    <div class="placeholder-text">正在生成语音...</div>
                    <div class="placeholder-hint">模型: ${model} | 音色: 系统预置</div>
                `;
            } else {
                // 使用用户上传音色
                if (!uploadedVoiceUri) {
                    audioPlaceholder.innerHTML = `
                        <div class="placeholder-icon">📤</div>
                        <div class="placeholder-text">正在上传音色文件...</div>
                        <div class="placeholder-hint">文件: ${selectedVoiceFile.name}</div>
                    `;
                    
                    const referenceText = referenceTextInput.value.trim() || '这是一段参考音频';
                    uploadedVoiceUri = await uploadVoice(apiKey, model, selectedVoiceFile, referenceText);
                    console.log('🎵 获得音色ID:', uploadedVoiceUri);
                }
                
                voiceId = uploadedVoiceUri;
                
                audioPlaceholder.innerHTML = `
                    <div class="placeholder-icon">⏳</div>
                    <div class="placeholder-text">正在生成语音...</div>
                    <div class="placeholder-hint">模型: ${model} | 音色: 自定义</div>
                `;
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
            
            const audioUrl = URL.createObjectURL(audioBlob);

            audioPlayer.src = audioUrl;
            audioPlayer.style.display = 'block';
            audioPlaceholder.style.display = 'none';

            showSuccess('语音生成成功！');

        } catch (error) {
            console.error('❌ 错误:', error);
            
            audioPlaceholder.innerHTML = `
                <div class="placeholder-icon" style="color: #DC2626;">❌</div>
                <div class="placeholder-text" style="color: #DC2626;">生成失败</div>
                <div class="placeholder-hint">${error.message}</div>
            `;
            
            showError(`生成失败: ${error.message}`);
            
            if (error.message.includes('上传')) {
                uploadedVoiceUri = null;
            }

        } finally {
            synthesizeBtn.textContent = '🎵 生成语音';
            synthesizeBtn.disabled = false;
        }
    }

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

    // === 恢复保存的配置 ===
    const savedKey = localStorage.getItem('tts_api_key');
    const savedModel = localStorage.getItem('tts_model');
    const savedVoiceMode = localStorage.getItem('tts_voice_mode');
    const savedSystemVoice = localStorage.getItem('tts_system_voice');

    if (savedKey) apiKeyInput.value = savedKey;
    if (savedModel) modelSelect.value = savedModel;
    if (savedVoiceMode) {
        voiceModeSelect.value = savedVoiceMode;
        voiceModeSelect.dispatchEvent(new Event('change'));
    }
    if (savedSystemVoice) systemVoiceSelect.value = savedSystemVoice;
});