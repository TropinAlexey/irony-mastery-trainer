// OpenAI Provider - Strategy Pattern Implementation
class OpenAIProvider extends AIProvider {
    constructor(apiKey) {
        super(apiKey);
        this.name = 'OpenAI';
        this.baseUrl = 'https://api.openai.com/v1';
        this.models = [
            { id: 'gpt-4o', name: 'GPT-4o (Latest)' },
            { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
            { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' }
        ];
        this.selectedModel = 'gpt-4o-mini'; // Используем более доступную модель по умолчанию
    }

    validateApiKey(apiKey) {
        return apiKey && apiKey.startsWith('sk-') && apiKey.length > 20;
    }

    async sendMessage(messages, systemPrompt) {
        if (!this.validateApiKey(this.apiKey)) {
            throw new Error('Invalid OpenAI API key format');
        }

        const requestBody = {
            model: this.selectedModel,
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages
            ],
            max_tokens: 1000,
            temperature: 0.7,
            presence_penalty: 0.1,
            frequency_penalty: 0.1
        };

        try {
            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

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
            
            if (!data.choices || !data.choices[0] || !data.choices[0].message) {
                throw new Error('Invalid response format from OpenAI API');
            }

            return {
                content: data.choices[0].message.content,
                usage: data.usage,
                model: data.model
            };

        } catch (error) {
            // Handle specific error types
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Не удалось подключиться к OpenAI API. Проверьте интернет-соединение.');
            }
            
            throw new Error(this.handleApiError(error));
        }
    }

    async testConnection() {
        try {
            const testMessages = [{ role: 'user', content: 'Hi' }];
            const result = await this.sendMessage(testMessages, 'You are a helpful assistant. Respond briefly.');
            return { success: true, message: 'Подключение к OpenAI успешно!' };
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

    // OpenAI-specific prompt optimization
    buildIronyPrompt(level, language, exerciseHistory = []) {
        const basePrompt = super.buildIronyPrompt(level, language, exerciseHistory);
        
        // Add OpenAI-specific instructions for better performance
        return `${basePrompt}

СТИЛЬ ОТВЕТА: Будь точным и структурированным. Используй эмодзи для визуального разделения разделов.`;
    }

    // Enhanced error handling for OpenAI
    handleApiError(error) {
        console.error(`${this.name} API Error:`, error);
        
        if (error.message?.includes('401') || error.message?.includes('unauthorized')) {
            return 'Неверный API ключ OpenAI. Проверьте правильность ключа.';
        }
        
        if (error.message?.includes('429') || error.message?.includes('rate limit')) {
            return 'Превышен лимит запросов OpenAI. Попробуйте позже.';
        }
        
        if (error.message?.includes('400')) {
            return 'Неверный формат запроса к OpenAI API.';
        }
        
        if (error.message?.includes('insufficient_quota') || error.message?.includes('quota')) {
            return 'Недостаточно средств на балансе OpenAI API. Пополните баланс.';
        }

        if (error.message?.includes('does not exist')) {
            return 'Модель недоступна. Проверьте доступ к GPT-4 или используйте GPT-3.5.';
        }

        if (error.message?.includes('fetch')) {
            return 'Ошибка подключения к OpenAI. Проверьте интернет-соединение.';
        }
        
        return `Ошибка OpenAI: ${error.message || 'Неизвестная ошибка'}`;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OpenAIProvider;
} else {
    window.OpenAIProvider = OpenAIProvider;
}