// Ollama Provider - Strategy Pattern Implementation
class OllamaProvider extends AIProvider {
    constructor(apiKey = 'local') {
        super(apiKey);
        this.name = 'Ollama';
        this.baseUrl = 'http://localhost:11434/api';
        this.models = [];
        this.selectedModel = '';
        this.isLocal = true;
    }

    validateApiKey(apiKey) {
        // Ollama doesn't require API key for local use
        return true;
    }

    async loadModels() {
        try {
            const response = await fetch(`${this.baseUrl}/tags`);
            if (!response.ok) {
                throw new Error('Ollama сервер недоступен');
            }

            const data = await response.json();
            this.models = data.models.map(model => ({
                id: model.name,
                name: model.name,
                size: model.size
            }));

            if (this.models.length > 0 && !this.selectedModel) {
                this.selectedModel = this.models[0].id;
            }

            return this.models;
        } catch (error) {
            throw new Error(`Ошибка загрузки моделей Ollama: ${error.message}`);
        }
    }

    async sendMessage(messages, systemPrompt) {
        if (!this.selectedModel) {
            await this.loadModels();
            if (!this.selectedModel) {
                throw new Error('Нет доступных моделей Ollama');
            }
        }

        // Build conversation context for Ollama
        let fullPrompt = systemPrompt + '\n\n';
        
        messages.forEach(msg => {
            const role = msg.role === 'assistant' ? 'Assistant' : 'Human';
            fullPrompt += `${role}: ${msg.content}\n\n`;
        });
        
        fullPrompt += 'Assistant: ';

        const requestBody = {
            model: this.selectedModel,
            prompt: fullPrompt,
            stream: false,
            options: {
                temperature: 0.7,
                top_p: 0.9,
                top_k: 40,
                num_predict: 1000
            }
        };

        try {
            const response = await fetch(`${this.baseUrl}/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            if (!data.response) {
                throw new Error('Invalid response format from Ollama');
            }

            return {
                content: data.response.trim(),
                usage: {
                    prompt_tokens: data.prompt_eval_count || 0,
                    completion_tokens: data.eval_count || 0,
                    total_tokens: (data.prompt_eval_count || 0) + (data.eval_count || 0)
                },
                model: data.model
            };

        } catch (error) {
            throw new Error(this.handleApiError(error));
        }
    }

    async testConnection() {
        try {
            await this.loadModels();
            if (this.models.length === 0) {
                return { 
                    success: false, 
                    message: 'Ollama запущен, но нет доступных моделей. Установите модель командой: ollama pull llama2' 
                };
            }
            
            const testMessages = [{ role: 'user', content: 'Hello' }];
            const result = await this.sendMessage(testMessages, 'You are a helpful assistant.');
            return { success: true, message: `Подключение к Ollama успешно! Доступно моделей: ${this.models.length}` };
        } catch (error) {
            return { 
                success: false, 
                message: `Ошибка подключения к Ollama: ${error.message}. Убедитесь, что Ollama запущен (ollama serve)` 
            };
        }
    }

    async setModel(modelId) {
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

    async pullModel(modelName) {
        try {
            const response = await fetch(`${this.baseUrl}/pull`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: modelName })
            });

            if (!response.ok) {
                throw new Error(`Failed to pull model: ${response.statusText}`);
            }

            // Note: This is a streaming response, but we'll handle it simply
            return { success: true, message: `Модель ${modelName} загружается...` };
        } catch (error) {
            return { success: false, message: `Ошибка загрузки модели: ${error.message}` };
        }
    }

    // Ollama-specific prompt optimization
    buildIronyPrompt(level, language, exerciseHistory = []) {
        const basePrompt = super.buildIronyPrompt(level, language, exerciseHistory);
        
        // Add Ollama-specific instructions for better performance
        return `${basePrompt}

АДАПТИВНОСТЬ ЯЗЫКА: Внимательно анализируй язык пользователя и отвечай на том же языке, независимо от изначальных настроек.

СТИЛЬ ОТВЕТА: Будь кратким, но содержательным. Локальные модели работают лучше с четкими структурированными инструкциями.

ВАЖНО: Ответ должен быть практичным и применимым в реальных ситуациях.`;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OllamaProvider;
} else {
    window.OllamaProvider = OllamaProvider;
}