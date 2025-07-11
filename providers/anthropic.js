// Anthropic Provider - Strategy Pattern Implementation
class AnthropicProvider extends AIProvider {
    constructor(apiKey) {
        super(apiKey);
        this.name = 'Anthropic';
        this.baseUrl = 'https://api.anthropic.com/v1';
        this.models = [
            { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet' },
            { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus' },
            { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku' }
        ];
        this.selectedModel = 'claude-3-5-sonnet-20241022';
    }

    validateApiKey(apiKey) {
        return apiKey && apiKey.startsWith('sk-ant-') && apiKey.length > 20;
    }

    async sendMessage(messages, systemPrompt) {
        if (!this.validateApiKey(this.apiKey)) {
            throw new Error('Invalid Anthropic API key format');
        }

        // Convert messages format for Anthropic API
        const anthropicMessages = messages.map(msg => ({
            role: msg.role === 'assistant' ? 'assistant' : 'user',
            content: msg.content
        }));

        const requestBody = {
            model: this.selectedModel,
            max_tokens: 1000,
            temperature: 0.7,
            system: systemPrompt,
            messages: anthropicMessages
        };

        try {
            const response = await fetch(`${this.baseUrl}/messages`, {
                method: 'POST',
                headers: {
                    'x-api-key': this.apiKey,
                    'Content-Type': 'application/json',
                    'anthropic-version': '2023-06-01',
                    'anthropic-dangerous-direct-browser-access': 'true'
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
            
            if (!data.content || !data.content[0] || !data.content[0].text) {
                throw new Error('Invalid response format from Anthropic API');
            }

            return {
                content: data.content[0].text,
                usage: data.usage,
                model: data.model
            };

        } catch (error) {
            // Handle specific error types
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Не удалось подключиться к Anthropic API. Проверьте интернет-соединение или попробуйте позже.');
            }
            
            throw new Error(this.handleApiError(error));
        }
    }

    async testConnection() {
        try {
            const testMessages = [{ role: 'user', content: 'Hi' }];
            const result = await this.sendMessage(testMessages, 'You are a helpful assistant. Respond briefly.');
            return { success: true, message: 'Подключение к Anthropic Claude успешно!' };
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

    // Anthropic-specific prompt optimization
    buildIronyPrompt(level, language, exerciseHistory = []) {
        const basePrompt = super.buildIronyPrompt(level, language, exerciseHistory);
        
        // Add Anthropic-specific instructions for better performance
        return `${basePrompt}

ВАЖНО: Адаптируйся под любой язык, который использует пользователь в своих ответах. Отвечай на том же языке, что и пользователь, даже если он отличается от изначально выбранного языка интерфейса.

СТИЛЬ ОТВЕТА: Будь творческим и глубоким в анализе. Claude отлично понимает нюансы иронии и сарказма.`;
    }

    // Enhanced error handling for Anthropic
    handleApiError(error) {
        console.error(`${this.name} API Error:`, error);
        
        if (error.message?.includes('401') || error.message?.includes('unauthorized')) {
            return 'Неверный API ключ Anthropic. Проверьте правильность ключа.';
        }
        
        if (error.message?.includes('429') || error.message?.includes('rate limit')) {
            return 'Превышен лимит запросов Anthropic. Попробуйте позже.';
        }
        
        if (error.message?.includes('400')) {
            return 'Неверный формат запроса к Anthropic API.';
        }
        
        if (error.message?.includes('insufficient_quota') || error.message?.includes('credit')) {
            return 'Недостаточно средств на балансе Anthropic API.';
        }

        if (error.message?.includes('fetch')) {
            return 'Ошибка подключения к Anthropic. Проверьте интернет-соединение.';
        }
        
        return `Ошибка Anthropic: ${error.message || 'Неизвестная ошибка'}`;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnthropicProvider;
} else {
    window.AnthropicProvider = AnthropicProvider;
}