// Google Gemini Provider - Strategy Pattern Implementation
class GoogleProvider extends AIProvider {
    constructor(apiKey) {
        super(apiKey);
        this.name = 'Google';
        this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
        this.models = [
            { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
            { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
            { id: 'gemini-pro', name: 'Gemini Pro' }
        ];
        this.selectedModel = 'gemini-1.5-pro';
    }

    validateApiKey(apiKey) {
        return apiKey && apiKey.length > 20 && /^[A-Za-z0-9_-]+$/.test(apiKey);
    }

    async sendMessage(messages, systemPrompt) {
        if (!this.validateApiKey(this.apiKey)) {
            throw new Error('Invalid Google API key format');
        }

        // Convert messages format for Gemini API
        const contents = [
            // Add system prompt as first user message
            {
                role: 'user',
                parts: [{ text: systemPrompt }]
            },
            {
                role: 'model',
                parts: [{ text: 'Понял, буду следовать этим инструкциям.' }]
            }
        ];

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
                    threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                },
                {
                    category: 'HARM_CATEGORY_HATE_SPEECH',
                    threshold: 'BLOCK_MEDIUM_AND_ABOVE'
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
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`HTTP ${response.status}: ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            
            if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
                throw new Error('Invalid response format from Google API');
            }

            const candidate = data.candidates[0];
            if (candidate.finishReason === 'SAFETY') {
                throw new Error('Response blocked by safety filters');
            }

            return {
                content: candidate.content.parts[0].text,
                usage: data.usageMetadata,
                model: this.selectedModel
            };

        } catch (error) {
            throw new Error(this.handleApiError(error));
        }
    }

    async testConnection() {
        try {
            const testMessages = [{ role: 'user', content: 'Hello' }];
            const result = await this.sendMessage(testMessages, 'You are a helpful assistant.');
            return { success: true, message: 'Подключение к Google Gemini успешно!' };
        } catch (error) {
            return { success: false, message: this.handleApiError(error) };
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

СТИЛЬ ОТВЕТА: Будь креативным и используй примеры из поп-культуры. Gemini хорошо понимает современные референсы.`;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GoogleProvider;
} else {
    window.GoogleProvider = GoogleProvider;
}