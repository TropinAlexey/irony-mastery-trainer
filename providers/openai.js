// OpenAI Provider - Strategy Pattern Implementation
class OpenAIProvider extends AIProvider {
    constructor(apiKey) {
        super(apiKey);
        this.name = 'OpenAI';
        this.baseUrl = 'https://api.openai.com/v1';
        this.models = [
            { id: 'gpt-4', name: 'GPT-4' },
            { id: 'gpt-4-turbo-preview', name: 'GPT-4 Turbo' },
            { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' }
        ];
        this.selectedModel = 'gpt-4';
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
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`HTTP ${response.status}: ${errorData.error?.message || response.statusText}`);
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
            throw new Error(this.handleApiError(error));
        }
    }

    async testConnection() {
        try {
            const testMessages = [{ role: 'user', content: 'Hello' }];
            const result = await this.sendMessage(testMessages, 'You are a helpful assistant.');
            return { success: true, message: 'Подключение к OpenAI успешно!' };
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

    // OpenAI-specific prompt optimization
    buildIronyPrompt(level, language, exerciseHistory = []) {
        const basePrompt = super.buildIronyPrompt(level, language, exerciseHistory);
        
        // Add OpenAI-specific instructions for better performance
        return `${basePrompt}

СТИЛЬ ОТВЕТА: Будь точным и структурированным. Используй эмодзи для визуального разделения разделов.`;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OpenAIProvider;
} else {
    window.OpenAIProvider = OpenAIProvider;
}