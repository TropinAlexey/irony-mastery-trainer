// Google Gemini Provider - Strategy Pattern Implementation
class GoogleProvider extends AIProvider {
    constructor(apiKey) {
        super(apiKey);
        this.name = 'Google';
        this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
        this.models = [
            { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
            { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
            { id: 'gemini-pro', name: 'Gemini Pro' }
        ];
        this.selectedModel = 'gemini-1.5-flash'; // Используем Flash как более доступную модель
    }

    validateApiKey(apiKey) {
        return apiKey && apiKey.length > 20 && /^[A-Za-z0-9_-]+$/.test(apiKey);
    }

    async sendMessage(messages, systemPrompt) {
        if (!this.validateApiKey(this.apiKey)) {
            throw new Error('Invalid Google API key format');
        }

        // Convert messages format for Gemini API
        const contents = [];

        // Add system prompt as first user message and model response
        if (systemPrompt) {
            contents.push({
                role: 'user',
                parts: [{ text: systemPrompt }]
            });
            contents.push({
                role: 'model',
                parts: [{ text: 'Понял, буду следовать этим инструкциям для тренировки иронии.' }]
            });
        }

        // Add conversation messages
        messages.forEach(msg => {
            contents.push({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.content }]
            });
        });

        const requestBody = {
            contents: contents,
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1000,
            },
            safetySettings: [
                {
                    category: 'HARM_CATEGORY_HARASSMENT',
                    threshold: 'BLOCK_ONLY_HIGH'
                },
                {
                    category: 'HARM_CATEGORY_HATE_SPEECH',
                    threshold: 'BLOCK_ONLY_HIGH'
                },
                {
                    category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                    threshold: 'BLOCK_ONLY_HIGH'
                },
                {
                    category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                    threshold: 'BLOCK_ONLY_HIGH'
                }
            ]
        };

        try {
            const response = await fetch(
                `${this.baseUrl}/models/${this.selectedModel}:generateContent?key=${this.apiKey}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage;
                
                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.error?.message || errorData.message || response.statusText;
                } catch {
                    errorMessage = errorText || response.statusText;
                }
                
                throw new Error(`HTTP ${response.status}: ${errorMessage}`);
            }

            const data = await response.json();
            
            if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
                throw new Error('Invalid response format from Google API');
            }

            const candidate = data.candidates[0];
            
            // Check for safety blocks
            if (candidate.finishReason === 'SAFETY') {
                throw new Error('Ответ заблокирован фильтрами безопасности Google. Попробуйте переформулировать запрос.');
            }

            if (!candidate.content.parts || !candidate.content.parts[0] || !candidate.content.parts[0].text) {
                throw new Error('Пустой ответ от Google API');
            }

            return {
                content: candidate.content.parts[0].text,
                usage: data.usageMetadata,
                model: this.selectedModel
            };

        } catch (error) {
            // Handle specific error types
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Не удалось подключиться к Google API. Проверьте интернет-соединение.');
            }
            
            throw new Error(this.handleApiError(error));
        }
    }

    async testConnection() {
        try {
            const testMessages = [{ role: 'user', content: 'Hi' }];
            const result = await this.sendMessage(testMessages, 'You are a helpful assistant. Respond briefly.');
            return { success: true, message: 'Подключение к Google Gemini успешно!' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    setModel(modelId) {
        const model = this.models.find(m => m.id === modelId);
        if (model) {
            this.selectedModel = modelId;
            return true;
        }
        return false;
    }

    getSelectedModel() {
        return this.selectedModel;
    }

    // Google-specific prompt optimization
    buildIronyPrompt(level, language, exerciseHistory = []) {
        const basePrompt = super.buildIronyPrompt(level, language, exerciseHistory);
        
        // Add Google-specific instructions for better performance
        return `${basePrompt}

АДАПТИВНОСТЬ ЯЗЫКА: Определи язык, на котором общается пользователь, и отвечай на том же языке. Не придерживайся только выбранного языка интерфейса.

СТИЛЬ ОТВЕТА: Будь креативным и используй примеры из современной культуры. Gemini хорошо понимает современные референсы и контекст.`;
    }

    // Enhanced error handling for Google
    handleApiError(error) {
        console.error(`${this.name} API Error:`, error);
        
        if (error.message?.includes('403') || error.message?.includes('API_KEY_INVALID')) {
            return 'Неверный API ключ Google. Проверьте правильность ключа в AI Studio.';
        }
        
        if (error.message?.includes('429') || error.message?.includes('RATE_LIMIT')) {
            return 'Превышен лимит запросов Google. Попробуйте позже.';
        }
        
        if (error.message?.includes('400')) {
            return 'Неверный формат запроса к Google API.';
        }
        
        if (error.message?.includes('quota') || error.message?.includes('QUOTA_EXCEEDED')) {
            return 'Превышена квота Google API. Проверьте лимиты в AI Studio.';
        }

        if (error.message?.includes('SAFETY')) {
            return 'Запрос заблокирован фильтрами безопасности Google. Попробуйте переформулировать.';
        }

        if (error.message?.includes('fetch')) {
            return 'Ошибка подключения к Google. Проверьте интернет-соединение.';
        }
        
        return `Ошибка Google: ${error.message || 'Неизвестная ошибка'}`;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GoogleProvider;
} else {
    window.GoogleProvider = GoogleProvider;
}