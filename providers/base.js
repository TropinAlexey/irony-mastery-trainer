// Base AI Provider - Abstract Strategy Pattern
class AIProvider {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.name = 'Base Provider';
        this.models = [];
    }

    // Abstract methods to be implemented by concrete providers
    async sendMessage(messages, systemPrompt) {
        throw new Error('sendMessage method must be implemented by concrete provider');
    }

    validateApiKey(apiKey) {
        throw new Error('validateApiKey method must be implemented by concrete provider');
    }

    getModels() {
        return this.models;
    }

    getName() {
        return this.name;
    }

    // Common prompt building method
    buildIronyPrompt(level, language, exerciseHistory = []) {
        const basePrompt = `Ты опытный наставник по развитию искусства иронии и элегантного общения. 

ВАЖНЫЕ ПРИНЦИПЫ:
- "Экологичность" - всегда оставаться в моральной победе над оппонентом
- Ирония должна быть многослойной и изысканной
- Цель: выиграть так, чтобы проигравший не понял что проиграл
- Использовать силу оппонента против него самого (как в айкидо)

УРОВЕНЬ УЧЕНИКА: ${level}
ЯЗЫК ОБУЧЕНИЯ: ${language}

ЗАДАЧА: Дай одно персонализированное упражнение на сегодня. Формат:
1. Краткое описание ситуации или диалога
2. Задание (что нужно сделать)
3. Критерии успеха
4. Пример хорошего ответа (если нужен)

${exerciseHistory.length > 0 ? `ИСТОРИЯ ПРЕДЫДУЩИХ УПРАЖНЕНИЙ:\n${exerciseHistory.join('\n')}\n` : ''}

Будь кратким, но точным. Упражнение должно быть практичным и применимым в реальной жизни.`;

        return basePrompt;
    }

    // Common analysis prompt
    buildAnalysisPrompt(userResponse, exercise, language) {
        return `Проанализируй ответ ученика на упражнение по развитию иронии:

УПРАЖНЕНИЕ: ${exercise}
ОТВЕТ УЧЕНИКА: ${userResponse}
ЯЗЫК: ${language}

Дай краткий анализ в формате:
✅ Что получилось хорошо:
⚠️ Что можно улучшить:
💡 Конкретная рекомендация:
🎯 Оценка (1-10):

Будь конструктивным и вдохновляющим.`;
    }

    // Utility method for handling API errors
    handleApiError(error) {
        console.error(`${this.name} API Error:`, error);
        
        if (error.message?.includes('401') || error.message?.includes('unauthorized')) {
            return 'Ошибка авторизации. Проверьте правильность API ключа.';
        }
        
        if (error.message?.includes('429') || error.message?.includes('rate limit')) {
            return 'Превышен лимит запросов. Попробуйте позже.';
        }
        
        if (error.message?.includes('insufficient_quota')) {
            return 'Недостаточно средств на балансе API.';
        }
        
        return `Ошибка ${this.name}: ${error.message || 'Неизвестная ошибка'}`;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIProvider;
} else {
    window.AIProvider = AIProvider;
}