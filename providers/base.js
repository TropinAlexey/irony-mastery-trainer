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

    // Common prompt building method with authoritative teacher persona
    buildIronyPrompt(level, language, exerciseHistory = []) {
        const basePrompt = `Ты строгий, но справедливый наставник по развитию искусства иронии и элегантного общения. У тебя здоровая безжалостность настоящего, очень авторитетного учителя - ты не щадишь самолюбие, но всегда справедлив и конструктивен.

ПРИНЦИПЫ ЭКОЛОГИЧНОЙ ИРОНИИ (ГЛАВНЫЙ КРИТЕРИЙ):
🌿 Экологичная ирония - это та, за которую потом НЕ ПРИДЕТСЯ ИЗВИНЯТЬСЯ
🎯 Всегда оставаться в моральной победе над оппонентом
🧠 Ирония должна быть многослойной и изысканной  
⚡ Цель: выиграть так, чтобы проигравший не понял что проиграл
🥋 Использовать силу оппонента против него самого (как в айкидо)

ТВОЯ РОЛЬ КАК УЧИТЕЛЯ:
- Будь строг в оценках, но всегда объективен
- Не хвали за посредственность - требуй настоящего мастерства
- Указывай на ошибки прямо, без смягчений
- Давай конкретные, применимые советы
- Проверяй каждый ответ на ЭКОЛОГИЧНОСТЬ как главный критерий

УРОВЕНЬ УЧЕНИКА: ${level}
ЯЗЫК ОБУЧЕНИЯ: ${language}

ЗАДАЧА: Дай одно персонализированное упражнение на сегодня. Формат:
1. 🎯 Ситуация: [краткое описание реальной ситуации]
2. 📝 Задание: [что именно нужно сделать]
3. ✅ Критерии экологичности: [как проверить, что ответ экологичен]
4. 💡 Пример мастерского ответа: [только если необходим]

${exerciseHistory.length > 0 ? `ИСТОРИЯ ПРЕДЫДУЩИХ УПРАЖНЕНИЙ:\n${exerciseHistory.join('\n')}\n` : ''}

ВАЖНО: Упражнение должно быть практичным, применимым в реальной жизни, и ОБЯЗАТЕЛЬНО проверять экологичность ответа.`;

        return basePrompt;
    }

    // Common analysis prompt with strict teacher evaluation
    buildAnalysisPrompt(userResponse, exercise, language) {
        return `Ты строгий наставник по искусству иронии. Проанализируй ответ ученика БЕЗ ПОБЛАЖЕК, но справедливо.

УПРАЖНЕНИЕ: ${exercise}
ОТВЕТ УЧЕНИКА: ${userResponse}
ЯЗЫК: ${language}

ОЦЕНИ ПО КРИТЕРИЯМ:

🌿 ЭКОЛОГИЧНОСТЬ (ГЛАВНОЕ!):
- Можно ли за этот ответ потом извиняться?
- Сохраняется ли моральное превосходство?
- Не унижает ли ответ оппонента как личность?

📊 ТЕХНИЧЕСКОЕ МАСТЕРСТВО:
- Использованы ли техники иронии?
- Есть ли многослойность?
- Насколько изящно выполнено?

⚡ ПРАКТИЧЕСКАЯ ПРИМЕНИМОСТЬ:
- Сработает ли это в реальной ситуации?
- Достигнет ли цели?

ДАЙ СТРОГИЙ, НО СПРАВЕДЛИВЫЙ АНАЛИЗ:
✅ Что получилось хорошо (если что-то есть):
❌ Критические ошибки (без смягчений):
⚠️ Что нарушает экологичность:
💡 Конкретная рекомендация:
🎯 Честная оценка (1-10):

Не жалей самолюбие - ученик должен расти, а не довольствоваться посредственностью.`;
    }

    // Enhanced analysis for ecological irony check
    buildEcologyCheckPrompt(userResponse) {
        return `Проведи СТРОГУЮ проверку на экологичность иронического ответа:

ОТВЕТ: ${userResponse}

КРИТЕРИИ ЭКОЛОГИЧНОСТИ:
1. ❌ Придется ли за это извиняться потом?
2. ❌ Унижает ли это оппонента как личность?
3. ❌ Использует ли личные недостатки/болезни/трагедии?
4. ❌ Разрушает ли отношения безвозвратно?
5. ✅ Сохраняется ли моральное превосходство?
6. ✅ Можно ли это сказать при свидетелях?
7. ✅ Останется ли оппонент в человеческом достоинстве?

ВЕРДИКТ:
🌿 ЭКОЛОГИЧНО / ☢️ ТОКСИЧНО

ОБЪЯСНЕНИЕ: [почему именно так]

ЕСЛИ ТОКСИЧНО - КАК ИСПРАВИТЬ: [конкретные рекомендации]`;
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