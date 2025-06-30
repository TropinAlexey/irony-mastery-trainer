// Main Application Logic - Irony Mastery Trainer
class IronyTrainer {
    constructor() {
        this.currentProvider = null;
        this.currentLanguage = 'ru';
        this.currentLevel = null;
        this.sessionData = {
            messages: [],
            exercises: [],
            responses: [],
            startTime: null,
            endTime: null
        };
        this.currentDay = 1;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeCloudAnimation();
        this.loadSavedSettings();
    }

    setupEventListeners() {
        // Language selection
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectLanguage(e.target.dataset.lang);
            });
        });

        // Provider selection
        document.querySelectorAll('.provider-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectProvider(e.target.dataset.provider);
            });
        });

        // API key save
        document.getElementById('save-api-btn')?.addEventListener('click', () => {
            this.saveApiKey();
        });

        // Level selection
        document.querySelectorAll('.level-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectLevel(e.target.dataset.level);
            });
        });

        // Chat functionality
        document.getElementById('send-btn')?.addEventListener('click', () => {
            this.sendMessage();
        });

        document.getElementById('user-input')?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Session controls
        document.getElementById('new-session-btn')?.addEventListener('click', () => {
            this.startNewSession();
        });

        document.getElementById('save-progress-btn')?.addEventListener('click', () => {
            this.saveProgress();
        });

        // Analysis actions
        document.getElementById('export-btn')?.addEventListener('click', () => {
            this.showExportOptions();
        });

        document.getElementById('schedule-btn')?.addEventListener('click', () => {
            this.scheduleNextSession();
        });

        document.getElementById('restart-btn')?.addEventListener('click', () => {
            this.startNewSession();
        });
    }

    initializeCloudAnimation() {
        // Create floating cloud background
        const cloudContainer = document.createElement('div');
        cloudContainer.className = 'floating-cloud';
        cloudContainer.innerHTML = `
            <div class="cloud-phrases">
                ${IronyTranslations.cloudPhrases.map(phrase => 
                    `<span class="cloud-phrase" style="left: ${phrase.x}%; top: ${phrase.y}%; animation-delay: ${Math.random() * 5}s;">
                        ${phrase.text}
                    </span>`
                ).join('')}
            </div>
        `;
        
        document.body.insertBefore(cloudContainer, document.body.firstChild);
        
        // Animate cloud phrases
        setInterval(() => {
            IronyTranslations.updateCloudPositions();
            this.updateCloudDisplay();
        }, 3000);
    }

    updateCloudDisplay() {
        const phrases = document.querySelectorAll('.cloud-phrase');
        phrases.forEach((phrase, index) => {
            const data = IronyTranslations.cloudPhrases[index];
            if (data) {
                phrase.style.left = `${data.x}%`;
                phrase.style.top = `${data.y}%`;
            }
        });
    }

    loadSavedSettings() {
        // Load saved language
        const savedLang = localStorage.getItem('irony-trainer-language');
        if (savedLang) {
            this.selectLanguage(savedLang);
        }

        // Load saved provider settings
        const savedProvider = localStorage.getItem('irony-trainer-provider');
        if (savedProvider) {
            this.selectProvider(savedProvider);
        }
    }

    selectLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('irony-trainer-language', lang);
        
        // Update UI language
        this.updateUILanguage();
        
        // Update selected state
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('selected', btn.dataset.lang === lang);
        });

        // Show provider selection
        document.getElementById('provider-section').style.display = 'block';
    }

    updateUILanguage() {
        const t = IronyTranslations.get.bind(IronyTranslations, this.currentLanguage);
        
        // Update all translatable elements
        document.querySelector('.header h1').textContent = t('title');
        document.querySelector('.subtitle').textContent = t('subtitle');
        
        // Update section headers
        document.querySelector('#language-section h2').textContent = t('chooseLanguage');
        document.querySelector('#provider-section h2').textContent = t('chooseProvider');
        document.querySelector('#api-section h2').textContent = t('apiKey');
        document.querySelector('#level-section h2').textContent = t('chooseLevel');
        
        // Update input placeholders and buttons
        const apiInput = document.getElementById('api-key');
        if (apiInput) apiInput.placeholder = t('apiKeyPlaceholder');
        
        const userInput = document.getElementById('user-input');
        if (userInput) userInput.placeholder = t('inputPlaceholder');
        
        // Update all buttons and labels
        this.updateButtonTexts();
    }

    updateButtonTexts() {
        const t = IronyTranslations.get.bind(IronyTranslations, this.currentLanguage);
        
        // Update level descriptions
        const levels = document.querySelectorAll('.level-btn');
        levels.forEach(btn => {
            const level = btn.dataset.level;
            const title = btn.querySelector('.level-title');
            const desc = btn.querySelector('.level-desc');
            
            if (title) title.textContent = t(level);
            if (desc) desc.textContent = t(`${level}Desc`);
        });
    }

    selectProvider(providerType) {
        // Update selected state
        document.querySelectorAll('.provider-btn').forEach(btn => {
            btn.classList.toggle('selected', btn.dataset.provider === providerType);
        });

        // Show API key section for non-local providers
        if (providerType === 'ollama') {
            this.initializeProvider(providerType, 'local');
            document.getElementById('api-section').style.display = 'none';
            document.getElementById('level-section').style.display = 'block';
        } else {
            document.getElementById('api-section').style.display = 'block';
            
            // Update API key placeholder based on provider
            const apiInput = document.getElementById('api-key');
            const placeholders = {
                openai: 'sk-...',
                anthropic: 'sk-ant-...',
                google: 'AI...'
            };
            apiInput.placeholder = placeholders[providerType] || 'API Key';
        }

        this.selectedProviderType = providerType;
        localStorage.setItem('irony-trainer-provider', providerType);
    }

    async saveApiKey() {
        const apiKey = document.getElementById('api-key').value.trim();
        if (!apiKey) {
            this.showNotification('Введите API ключ', 'error');
            return;
        }

        const saveBtn = document.getElementById('save-api-btn');
        saveBtn.disabled = true;
        saveBtn.textContent = '⏳ Проверка...';

        try {
            await this.initializeProvider(this.selectedProviderType, apiKey);
            
            // Test connection
            const testResult = await this.currentProvider.testConnection();
            
            if (testResult.success) {
                localStorage.setItem(`irony-trainer-api-${this.selectedProviderType}`, apiKey);
                this.showNotification(testResult.message, 'success');
                document.getElementById('level-section').style.display = 'block';
            } else {
                this.showNotification(testResult.message, 'error');
            }
        } catch (error) {
            this.showNotification(`Ошибка: ${error.message}`, 'error');
        } finally {
            saveBtn.disabled = false;
            saveBtn.textContent = '💾 Сохранить';
        }
    }

    async initializeProvider(type, apiKey) {
        switch (type) {
            case 'openai':
                this.currentProvider = new OpenAIProvider(apiKey);
                break;
            case 'anthropic':
                this.currentProvider = new AnthropicProvider(apiKey);
                break;
            case 'google':
                this.currentProvider = new GoogleProvider(apiKey);
                break;
            case 'ollama':
                this.currentProvider = new OllamaProvider();
                break;
            default:
                throw new Error('Неподдерживаемый провайдер');
        }
    }

    selectLevel(level) {
        this.currentLevel = level;
        
        // Update selected state
        document.querySelectorAll('.level-btn').forEach(btn => {
            btn.classList.toggle('selected', btn.dataset.level === level);
        });

        // Show chat section and start first exercise
        document.getElementById('chat-section').style.display = 'block';
        this.sessionData.startTime = new Date();
        this.startFirstExercise();
    }

    async startFirstExercise() {
        const welcomeMessage = {
            role: 'assistant',
            content: `🎭 Добро пожаловать в Irony Mastery Trainer!\n\nЯ ваш персональный наставник по развитию искусства иронии и элегантного общения. Сегодня мы проведем тренировочную сессию уровня "${this.currentLevel}".\n\nГотовы начать? Я сейчас подготовлю для вас персональное упражнение.`
        };
        
        this.addMessageToChat(welcomeMessage);
        
        // Generate first exercise
        await this.generateExercise();
    }

    async generateExercise() {
        if (!this.currentProvider) {
            this.showNotification('Провайдер не инициализирован', 'error');
            return;
        }

        this.showTypingIndicator();

        try {
            const systemPrompt = this.currentProvider.buildIronyPrompt(
                this.currentLevel,
                this.currentLanguage,
                this.sessionData.exercises
            );

            const response = await this.currentProvider.sendMessage([], systemPrompt);
            
            const exerciseMessage = {
                role: 'assistant',
                content: response.content
            };

            this.hideTypingIndicator();
            this.addMessageToChat(exerciseMessage);
            this.sessionData.exercises.push(response.content);

        } catch (error) {
            this.hideTypingIndicator();
            this.showNotification(`Ошибка генерации упражнения: ${error.message}`, 'error');
        }
    }

    async sendMessage() {
        const input = document.getElementById('user-input');
        const message = input.value.trim();
        
        if (!message) return;

        // Detect language from user input
        const detectedLang = IronyTranslations.detectLanguage(message);
        if (detectedLang !== 'auto' && detectedLang !== this.currentLanguage) {
            // Update current language to match user's input
            this.currentLanguage = detectedLang;
        }

        // Add user message
        const userMessage = { role: 'user', content: message };
        this.addMessageToChat(userMessage);
        this.sessionData.messages.push(userMessage);
        this.sessionData.responses.push(message);

        input.value = '';
        input.disabled = true;
        document.getElementById('send-btn').disabled = true;

        this.showTypingIndicator();

        try {
            // Generate analysis
            const analysisPrompt = this.currentProvider.buildAnalysisPrompt(
                message,
                this.sessionData.exercises[this.sessionData.exercises.length - 1],
                this.currentLanguage
            );

            const response = await this.currentProvider.sendMessage(
                this.sessionData.messages,
                analysisPrompt
            );

            const aiMessage = { role: 'assistant', content: response.content };
            this.hideTypingIndicator();
            this.addMessageToChat(aiMessage);
            this.sessionData.messages.push(aiMessage);

            // Check if session is complete (after 3-5 exercises)
            if (this.sessionData.exercises.length >= 3) {
                setTimeout(() => this.completeSession(), 2000);
            } else {
                // Generate next exercise
                setTimeout(() => this.generateExercise(), 1000);
            }

        } catch (error) {
            this.hideTypingIndicator();
            this.showNotification(`Ошибка: ${error.message}`, 'error');
        } finally {
            input.disabled = false;
            document.getElementById('send-btn').disabled = false;
            input.focus();
        }
    }

    addMessageToChat(message) {
        const chatMessages = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.role}`;
        
        messageDiv.innerHTML = `
            <div class="message-header">
                ${message.role === 'assistant' ? '🎭 AI Наставник' : '👤 Вы'}
            </div>
            <div class="message-content">${this.formatMessage(message.content)}</div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    formatMessage(content) {
        // Basic markdown-like formatting
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');
    }

    showTypingIndicator() {
        const chatMessages = document.getElementById('chat-messages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-header">🎭 AI Наставник</div>
            <div class="message-content">
                <span class="loading"></span> Анализирую ваш ответ...
            </div>
        `;
        
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    async completeSession() {
        this.sessionData.endTime = new Date();
        
        // Generate final analysis
        this.showTypingIndicator();
        
        try {
            const finalAnalysisPrompt = `
                Проанализируй всю тренировочную сессию и дай итоговый анализ:
                
                УРОВЕНЬ: ${this.currentLevel}
                ЯЗЫК: ${this.currentLanguage}
                КОЛИЧЕСТВО УПРАЖНЕНИЙ: ${this.sessionData.exercises.length}
                ОТВЕТЫ УЧЕНИКА: ${this.sessionData.responses.join('\n---\n')}
                
                Дай структурированный анализ в формате:
                
                📊 ОБЩАЯ ОЦЕНКА: [1-10]
                
                ✅ СИЛЬНЫЕ СТОРОНЫ:
                - [перечисли что получилось хорошо]
                
                ⚠️ ОБЛАСТИ ДЛЯ УЛУЧШЕНИЯ:
                - [что можно развивать дальше]
                
                💡 РЕКОМЕНДАЦИИ:
                - [конкретные советы для развития]
                
                🎯 СЛЕДУЮЩИЕ ШАГИ:
                - [что изучать дальше]
            `;

            const response = await this.currentProvider.sendMessage([], finalAnalysisPrompt);
            
            this.hideTypingIndicator();
            
            const finalMessage = {
                role: 'assistant',
                content: `🎉 Сессия завершена!\n\n${response.content}\n\n📅 Рекомендую повторить тренировку завтра для закрепления навыков.`
            };
            
            this.addMessageToChat(finalMessage);
            
            // Show analysis section
            document.getElementById('analysis-section').style.display = 'block';
            this.generateAnalysisTable(response.content);
            
        } catch (error) {
            this.hideTypingIndicator();
            this.showNotification(`Ошибка анализа: ${error.message}`, 'error');
        }
    }

    generateAnalysisTable(analysisText) {
        const analysisContent = document.getElementById('analysis-content');
        
        // Extract score from analysis
        const scoreMatch = analysisText.match(/ОБЩАЯ ОЦЕНКА:\s*(\d+)/);
        const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;
        
        const duration = this.sessionData.endTime - this.sessionData.startTime;
        const minutes = Math.round(duration / 60000);
        
        analysisContent.innerHTML = `
            <div class="analysis-summary">
                <h3>📋 Сводка сессии</h3>
                <table class="analysis-table">
                    <tr><th>Показатель</th><th>Значение</th></tr>
                    <tr><td>Общая оценка</td><td>${score}/10 ${'⭐'.repeat(Math.floor(score/2))}</td></tr>
                    <tr><td>Продолжительность</td><td>${minutes} минут</td></tr>
                    <tr><td>Упражнений выполнено</td><td>${this.sessionData.exercises.length}</td></tr>
                    <tr><td>Уровень сложности</td><td>${this.currentLevel}</td></tr>
                    <tr><td>Язык тренировки</td><td>${this.currentLanguage}</td></tr>
                </table>
            </div>
            
            <div class="analysis-details">
                <h3>📝 Детальный анализ</h3>
                <div class="analysis-text">${this.formatMessage(analysisText)}</div>
            </div>
        `;
    }

    showExportOptions() {
        const exportBtn = document.getElementById('export-btn');
        const dropdown = document.createElement('div');
        dropdown.className = 'export-dropdown';
        dropdown.innerHTML = `
            <div class="export-options show">
                <div class="export-option" onclick="trainer.exportData('md')">📄 Markdown (.md)</div>
                <div class="export-option" onclick="trainer.exportData('json')">📊 JSON (.json)</div>
                <div class="export-option" onclick="trainer.exportData('txt')">📝 Text (.txt)</div>
            </div>
        `;
        
        exportBtn.parentNode.insertBefore(dropdown, exportBtn.nextSibling);
        
        // Close dropdown when clicking outside
        setTimeout(() => {
            document.addEventListener('click', function closeDropdown(e) {
                if (!dropdown.contains(e.target)) {
                    dropdown.remove();
                    document.removeEventListener('click', closeDropdown);
                }
            });
        }, 100);
    }

    exportData(format) {
        const data = {
            session: {
                date: new Date().toISOString(),
                level: this.currentLevel,
                language: this.currentLanguage,
                duration: this.sessionData.endTime - this.sessionData.startTime,
                exerciseCount: this.sessionData.exercises.length
            },
            messages: this.sessionData.messages,
            exercises: this.sessionData.exercises,
            responses: this.sessionData.responses
        };

        let content, filename, mimeType;

        switch (format) {
            case 'md':
                content = this.formatAsMarkdown(data);
                filename = `irony-training-${new Date().toISOString().split('T')[0]}.md`;
                mimeType = 'text/markdown';
                break;
            case 'json':
                content = JSON.stringify(data, null, 2);
                filename = `irony-training-${new Date().toISOString().split('T')[0]}.json`;
                mimeType = 'application/json';
                break;
            case 'txt':
                content = this.formatAsText(data);
                filename = `irony-training-${new Date().toISOString().split('T')[0]}.txt`;
                mimeType = 'text/plain';
                break;
        }

        this.downloadFile(content, filename, mimeType);
        
        // Remove dropdown
        document.querySelector('.export-dropdown')?.remove();
    }

    formatAsMarkdown(data) {
        return `# 🎭 Irony Mastery Training Session

## Session Info
- **Date**: ${new Date(data.session.date).toLocaleString()}
- **Level**: ${data.session.level}
- **Language**: ${data.session.language}
- **Duration**: ${Math.round(data.session.duration / 60000)} minutes
- **Exercises**: ${data.session.exerciseCount}

## Training Log

${data.messages.map(msg => `### ${msg.role === 'assistant' ? '🎭 AI Trainer' : '👤 Student'}
${msg.content}
`).join('\n')}

---
*Generated by Irony Mastery Trainer*`;
    }

    formatAsText(data) {
        return `IRONY MASTERY TRAINING SESSION
===============================

Session Date: ${new Date(data.session.date).toLocaleString()}
Level: ${data.session.level}
Language: ${data.session.language}
Duration: ${Math.round(data.session.duration / 60000)} minutes
Exercises Completed: ${data.session.exerciseCount}

TRAINING LOG:
${data.messages.map(msg => `
${msg.role === 'assistant' ? 'AI TRAINER' : 'STUDENT'}: 
${msg.content}
${'='.repeat(50)}`).join('\n')}

Generated by Irony Mastery Trainer`;
    }

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification(`Файл ${filename} загружен`, 'success');
    }

    scheduleNextSession() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(new Date().getHours(), 0, 0, 0);

        const event = {
            title: '🎭 Irony Mastery Training',
            start: tomorrow,
            description: `Продолжение тренировки по развитию искусства иронии. Уровень: ${this.currentLevel}`
        };

        const googleUrl = this.generateGoogleCalendarUrl(event);
        const outlookUrl = this.generateOutlookCalendarUrl(event);

        const calendarDialog = document.createElement('div');
        calendarDialog.className = 'modal';
        calendarDialog.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
                <h2>📅 Запланировать тренировку</h2>
                <p>Выберите календарь для добавления напоминания:</p>
                <div style="display: flex; gap: 1rem; flex-direction: column;">
                    <a href="${googleUrl}" target="_blank" style="background: var(--accent-primary); color: white; padding: 0.75rem 1rem; text-decoration: none; border-radius: 8px; text-align: center;">📅 Google Calendar</a>
                    <a href="${outlookUrl}" target="_blank" style="background: var(--accent-secondary); color: white; padding: 0.75rem 1rem; text-decoration: none; border-radius: 8px; text-align: center;">📅 Outlook Calendar</a>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" style="background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); padding: 0.75rem 1rem; border-radius: 8px; cursor: pointer;">Отмена</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(calendarDialog);
    }

    generateGoogleCalendarUrl(event) {
        const startTime = event.start.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
        const endTime = new Date(event.start.getTime() + 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
        
        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(event.description)}`;
    }

    generateOutlookCalendarUrl(event) {
        const startTime = event.start.toISOString();
        const endTime = new Date(event.start.getTime() + 60 * 60 * 1000).toISOString();
        
        return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(event.title)}&startdt=${startTime}&enddt=${endTime}&body=${encodeURIComponent(event.description)}`;
    }

    startNewSession() {
        // Reset all data
        this.currentDay = 1;
        this.sessionData = {
            messages: [],
            exercises: [],
            responses: [],
            startTime: null,
            endTime: null
        };
        
        // Show initial sections
        document.getElementById('analysis-section').style.display = 'none';
        document.getElementById('language-section').style.display = 'block';
        document.getElementById('level-section').style.display = 'block';
        
        // Reset selections
        document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('selected'));
        this.currentLevel = null;
        
        // Clear chat
        document.getElementById('chat-messages').innerHTML = '';
        document.getElementById('user-input').value = '';
    }

    saveProgress() {
        const progressData = {
            language: this.currentLanguage,
            level: this.currentLevel,
            sessionData: this.sessionData,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('irony-trainer-progress', JSON.stringify(progressData));
        this.showNotification('Прогресс сохранен', 'success');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            background: ${type === 'success' ? 'var(--accent-success)' : type === 'error' ? 'var(--accent-secondary)' : 'var(--accent-primary)'};
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Modal functions
function showAbout() {
    document.getElementById('about-modal').style.display = 'flex';
}

function hideAbout() {
    document.getElementById('about-modal').style.display = 'none';
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.trainer = new IronyTrainer();
});

// Add necessary CSS animations
const style = document.createElement('style');
style.textContent = `
    .floating-cloud {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        overflow: hidden;
    }

    .cloud-phrase {
        position: absolute;
        color: rgba(255, 255, 255, 0.1);
        font-size: 1.2rem;
        font-weight: 300;
        animation: float 10s infinite linear;
        user-select: none;
    }

    @keyframes float {
        0% { transform: translateY(100vh) rotate(0deg); }
        100% { transform: translateY(-100px) rotate(360deg); }
    }

    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);